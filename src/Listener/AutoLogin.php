<?php

namespace Dng\Flarum\Listener;

use Flarum\Event\ConfigureMiddleware;
use Illuminate\Contracts\Events\Dispatcher;

class AutoLogin
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureMiddleware::class, [$this, 'onConfigureMiddleware']);
    }

    /**
     * @param DiscussionWillBeSaved $event
     */
    public function onConfigureMiddleware(ConfigureMiddleware $event)
    {
        //
    }
}
