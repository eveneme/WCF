<?php
namespace wcf\system\package\plugin;
use wcf\data\package\Package;
use wcf\system\cache\CacheHandler;
use wcf\system\exception\SystemException;
use wcf\system\WCF;

/**
 * Executes individual PHP scripts during installation.
 * 
 * @author	Alexander Ebert
 * @copyright	2001-2013 WoltLab GmbH
 * @license	GNU Lesser General Public License <http://opensource.org/licenses/lgpl-license.php>
 * @package	com.woltlab.wcf
 * @subpackage	system.package.plugin
 * @category	Community Framework
 */
class ScriptPackageInstallationPlugin extends AbstractPackageInstallationPlugin {
	/**
	 * @see	\wcf\system\package\plugin\IPackageInstallationPlugin::install()
	 */
	public function install() {
		parent::install();
		
		$abbreviation = 'wcf';
		if (isset($this->instruction['attributes']['application'])) {
			$abbreviation = $this->instruction['attributes']['application'];
		}
		else if ($this->installation->getPackage()->isApplication) {
			$abbreviation = Package::getAbbreviation($this->installation->getPackage()->package);
		}
		
		$dirConstant = strtoupper($abbreviation) . '_DIR';
		if (!defined($dirConstant)) {
			throw new SystemException("Can not execute script-PIP, abbreviation '".$abbreviation."' is unknown");
		}
		
		// reset WCF cache
		CacheHandler::getInstance()->flushAll();
		
		// run script
		$this->run(constant($dirConstant).$this->instruction['value']);
		
		// delete script
		if (@unlink(constant($dirConstant).$this->instruction['value'])) {
			// delete file log entry
			$sql = "DELETE FROM	wcf".WCF_N."_package_installation_file_log
				WHERE		packageID = ?
						AND filename = ?";
			$statement = WCF::getDB()->prepareStatement($sql);
			$statement->execute(array(
				$this->installation->getPackageID(),
				$this->instruction['value']
			));
		}
	}
	
	/**
	 * Runs the script with the given path.
	 * 
	 * @param	string		$scriptPath
	 */
	private function run($scriptPath) {
		include($scriptPath);
	}
	
	/**
	 * @see	\wcf\system\package\plugin\IPackageInstallationPlugin::install()
	 */
	public function hasUninstall() {
		// scripts can't be uninstalled
		return false;
	}
	
	/**
	 * @see	\wcf\system\package\plugin\IPackageInstallationPlugin::install()
	 */
	public function uninstall() {
		// does nothing
	}
}
