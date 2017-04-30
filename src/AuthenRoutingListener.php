<?php

namespace Dng\Flarum;

use Dng\Flarum\LoginController;
use Dng\Flarum\LogoutController;
use Flarum\Event\ConfigureForumRoutes;
use Flarum\Extension\ExtensionManager;
use Flarum\Foundation\Application;
use Illuminate\Contracts\Events\Dispatcher;

class AuthenRoutingListener
{
    /**
     * @var Application
     */
    private $app;

    /**
     * @var ExtensionManager
     */
    private $extensionManager;

    public function __construct(Application $app, ExtensionManager $extensionManager)
    {
        $this->app = $app;
        $this->extensionManager = $extensionManager;
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

        $event->post($this->app->config('dng.login_url', $settings['login_url']), 'dngLogin', LoginController::class);
        $event->get($this->app->config('dng.logout_url', $settings['logout_url']), 'dngLogout', LogoutController::class);
    }
}
