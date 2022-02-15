import m from "mithril";
import { searchChannel } from './api';
import { Input } from './components/Input';

const state = {
    results: [
      {
        "id": "5fe362f3c746c6431cd0fc16",
        "text": "> I haven't used Hyperapp, but having to use `text()` for text nodes seems cumbersome. 🤔\n\n@mtsknn I'm using Hyperapp currently on a project. @fuzetsu 's [microh](https://github.com/fuzetsu/microh) is great for wrapping Hyperapp's `h` and `text` function in a `m` function that looks very similar to Mithril's :wink: ",
        "html": "<blockquote>\n<p>I haven&#39;t used Hyperapp, but having to use <code>text()</code> for text nodes seems cumbersome. 🤔</p></blockquote>\n<p><span data-link-type=\"mention\" data-screen-name=\"mtsknn\" class=\"mention\">@mtsknn</span> I&#39;m using Hyperapp currently on a project. <span data-link-type=\"mention\" data-screen-name=\"fuzetsu\" class=\"mention\">@fuzetsu</span> &#39;s <a href=\"https://github.com/fuzetsu/microh\" rel=\"nofollow noopener noreferrer\" target=\"_blank\" class=\"link \">microh</a> is great for wrapping Hyperapp&#39;s <code>h</code> and <code>text</code> function in a <code>m</code> function that looks very similar to Mithril&#39;s :wink: </p>",
        "sent": "2020-12-23T15:32:03.560Z",
        "unread": false,
        "readBy": 23,
        "urls": [
          {
            "url": "https://github.com/fuzetsu/microh"
          }
        ],
        "mentions": [
          {
            "screenName": "mtsknn",
            "userId": "5c8c1e57d73408ce4fbad304",
            "userIds": []
          },
          {
            "screenName": "fuzetsu",
            "userId": "554c3b0f15522ed4b3e017ae",
            "userIds": []
          }
        ],
        "issues": [],
        "meta": [],
        "highlights": [
          "Hyperapp's"
        ],
        "v": 1,
        "fromUser": {
          "id": "5570bb2c15522ed4b3e1701e",
          "username": "kevinfiol",
          "displayName": "Kevin Fiol",
          "url": "/kevinfiol",
          "avatarUrl": "https://avatars-02.gitter.im/gh/uv/4/kevinfiol",
          "avatarUrlSmall": "https://avatars2.githubusercontent.com/u/4752973?v=4&s=60",
          "avatarUrlMedium": "https://avatars2.githubusercontent.com/u/4752973?v=4&s=128",
          "v": 92,
          "gv": "4"
        }
      },
      {
        "id": "5cd98ab0252dbb75154dda7b",
        "text": "has anyone here given Hyperapp V2 a shot? wondering how it compares to Hyperapp 1. I know this isn't the Hyperapp chat, but curious what other Mithrilers think.",
        "html": "has anyone here given Hyperapp V2 a shot? wondering how it compares to Hyperapp 1. I know this isn&#39;t the Hyperapp chat, but curious what other Mithrilers think.",
        "sent": "2019-05-13T15:18:08.979Z",
        "unread": false,
        "readBy": 22,
        "urls": [],
        "mentions": [],
        "issues": [],
        "meta": [],
        "highlights": [
          "Hyperapp"
        ],
        "v": 1,
        "fromUser": {
          "id": "5b3a60c1d73408ce4f9f5c64",
          "username": "kevinfiol_gitlab",
          "displayName": "kevinfiol",
          "url": "/kevinfiol_gitlab",
          "avatarUrl": "https://avatars-05.gitter.im/g/u/kevinfiol_gitlab",
          "avatarUrlSmall": "https://assets.gitlab-static.net/uploads/-/system/user/avatar/1528382/avatar.png?s=60",
          "avatarUrlMedium": "https://assets.gitlab-static.net/uploads/-/system/user/avatar/1528382/avatar.png?s=128",
          "v": 7
        }
      }
    ],
    inputs: {
        channel: {
            attrs: { type: 'text', placeholder: 'channel name' },
            value: 'mithriljs/mithril.js'
        },
        term: {
            attrs: { type: 'text', placeholder: 'search term' },
            value: 'hyperapp'
        },
        user: {
            attrs: { type: 'text', placeholder: 'username' },
            value: 'kevinfiol'
        },
        limit: {
            attrs: { type: 'number', min: 0, max: 100 },
            value: 2
        }
    }
};

const actions = {
    setInput: (key, value) => {
        state.inputs[key].value = value;
    }
};

m.mount(document.getElementById('app'), {
    view: () =>
        m('div',
            m('h1', 'gitter search'),

            m('form', {
                onsubmit: async (ev) => {
                    ev.preventDefault();
                    const { channel, term, user, limit } = state.inputs;

                    const res = await searchChannel({
                        channel: channel.value,
                        term: term.value,
                        user: user.value,
                        limit: limit.value
                    });

                    console.log(res);
                }
            },
                Object.entries(state.inputs).map(([name, input]) =>
                    m(Input, {
                        ...input.attrs,
                        value: input.value,
                        onInput: (value) => actions.setInput(name, value)
                    })
                ),

                m('button', { type: 'submit' }, 'search')
            ),

            m('div',

            )
        )
});