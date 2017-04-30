import {extend} from 'flarum/extend';
import HeaderPrimary from 'flarum/components/HeaderPrimary';
import HeaderSecondary from 'flarum/components/HeaderSecondary';
import SettingsPage from 'flarum/components/SettingsPage';
import SessionDropdown from 'flarum/components/SessionDropdown';
import LogInModal from 'flarum/components/LogInModal';

app.initializers.add('toro-dng', function () {
    var addLinks = function (items, section)
    {
        var links = app.forum.attribute('dng.links') || {};
        if (links[section]) {
            var privated = !!app.session.user;

            for (var i = 0; i < links[section].length; i++) {
                var link = links[section][i];
                if (link.private === privated || link.private === undefined) {
                    var css = "Button Button--link " + (link.css || '');
                    items.add(link.id, <a href = {link.href} className = {css}> {link.label} </a>);
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

    LogInModal.prototype.content = function() {
        window.location.href = app.forum.attribute('dng.login');
        // TODO: custom dng login form
        return [];
    }
});
