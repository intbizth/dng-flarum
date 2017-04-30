<?php

namespace Dng\Flarum;

use Dng\Flarum\LoginController;
use Dng\Flarum\LogoutController;
use Flarum\Event\ConfigureForumRoutes;
use Flarum\Extension\ExtensionManager;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Symfony\Component\Yaml\Yaml;

class AuthenRoutingListener
{
    /**
     * @var SettingsRepositoryInterface
     */
    private $settings;

    /**
     * @var ExtensionManager
     */
    private $extensionManager;

    public function __construct(ExtensionManager $extensionManager, SettingsRepositoryInterface $settings)
    {
        $this->extensionManager = $extensionManager;
        $this->settings = $settings;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureForumRoutes::class, [$this, 'onConfigureForumRoutes']);
    }

    /**
     * @param ConfigureForumRoutes $event
     */
    public function onConfigureForumRoutes(ConfigureForumRoutes $event)
    {
        $ext = $this->extensionManager->getExtension(DngForum::NAME);
        $settings = (array) $ext->composerJsonAttribute('extra.flarum-extension.settings');
        $loginUrl = $settings['login_url'];
        $logoutUrl = $settings['logout_url'];

        // todo: setting provider or db setttings
        if ($file = $this->settings->get(DngForum::SETTING_FILE_KEY)) {
            if (file_exists($file)) {
                $settings = Yaml::parse(file_get_contents($file));

                if (!empty($settings['login_url'])) {
                    $loginUrl = $settings['login_url'];
                }

                if (!empty($settings['logout_url'])) {
                    $logoutUrl = $settings['logout_url'];
                }
            }
        }

        $event->post($loginUrl, 'dngLogin', LoginController::class);
        $event->get($logoutUrl, 'dngLogout', LogoutController::class);
    }
}
