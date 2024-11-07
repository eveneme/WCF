<?php

namespace wcf\system\file\processor;

use wcf\data\file\File;
use wcf\data\user\avatar\UserAvatar;
use wcf\data\user\UserEditor;
use wcf\data\user\UserProfile;
use wcf\system\cache\runtime\UserProfileRuntimeCache;
use wcf\system\database\util\PreparedStatementConditionBuilder;
use wcf\system\exception\UserInputException;
use wcf\system\user\storage\UserStorageHandler;
use wcf\system\WCF;
use wcf\util\FileUtil;

/**
 * @author      Olaf Braun
 * @copyright   2001-2024 WoltLab GmbH
 * @license     GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @since       6.2
 */
final class UserAvatarFileProcessor extends AbstractFileProcessor
{
    private const SESSION_VARIABLE = 'wcf_user_avatar_processor_%d';

    #[\Override]
    public function getObjectTypeName(): string
    {
        return 'com.woltlab.wcf.user.avatar';
    }

    #[\Override]
    public function getAllowedFileExtensions(array $context): array
    {
        return \explode("\n", WCF::getSession()->getPermission('user.profile.avatar.allowedFileExtensions'));
    }

    #[\Override]
    public function canAdopt(File $file, array $context): bool
    {
        $userFromContext = $this->getUser($context);
        $userFromCoreFile = $this->getUserByFile($file);

        if ($userFromCoreFile === null) {
            return true;
        }

        if ($userFromContext->userID === $userFromCoreFile->userID) {
            return true;
        }

        return false;
    }

    #[\Override]
    public function adopt(File $file, array $context): void
    {
        $user = $this->getUser($context);
        if ($user === null) {
            return;
        }

        // Save the `fileID` in the session variable so that the current user can delete it the old avatar
        if ($user->avatarFileID !== null) {
            WCF::getSession()->register(\sprintf(self::SESSION_VARIABLE, $user->avatarFileID), TIME_NOW);
            WCF::getSession()->update();
        }

        (new UserEditor($user->getDecoratedObject()))->update([
            'avatarFileID' => $file->fileID,
        ]);
        // reset user storage
        UserStorageHandler::getInstance()->reset([$user->userID], 'avatar');
    }

    #[\Override]
    public function acceptUpload(string $filename, int $fileSize, array $context): FileProcessorPreflightResult
    {
        $user = $this->getUser($context);

        if ($user === null) {
            return FileProcessorPreflightResult::InvalidContext;
        }

        if (!UserAvatarFileProcessor::canEditAvatar($user)) {
            return FileProcessorPreflightResult::InsufficientPermissions;
        }

        if ($fileSize > $this->getMaximumSize($context)) {
            return FileProcessorPreflightResult::FileSizeTooLarge;
        }

        if (!FileUtil::endsWithAllowedExtension($filename, $this->getAllowedFileExtensions($context))) {
            return FileProcessorPreflightResult::FileExtensionNotPermitted;
        }

        return FileProcessorPreflightResult::Passed;
    }

    #[\Override]
    public function validateUpload(File $file): void
    {
        $imageData = @\getimagesize($file->getPathname());
        if ($imageData === false) {
            throw new UserInputException('file', 'noImage');
        }

        if ($imageData[0] !== $imageData[1]) {
            throw new UserInputException('file', 'notSquare');
        }

        if ($imageData[0] != UserAvatar::AVATAR_SIZE && $imageData[0] != UserAvatar::AVATAR_SIZE_2X) {
            throw new UserInputException('file', 'wrongSize');
        }
    }

    #[\Override]
    public function canDelete(File $file): bool
    {
        $user = $this->getUserByFile($file);
        if ($user === null) {
            return WCF::getSession()->getVar(
                \sprintf(self::SESSION_VARIABLE, $file->fileID)
            ) !== null;
        }

        return UserAvatarFileProcessor::canEditAvatar($user);
    }

    #[\Override]
    public function canDownload(File $file): bool
    {
        $user = $this->getUserByFile($file);
        if ($user === null) {
            return false;
        }

        return $user->canSeeAvatar();
    }

    #[\Override]
    public function getThumbnailFormats(): array
    {
        return [
            // TODO did we need thumbnails for sizes less then 128x128?
            // 96x96
            // 64x64
            // 48x48
            // 32x32
            new ThumbnailFormat('128', UserAvatar::AVATAR_SIZE, UserAvatar::AVATAR_SIZE, false),
            new ThumbnailFormat('256', UserAvatar::AVATAR_SIZE_2X, UserAvatar::AVATAR_SIZE_2X, false),
        ];
    }

    #[\Override]
    public function delete(array $fileIDs, array $thumbnailIDs): void
    {
        \array_map(
            static fn(int $fileID) => WCF::getSession()->unregister(
                \sprintf(self::SESSION_VARIABLE, $fileID)
            ),
            $fileIDs
        );

        $conditionBuilder = new PreparedStatementConditionBuilder();
        $conditionBuilder->add('avatarFileID IN (?)', [$fileIDs]);

        $sql = "UPDATE wcf1_user
                SET    avatarFileID = ?
                " . $conditionBuilder;
        $statement = WCF::getDB()->prepare($sql);
        $statement->execute([null, ...$conditionBuilder->getParameters()]);
    }

    #[\Override]
    public function countExistingFiles(array $context): ?int
    {
        $user = $this->getUser($context);
        if ($user === null) {
            return null;
        }

        return $user->avatarFileID === null ? 0 : 1;
    }

    #[\Override]
    public function getMaximumSize(array $context): ?int
    {
        /**
         * Reject the file if it is larger than 750 kB after resizing. A worst-case
         * completely-random 128x128 PNG is around 35 kB and JPEG is around 50 kB.
         *
         * Animated GIFs can be much larger depending on the length of animation,
         * 750 kB seems to be a reasonable upper bound for anything that can be
         * considered reasonable with regard to "distraction" and mobile data
         * volume.
         */
        return 750_000;
    }

    #[\Override]
    public function getImageCropperConfiguration(): ?ImageCropperConfiguration
    {
        return ImageCropperConfiguration::createExact(
            new ImageCropSize(UserAvatar::AVATAR_SIZE, UserAvatar::AVATAR_SIZE),
            new ImageCropSize(UserAvatar::AVATAR_SIZE_2X, UserAvatar::AVATAR_SIZE_2X)
        );
    }

    private function getUser(array $context): ?UserProfile
    {
        $userID = $context['objectID'] ?? null;
        if ($userID === null) {
            return null;
        }

        return UserProfileRuntimeCache::getInstance()->getObject($userID);
    }

    private function getUserByFile(File $file): ?UserProfile
    {
        $sql = "SELECT userID
                FROM   wcf1_user
                WHERE  avatarFileID = ?";
        $statement = WCF::getDB()->prepare($sql);
        $statement->execute([$file->fileID]);
        $userID = $statement->fetchSingleColumn();

        if ($userID === false) {
            return null;
        }

        return UserProfileRuntimeCache::getInstance()->getObject($userID);
    }

    public static function canEditAvatar(UserProfile $user): bool
    {
        if (WCF::getSession()->getPermission('admin.user.canEditUser')) {
            return true;
        }

        if ($user->userID !== WCF::getUser()->userID) {
            return false;
        }

        if (WCF::getUser()->disableAvatar) {
            return false;
        }

        return WCF::getSession()->getPermission('user.profile.avatar.canUploadAvatar');
    }
}
