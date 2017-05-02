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
     * @param $text
     *
     * @return string
     */
    private static function slug($text)
    {
        /*$string = preg_replace('/[^a-z0-9ก-ฮแเใไโฯๆะาอิอีอึอือุอูอ์อ่อ้อ๊อ๋อัอฺอำอํ]/i', '-', $text);
        $string = preg_replace('/-+/', '-', $string);
        $string = preg_replace('/-$|^-/', '', $string);
        $string = strtolower($string);

        return $string ?: $text;*/

        // https://github.com/bryanbraun/anchorjs/blob/master/anchor.js#L221
        // Regex for finding the nonsafe URL characters (many need escaping): & +$,:;=?@"#{}|^~[`%!']./()*\
        $nonsafeChars = '/[& +$,:;=?@"#{}|^~[`%!\'\]\.\/\(\)\*\\]/';

        $string = trim($text);
        $string = preg_replace("'", '', $string);
        $string = preg_replace($nonsafeChars, '-', $string);
        $string = preg_replace('/-{2,}/', '-', $string);
        //$string = substr($string, 0, 64);
        $string = preg_replace('/^-+|-+$/', '', $string);
        $string = strtolower($string);
        $string = trim($text);

        return $string ?: $text;
    }
}
