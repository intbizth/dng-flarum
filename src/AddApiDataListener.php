<?php

namespace Dng\Flarum;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\PrepareApiAttributes;
use Flarum\Event\PrepareApiData;
use Flarum\Extension\ExtensionManager;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Eloquent\Collection;
use Symfony\Component\Yaml\Yaml;

class AddApiDataListener
{
    /**
     * @var ExtensionManager
     */
    private $extensionManager;

    /**
     * @var SettingsRepositoryInterface
     */
    private $settings;

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
        $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
    }

    /**
     * @param PrepareApiAttributes $event
     */
    public function prepareApiAttributes(PrepareApiAttributes $event)
    {
        if ($event->isSerializer(ForumSerializer::class)) {
            $ext = $this->extensionManager->getExtension(DngForum::NAME);
            $links = (array) $ext->composerJsonAttribute('extra.flarum-extension.settings')['links'];

            // todo: setting provider or db setttings
            if ($file = $this->settings->get(DngForum::SETTING_FILE_KEY)) {
                if (file_exists($file)) {
                    $settings = Yaml::parse(file_get_contents($file));

                    if (!empty($settings['links'])) {
                        $links = $settings['links'];
                    }
                }
            }

            $event->attributes = array_merge($event->attributes, [
                'dng.links' => $links
            ]);
        }
    }
}
