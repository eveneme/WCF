<?php
declare(strict_types=1);
namespace wcf\acp\page;
use wcf\data\package\Package;
use wcf\page\AbstractPage;
use wcf\system\exception\IllegalLinkException;
use wcf\system\WCF;

/**
 * Shows all information about an installed package.
 * 
 * @author	Marcel Werk
 * @copyright	2001-2018 WoltLab GmbH
 * @license	GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package	WoltLabSuite\Core\Acp\Page
 */
class PackagePage extends AbstractPage {
	/**
	 * @inheritDoc
	 */
	public $activeMenuItem = 'wcf.acp.menu.link.package';
	
	/**
	 * list of compatible API versions
	 * @var integer[]
	 */
	public $compatibleVersions = [];
	
	/**
	 * @inheritDoc
	 */
	public $neededPermissions = ['admin.configuration.package.canUpdatePackage', 'admin.configuration.package.canUninstallPackage'];
	
	/**
	 * id of the package
	 * @var	integer
	 */
	public $packageID = 0;
	
	/**
	 * package object
	 * @var	Package
	 */
	public $package;
	
	/**
	 * Plugin-Store fileID
	 * @var integer
	 */
	public $pluginStoreFileID = 0;
	
	/**
	 * @inheritDoc
	 */
	public function readParameters() {
		parent::readParameters();
		
		if (isset($_REQUEST['id'])) $this->packageID = intval($_REQUEST['id']);
		$this->package = new Package($this->packageID);
		if (!$this->package->packageID) {
			throw new IllegalLinkException();
		}
	}
	
	/**
	 * @inheritDoc
	 */
	public function readData() {
		parent::readData();
		
		$sql = "SELECT  pluginStoreFileID
			FROM    wcf".WCF_N."_package_update
			WHERE   package = ?
				AND pluginStoreFileID <> 0";
		$statement = WCF::getDB()->prepareStatement($sql);
		$statement->execute([$this->package->package]);
		$this->pluginStoreFileID = intval($statement->fetchSingleColumn());
		
		$sql = "SELECT          version
			FROM            wcf".WCF_N."_package_compatibility
			WHERE           packageID = ?
					AND version >= ?
			ORDER BY        version";
		$statement = WCF::getDB()->prepareStatement($sql);
		$statement->execute([
			$this->package->packageID,
			WSC_API_VERSION
		]);
		while ($version = $statement->fetchColumn()) {
			$this->compatibleVersions[] = $version;
		}
	}
	
	/**
	 * @inheritDoc
	 */
	public function assignVariables() {
		parent::assignVariables();
		
		WCF::getTPL()->assign([
			'compatibleVersions' => $this->compatibleVersions,
			'package' => $this->package,
			'pluginStoreFileID' => $this->pluginStoreFileID
		]);
	}
}
