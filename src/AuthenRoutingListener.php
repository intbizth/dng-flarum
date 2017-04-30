<?php

namespace Dng\Flarum;

use Dng\Flarum\LoginController;
use Dng\Flarum\LogoutController;
use Flarum\Event\ConfigureForumRoutes;
use Flarum\Extension\ExtensionManager;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;

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

        $event->post($this->settings->get('dng.login_url', $settings['login_url']), 'dngLogin', LoginController::class);
        $event->get($this->settings->get('dng.logout_url', $settings['logout_url']), 'dngLogout', LogoutController::class);
    }
}
