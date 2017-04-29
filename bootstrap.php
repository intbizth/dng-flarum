<?php

use Dng\Flarum\Listener\AutoLogin;
use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(AutoLogin::class);
};
