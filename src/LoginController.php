<?php

namespace Dng\Flarum;

use Flarum\Core\Repository\UserRepository;
use Flarum\Core\User;
use Flarum\Forum\Controller\LogInController as FlarumLogInController;
use Flarum\Http\Controller\ControllerInterface;
use Illuminate\Contracts\Container\Container;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class LoginController implements ControllerInterface
{
    /**
     * @var Container
     */
    protected $container;

    /**
     * @param Container $container
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * {@inheritdoc}
     */
    public function handle(ServerRequestInterface $request)
    {
        // try to logout current session
        $this->container
            ->make(LogoutController::class)
            ->handle($request)
        ;

        $data = $request->getParsedBody();

        /** @var UserRepository $users */
        $users = $this->container->make(UserRepository::class);

        /** @var User $user create user when first onec */
        if (!$user = $users->findByIdentification($data['username'])) {
            $user = User::register($data['username'], $data['email'], $data['password']);
            $user->activate();
            $user->save();
        }

        $data['identification'] = $data['username'];
        $request = $request->withParsedBody($data);

        /** @var ResponseInterface $response */
        $response = $this->container
            ->make(FlarumLogInController::class)
            ->handle($request)
        ;

        if (200 === $response->getStatusCode()) {
            $res = json_decode($response->getBody());

            if ($res->userId && $data['email'] !== $user->email) {
                $user->email = $data['email'];
                $user->update();
            }
        }

        return $response;
    }
}
