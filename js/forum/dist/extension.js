System.register('toro/dng/main', ['flarum/extend', 'flarum/components/HeaderPrimary', 'flarum/components/HeaderSecondary', 'flarum/components/SettingsPage', 'flarum/components/SessionDropdown', 'flarum/components/LogInModal'], function (_export) {
    'use strict';

    var extend, HeaderPrimary, HeaderSecondary, SettingsPage, SessionDropdown, LogInModal;
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
            });
        }
    };
});