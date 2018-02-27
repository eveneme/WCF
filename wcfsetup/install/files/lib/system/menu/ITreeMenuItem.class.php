<?php
declare(strict_types=1);
namespace wcf\system\menu;

/**
 * Any tree menu item should implement this interface.
 * 
 * @author	Marcel Werk
 * @copyright	2001-2018 WoltLab GmbH
 * @license	GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package	WoltLabSuite\Core\System\Menu
 */
interface ITreeMenuItem {
	/**
	 * Returns the link of this item.
	 * 
	 * @return	string
	 */
	public function getLink();
}
