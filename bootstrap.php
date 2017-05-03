<?php

use Dng\Flarum\AddApiDataListener;
use Dng\Flarum\AddAssetListener;
use Dng\Flarum\AuthenRoutingListener;
use Dng\Flarum\DiscussionThaiSlugListener;
use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(AddApiDataListener::class);
    $events->subscribe(AddAssetListener::class);
    $events->subscribe(AuthenRoutingListener::class);
    $events->subscribe(DiscussionThaiSlugListener::class);
};
