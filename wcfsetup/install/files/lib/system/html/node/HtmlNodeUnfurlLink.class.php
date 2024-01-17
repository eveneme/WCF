<?php

namespace wcf\system\html\node;

use Laminas\Diactoros\Uri;
use wcf\data\unfurl\url\UnfurlUrlAction;
use wcf\util\DOMUtil;
use wcf\util\Url;

/**
 * Helper class to unfurl link objects.
 *
 * @author      Joshua Ruesweg
 * @copyright   2001-2021 WoltLab GmbH
 * @license     GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @since       5.4
 */
class HtmlNodeUnfurlLink extends HtmlNodePlainLink
{
    public const UNFURL_URL_ID_ATTRIBUTE_NAME = "data-unfurl-url-id";

    /**
     * Marks a link element with the UnfurlUrlID.
     */
    public static function setUnfurl(HtmlNodePlainLink $link): void
    {
        if (!$link->isStandalone()) {
            return;
        }

        if (!Url::is($link->href)) {
            return;
        }

        $parsedUrl = Url::parse($link->href);

        // Ignore non-standard ports.
        if ($parsedUrl['port']) {
            return;
        }

        // Ignore non-HTTP schemes.
        if (!\in_array($parsedUrl['scheme'], ['http', 'https'])) {
            return;
        }

        self::removeStyling($link);

        $url = self::lowercaseHostname($link->href);
        $urlID = self::findOrCreate($url);

        $link->link->setAttribute(self::UNFURL_URL_ID_ATTRIBUTE_NAME, $urlID);
    }

    private static function removeStyling(HtmlNodePlainLink $element): void
    {
        if ($element->topLevelParent == null) {
            return;
        }
        foreach ($element->topLevelParent->childNodes as $child) {
            DOMUtil::removeNode($child);
        }

        $element->topLevelParent->appendChild($element->link);
    }

    private static function lowercaseHostname(string $url): string
    {
        $uri = new Uri($url);
        $uri = $uri->withHost(\mb_strtolower($uri->getHost()));

        return $uri->__toString();
    }

    private static function findOrCreate(string $url): int
    {
        $object = new UnfurlUrlAction([], 'findOrCreate', [
            'data' => [
                'url' => $url,
            ],
        ]);
        $returnValues = $object->executeAction();

        return $returnValues['returnValues']->urlID;
    }
}
