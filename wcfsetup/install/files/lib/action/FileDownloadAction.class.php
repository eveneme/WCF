<?php

namespace wcf\action;

use Laminas\Diactoros\Response;
use Laminas\Diactoros\Stream;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use wcf\data\file\File;
use wcf\http\Helper;
use wcf\system\exception\IllegalLinkException;
use wcf\system\exception\PermissionDeniedException;
use wcf\util\FileUtil;

/**
 * Offers a file for download.
 *
 * @author Alexander Ebert
 * @copyright 2001-2024 WoltLab GmbH
 * @license GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @since 6.1
 */
final class FileDownloadAction implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $parameters = Helper::mapQueryParameters(
            $request->getQueryParams(),
            <<<'EOT'
                array {
                    id: positive-int
                }
                EOT,
        );

        $file = new File($parameters['id']);
        if (!$file->fileID) {
            throw new IllegalLinkException();
        }

        $processor = $file->getProcessor();
        if ($processor === null) {
            throw new IllegalLinkException();
        }

        if (!$processor->canDownload($file)) {
            throw new PermissionDeniedException();
        }

        $filename = $file->getPath() . $file->getSourceFilename();
        $response = new Response(
            new Stream($filename),
        );

        $mimeType = FileUtil::getMimeType($filename);

        // TODO: This should use `FileReader` instead.

        $inlineMimeTypes = [
            'image/gif',
            'image/jpeg',
            'image/png',
            'image/x-png',
            'application/pdf',
            'image/pjpeg',
            'image/webp',
        ];

        $dispositionType = \in_array($mimeType, $inlineMimeTypes) ? 'inline' : 'attachment';

        return $response->withHeader('content-type', $mimeType)
            ->withHeader(
                'content-disposition',
                \sprintf(
                    '%s; filename="%s"',
                    $dispositionType,
                    $file->filename,
                ),
            );
    }
}
