import {extend} from 'flarum/extend';
import HeaderPrimary from 'flarum/components/HeaderPrimary';
import HeaderSecondary from 'flarum/components/HeaderSecondary';
import SettingsPage from 'flarum/components/SettingsPage';
import SessionDropdown from 'flarum/components/SessionDropdown';
import LogInModal from 'flarum/components/LogInModal';
import DiscussionHero from 'flarum/components/DiscussionHero';
import CommentPost from 'flarum/components/CommentPost';
import PostUser from 'flarum/components/PostUser';
import listItems from 'flarum/helpers/listItems';
import avatar from 'flarum/helpers/avatar';
import ItemList from 'flarum/utils/ItemList';

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

    DiscussionHero.prototype.view = function() {
        const discussion = this.props.discussion;
        const post = discussion.posts()[0];
        const startUser = post.user();
        const postUser = new PostUser({post: post});
        const CommentPostCp = new CommentPost({post});
        const contents = CommentPostCp.content();

        // remove body
        CommentPostCp.content = function () {
            return [contents[0]];
        };

        // remove action controls
        CommentPostCp.actionItems = function () {
            return new ItemList();
        }

        return (
            <header className="Hero DiscussionHero Hero--dng">
                <div className="container">
                    <div className="Hero--title">
                        <ul className="DiscussionHero-items">{listItems(this.items().toArray())}</ul>
                    </div>
                    <div className="Hero--creator">
                        {CommentPostCp.render()}
                    </div>
                </div>
            </header>
        );
    }
});
