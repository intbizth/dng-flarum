import {extend} from 'flarum/extend';
import HeaderPrimary from 'flarum/components/HeaderPrimary';
import HeaderSecondary from 'flarum/components/HeaderSecondary';
import SettingsPage from 'flarum/components/SettingsPage';
import LogInModal from 'flarum/components/LogInModal';
import DiscussionHero from 'flarum/components/DiscussionHero';
import CommentPost from 'flarum/components/CommentPost';
import PostUser from 'flarum/components/PostUser';
import listItems from 'flarum/helpers/listItems';
import avatar from 'flarum/helpers/avatar';
import ItemList from 'flarum/utils/ItemList';
import LoginMe from 'toro/dng/components/LoginMe';

app.initializers.add('toro-dng', function () {
    var links = app.forum.attribute('dng.links') || {};

    $('#home-link')
        .unbind('click')
        .click(e => {
            e.preventDefault();
            window.location.href = links.home;
        })
        .attr('href', links.home)
    ;

    var addLinks = function (items, section)
    {
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
    LogInModal.prototype.content = function() {
        const loginUrl = app.forum.data.attributes['wuethrich44-sso.login_url'];

        if (loginUrl) {
            window.location.href = loginUrl;
        }

        // TODO: custom dng login form
        return [
            <div className="Modal-body">
                <div className="Form Form--centered">
                    <h4>Please login before writing discussion</h4>
                </div>
            </div>
        ];
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
