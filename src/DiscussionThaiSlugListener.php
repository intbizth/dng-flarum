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
     * @param $str
     *
     * @return string
     */
    private static function slug($str)
    {
        $str = preg_replace('/[^a-z0-9ก-ฮแเใไโฯๆะาอิอีอึอือุอูอ์อ่อ้อ๊อ๋อัอฺอำอํ]/i', '-', $str);
        $str = preg_replace('/-+/', '-', $str);
        $str = preg_replace('/-$|^-/', '', $str);
        $str = strtolower($str);

        return $str ?: '-';
    }
}
