<?php

namespace Dng\Flarum;

use Flarum\Event\DiscussionWillBeSaved;
use Illuminate\Contracts\Events\Dispatcher;

class DiscussionThaiSlugListener
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(DiscussionWillBeSaved::class, [$this, 'assignDiscussionSlug']);
    }

    /**
     * @param DiscussionWillBeSaved $event
     */
    public function assignDiscussionSlug(DiscussionWillBeSaved $event)
    {
        $event->discussion->slug = self::slug($event->discussion->title);
    }

    /**
     * @param string $text
     * @param int $len
     *
     * @return string
     */
    public static function slug($text, $len = 60)
    {
        return URLify::slug($text, $len);
    }
}
