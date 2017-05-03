<?php

namespace Dng\Flarum;

use Flarum\Core\User;
use Flarum\Event\UserLoggedOut;
use Flarum\Http\Controller\ControllerInterface;
use Flarum\Http\Exception\TokenMismatchException;
use Flarum\Http\Rememberer;
use Flarum\Http\SessionAuthenticator;
use Illuminate\Contracts\Events\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Zend\Diactoros\Response\JsonResponse;

class LogoutController implements ControllerInterface
{
    /**
     * @var Dispatcher
     */
    protected $events;

    /**
     * @var SessionAuthenticator
     */
    protected $authenticator;

    /**
     * @var Rememberer
     */
    protected $rememberer;

    /**
     * @param Dispatcher $events
     * @param SessionAuthenticator $authenticator
     * @param Rememberer $rememberer
     */
    public function __construct(Dispatcher $events, SessionAuthenticator $authenticator, Rememberer $rememberer)
    {
        $this->events = $events;
        $this->authenticator = $authenticator;
        $this->rememberer = $rememberer;
    }

    /**
     * {@inheritdoc}
     */
    public function handle(ServerRequestInterface $request)
    {
        $session = $request->getAttribute('session');
        $response = new JsonResponse([]);

        /** @var User $user */
        if ($user = User::find($session->get('user_id'))) {
            $this->authenticator->logOut($session);
            $user->accessTokens()->delete();
            $this->events->fire(new UserLoggedOut($user));

            $response = new JsonResponse([
                'userId' => $user->id
            ]);

            $response = $this->rememberer->forget($response);
        }

        return $response;
    }
}
