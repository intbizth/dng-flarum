<?php

namespace Dng\Flarum;

use Flarum\Event\ConfigureWebApp;
use Illuminate\Contracts\Events\Dispatcher;

class AddAssetListener
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureWebApp::class, [$this, 'addAssets']);
    }

    /**
     * @param ConfigureClientView $event
     */
    public function addAssets(ConfigureWebApp $event)
    {
        $event->addAssets(__DIR__ . '/../js/lib/string.js');

        if ($event->isForum()) {
            $event->addAssets([
                __DIR__ . '/../js/forum/dist/extension.js',
                __DIR__ . '/../less/forum/extension.less',
            ]);

            $event->addBootstrapper('toro/dng/main');
        }

        if ($event->isAdmin()) {
            /*$event->addAssets([
                __DIR__.'/../js/admin/dist/extension.js'
            ]);

            $event->addBootstrapper('toro/dng/main');*/
        }
    }
}
