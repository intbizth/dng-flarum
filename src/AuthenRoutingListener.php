<?php

namespace Dng\Flarum;

use Dng\Flarum\LoginController;
use Dng\Flarum\LogoutController;
use Flarum\Event\ConfigureForumRoutes;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Symfony\Component\Yaml\Yaml;

class AuthenRoutingListener
{
    /**
     * @var SettingsRepositoryInterface
     */
    private $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
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
        // will logout without token
        $logoutUrl = '/d-logout';

        // todo: setting provider or db setttings
        if ($file = $this->settings->get(DngForum::SETTING_FILE_KEY, __DIR__ . '/../../../../dng.settings.yml')) {
            if (file_exists($file)) {
                $settings = Yaml::parse(file_get_contents($file));

                if (!empty($settings['logout_url'])) {
                    $logoutUrl = $settings['logout_url'];
                }
            }
        }

        $event->get($logoutUrl, 'dngLogout', LogoutController::class);
    }
}
