<?php

namespace Dng\Flarum;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\PrepareApiAttributes;
use Flarum\Event\PrepareApiData;
use Flarum\Foundation\Application;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Eloquent\Collection;

class AddApiDataListener
{
    /**
     * @var Application
     */
    private $app;

    /**
     * @var SettingsRepositoryInterface
     */
    private $settings;

    public function __construct(Application $app, SettingsRepositoryInterface $settings)
    {
        $this->app = $app;
        $this->settings = $settings;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
    }

    /**
     * @param PrepareApiAttributes $event
     */
    public function prepareApiAttributes(PrepareApiAttributes $event)
    {
        if ($event->isSerializer(ForumSerializer::class)) {
            $event->attributes = array_merge($event->attributes, [
                'dng.links' => $this->app->config('dng.links', [])
            ]);
        }
    }
}
