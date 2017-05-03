<?php

namespace Dng\Flarum;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\PrepareApiAttributes;
use Flarum\Event\PrepareApiData;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Eloquent\Collection;
use Symfony\Component\Yaml\Yaml;

class AddApiDataListener
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
        $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
    }

    /**
     * @param PrepareApiAttributes $event
     */
    public function prepareApiAttributes(PrepareApiAttributes $event)
    {
        if ($event->isSerializer(ForumSerializer::class)) {
            // todo: setting provider or db setttings
            if ($file = $this->settings->get(DngForum::SETTING_FILE_KEY, __DIR__ . '/../../../../dng.settings.yml')) {
                if (file_exists($file)) {
                    $settings = Yaml::parse(file_get_contents($file));

                    if (!empty($settings['links'])) {
                        $event->attributes['dng.links'] = $settings['links'];
                    }
                }
            }
        }
    }
}
