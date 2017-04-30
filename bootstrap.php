<?php

use Dng\Flarum\AuthenRoutingListener;
use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(AuthenRoutingListener::class);
};
