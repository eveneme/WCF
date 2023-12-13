<?php

namespace wcf\system\user\authentication\configuration;

use wcf\system\appmaker\app\preset\event\ConfigurationLoading;
use wcf\system\event\EventHandler;
use wcf\system\SingletonFactory;

/**
 * Provides the instance of the active configuration of the user authentication process.
 *
 * @author      Marcel Werk
 * @copyright   2001-2023 WoltLab GmbH
 * @license     WoltLab License <http://www.woltlab.com/license-agreement.html>
 */
final class UserAuthenticationConfigurationFactory extends SingletonFactory
{
    private UserAuthenticationConfiguration $configuration;

    #[\Override]
    protected function init()
    {
        $this->configuration = $this->getDefaultConfiguration();

        $event = new ConfigurationLoading();
        EventHandler::getInstance()->fire($event);
        if ($event->getConfigration()) {
            $this->configuration = $event->getConfigration();
        }
    }

    public function getConfigration(): UserAuthenticationConfiguration
    {
        return $this->configuration;
    }

    private function getDefaultConfiguration(): UserAuthenticationConfiguration
    {
        return new UserAuthenticationConfiguration(
            !\REGISTER_DISABLED,
        );
    }
}
