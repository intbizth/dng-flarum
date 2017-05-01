System.register('toro/dng/main', ['flarum/extend', 'flarum/components/HeaderPrimary', 'flarum/components/HeaderSecondary', 'flarum/components/SettingsPage', 'flarum/components/SessionDropdown', 'flarum/components/LogInModal', 'flarum/components/DiscussionHero', 'flarum/components/CommentPost', 'flarum/components/PostUser', 'flarum/helpers/listItems', 'flarum/helpers/avatar', 'flarum/utils/ItemList'], function (_export) {
    'use strict';

    var extend, HeaderPrimary, HeaderSecondary, SettingsPage, SessionDropdown, LogInModal, DiscussionHero, CommentPost, PostUser, listItems, avatar, ItemList;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsHeaderPrimary) {
            HeaderPrimary = _flarumComponentsHeaderPrimary['default'];
        }, function (_flarumComponentsHeaderSecondary) {
            HeaderSecondary = _flarumComponentsHeaderSecondary['default'];
        }, function (_flarumComponentsSettingsPage) {
            SettingsPage = _flarumComponentsSettingsPage['default'];
        }, function (_flarumComponentsSessionDropdown) {
            SessionDropdown = _flarumComponentsSessionDropdown['default'];
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
        }],
        execute: function () {

            app.initializers.add('toro-dng', function () {
                var addLinks = function addLinks(items, section) {
                    var links = app.forum.attribute('dng.links') || {};
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
                    if (items.has('signUp')) {
                        items.remove('signUp');
                    }

                    if (items.has('logIn')) {
                        items.remove('logIn');
                    }

                    addLinks(items, 'secondary');
                });

                extend(SettingsPage.prototype, 'settingsItems', function (items) {
                    if (items.has('account')) {
                        items.remove('account');
                    }
                });

                extend(SessionDropdown.prototype, 'items', function (items) {
                    if (items.has('logOut')) {
                        items.remove('logOut');
                    }
                });

                LogInModal.prototype.content = function () {
                    window.location.href = app.forum.attribute('dng.login');
                    // TODO: custom dng login form
                    return [];
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