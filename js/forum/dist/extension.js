System.register('toro/dng/components/LoginMe', ['flarum/components/LogInModal'], function (_export) {
  'use strict';

  var LogInModal, LoginMe;
  return {
    setters: [function (_flarumComponentsLogInModal) {
      LogInModal = _flarumComponentsLogInModal['default'];
    }],
    execute: function () {
      LoginMe = (function (_LogInModal) {
        babelHelpers.inherits(LoginMe, _LogInModal);

        function LoginMe() {
          babelHelpers.classCallCheck(this, LoginMe);
          babelHelpers.get(Object.getPrototypeOf(LoginMe.prototype), 'constructor', this).apply(this, arguments);
        }

        return LoginMe;
      })(LogInModal);

      _export('default', LoginMe);
    }
  };
});;
System.register('toro/dng/main', ['flarum/extend', 'flarum/components/HeaderPrimary', 'flarum/components/HeaderSecondary', 'flarum/components/SettingsPage', 'flarum/components/LogInModal', 'flarum/components/DiscussionHero', 'flarum/components/CommentPost', 'flarum/components/PostUser', 'flarum/helpers/listItems', 'flarum/helpers/avatar', 'flarum/utils/ItemList', 'toro/dng/components/LoginMe'], function (_export) {
    'use strict';

    var extend, HeaderPrimary, HeaderSecondary, SettingsPage, LogInModal, DiscussionHero, CommentPost, PostUser, listItems, avatar, ItemList, LoginMe;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsHeaderPrimary) {
            HeaderPrimary = _flarumComponentsHeaderPrimary['default'];
        }, function (_flarumComponentsHeaderSecondary) {
            HeaderSecondary = _flarumComponentsHeaderSecondary['default'];
        }, function (_flarumComponentsSettingsPage) {
            SettingsPage = _flarumComponentsSettingsPage['default'];
        }, function (_flarumComponentsLogInModal) {
            LogInModal = _flarumComponentsLogInModal['default'];
        }, function (_flarumComponentsDiscussionHero) {
            DiscussionHero = _flarumComponentsDiscussionHero['default'];
        }, function (_flarumComponentsCommentPost) {
            CommentPost = _flarumComponentsCommentPost['default'];
        }, function (_flarumComponentsPostUser) {
            PostUser = _flarumComponentsPostUser['default'];
        }, function (_flarumHelpersListItems) {
            listItems = _flarumHelpersListItems['default'];
        }, function (_flarumHelpersAvatar) {
            avatar = _flarumHelpersAvatar['default'];
        }, function (_flarumUtilsItemList) {
            ItemList = _flarumUtilsItemList['default'];
        }, function (_toroDngComponentsLoginMe) {
            LoginMe = _toroDngComponentsLoginMe['default'];
        }],
        execute: function () {

            app.initializers.add('toro-dng', function () {
                var links = app.forum.attribute('dng.links') || {};

                $('#home-link').unbind('click').click(function (e) {
                    e.preventDefault();
                    window.location.href = links.home;
                }).attr('href', links.home);

                var addLinks = function addLinks(items, section) {
                    if (links[section]) {
                        var privated = !!app.session.user;

                        for (var i = 0; i < links[section].length; i++) {
                            var link = links[section][i];
                            if (link['private'] === privated || link['private'] === undefined) {
                                var css = "Button Button--link " + (link.css || '');
                                items.add(link.id, m(
                                    'a',
                                    { href: link.href, className: css },
                                    ' ',
                                    link.label,
                                    ' '
                                ));
                            }
                        }
                    }
                };

                extend(HeaderPrimary.prototype, 'items', function (items) {
                    addLinks(items, 'primary');
                });

                extend(HeaderSecondary.prototype, 'items', function (items) {
                    addLinks(items, 'secondary');
                });

                extend(SettingsPage.prototype, 'settingsItems', function (items) {
                    if (items.has('account')) {
                        items.remove('account');
                    }
                });

                // backup login dialog, use for admin login
                // console.app.showMeLoginModal()
                LoginMe.prototype.content = LoginMe.prototype.content;
                app.showMeLoginModal = function () {
                    app.modal.show(new LoginMe());
                };

                // end user goto dng login page
                LogInModal.prototype.content = function () {
                    var loginUrl = app.forum.data.attributes['wuethrich44-sso.login_url'];

                    if (loginUrl) {
                        window.location.href = loginUrl;
                    }

                    // TODO: custom dng login form
                    return [m(
                        'div',
                        { className: 'Modal-body' },
                        m(
                            'div',
                            { className: 'Form Form--centered' },
                            m(
                                'h4',
                                null,
                                'Please login before writing discussion'
                            )
                        )
                    )];
                };

                DiscussionHero.prototype.view = function () {
                    var discussion = this.props.discussion;
                    var post = discussion.posts()[0];
                    var startUser = post.user();
                    var postUser = new PostUser({ post: post });
                    var CommentPostCp = new CommentPost({ post: post });
                    var contents = CommentPostCp.content();

                    // remove body
                    CommentPostCp.content = function () {
                        return [contents[0]];
                    };

                    // remove action controls
                    CommentPostCp.actionItems = function () {
                        return new ItemList();
                    };

                    return m(
                        'header',
                        { className: 'Hero DiscussionHero Hero--dng' },
                        m(
                            'div',
                            { className: 'container' },
                            m(
                                'div',
                                { className: 'Hero--title' },
                                m(
                                    'ul',
                                    { className: 'DiscussionHero-items' },
                                    listItems(this.items().toArray())
                                )
                            ),
                            m(
                                'div',
                                { className: 'Hero--creator' },
                                CommentPostCp.render()
                            )
                        )
                    );
                };
            });
        }
    };
});