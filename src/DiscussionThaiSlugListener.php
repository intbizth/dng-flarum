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
        $nonsafeChars = '/[& +$,:;=?@"#{}|^~[`%!\'\]\.\/\(\)\*\\]/g';

        // Note: we trim hyphens after truncating because truncating can cause dangling hyphens.
        // Example string:                                    // " ⚡⚡ Don't forget: URL fragments should be i18n-friendly, hyphenated, short, and clean."

        $string = trim($text);                              // "⚡⚡ Don't forget: URL fragments should be i18n-friendly, hyphenated, short, and clean."

        $string = preg_replace("'", '', $string);        // "⚡⚡ Dont forget: URL fragments should be i18n-friendly, hyphenated, short, and clean."

        $string = preg_replace($nonsafeChars, '-', $string);  // "⚡⚡-Dont-forget--URL-fragments-should-be-i18n-friendly--hyphenated--short--and-clean-"

        $string = preg_replace('/-{2,}/g', '-', $string);     // "⚡⚡-Dont-forget-URL-fragments-should-be-i18n-friendly-hyphenated-short-and-clean-"

        //$string = substr($string, 0, 64);                     // "⚡⚡-Dont-forget-URL-fragments-should-be-i18n-friendly-hyphenated-"

        $string = preg_replace('/^-+|-+$/gm', '', $string);   // "⚡⚡-Dont-forget-URL-fragments-should-be-i18n-friendly-hyphenated"

        $string = strtolower($string);                        // "⚡⚡-dont-forget-url-fragments-should-be-i18n-friendly-hyphenated"

        return $string ?: $text;
    }
}
