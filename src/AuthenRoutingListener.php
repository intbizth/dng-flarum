<?php

namespace Dng\Flarum;

use Dng\Flarum\LoginController;
use Dng\Flarum\LogoutController;
use Flarum\Event\ConfigureForumRoutes;
use Flarum\Foundation\Application;
use Illuminate\Contracts\Events\Dispatcher;

class AuthenRoutingListener
{
    /**
     * @var Application
     */
    private $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
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
        $event->post($this->app->config('dng.login_url', '/dng-login'), 'dngLogin', LoginController::class);
        $event->get($this->app->config('dng.logout_url', '/dng-logout'), 'dngLogout', LogoutController::class);
    }
}
