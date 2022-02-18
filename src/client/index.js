import m from "mithril";
import snarkdown from "snarkdown";
import tinydate from "tinydate";
import { searchRoom } from './api';
import { Input } from './components/Input';
import { Spinner } from './components/Spinner';

const NOW = new Date();
const GITTER_URL = 'https://gitter.im';

const dateStamp = tinydate('{YYYY}-{MM}-{DD}');
const timeStamp = tinydate('{YYYY}-{MM}-{DD} at {HH}:{mm}')
const messageUrlStamp = (messageId, roomName) => `${GITTER_URL}/${roomName}?at=${messageId}`;

const state = {
    status: { loading: false, error: '' },
    inputs: {
        room: {
            attrs: { type: 'text', placeholder: 'room name, e.g. `mithriljs/mithril.js`' },
            value: ''
        },
        term: {
            attrs: { type: 'text', placeholder: 'search term' },
            value: ''
        },
        user: {
            attrs: { type: 'text', placeholder: 'username' },
            value: ''
        },
        limit: {
            attrs: { type: 'number', min: 0, max: 100 },
            value: 50
        },
        from: {
            attrs: { type: 'date' },
            // default to a 2 year window
            value: dateStamp(new Date(NOW.getFullYear() - 2, NOW.getMonth(), NOW.getDate()))
        },
        to: {
            attrs: { type: 'date' },
            value: dateStamp(NOW)
        }
    },
    data: {
        room: {
            roomId: '',
            roomName: '',
        },
        results: [],
    }
};

const actions = {
    setLoading: (loading) => {
        state.status.loading = loading;
        m.redraw();
    },

    setInput: (key, value) => {
        state.inputs[key].value = value;
    },

    setResults: (results) => {
        state.data.results = results;
    },

    setRoomData: ({ roomId, roomName }) => {
        state.data.room = {
            ...state.data.room,
            roomId,
            roomName
        };
    }
};

const App = ({ attrs: { scope, name } }) => {
    if (scope && name && scope.trim() && name.trim()) {
        const roomName = `${scope}/${name}`;
        actions.setInput('room', roomName);
    }

    return {
        view: () =>
            m('div',
                m('h1', 'gitter search'),

                m('form', {
                    onsubmit: async (ev) => {
                        ev.preventDefault();
                        const { room, term, user, limit, from, to } = state.inputs;

                        actions.setLoading(true);

                        const { data, error, message } = await searchRoom({
                            roomName: room.value,
                            term: term.value,
                            user: user.value,
                            limit: limit.value,
                            from: from.value,
                            to: to.value
                        });

                        const { results, roomId, roomName } = data;
                        actions.setResults(results);
                        actions.setRoomData({ roomId, roomName });
                        actions.setLoading(false);
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

                m('div.search-content',
                    state.status.loading &&
                        m(Spinner)
                    ,

                    state.data.results.length > 0 &&
                        m('div.results-container', { class: state.status.loading ? 'opacity-50' : '' },
                            state.data.results.map((result) =>
                                m('div.result',
                                    m('div.flex.space-between',
                                        m('b', result.fromUser.username),
                                        m('span',
                                            m('a', { href: messageUrlStamp(result.id, state.data.room.roomName) },
                                                timeStamp(new Date(result.sent))
                                            )
                                        )
                                    ),
                                    m('p', m.trust(snarkdown(result.text)))
                                )
                            )
                        )
                    ,
                )
            )
    };
};

m.route.prefix = '';
m.route(document.getElementById('app'), '/', {
    '/': {
        render: () => m(App)
    },

    '/:scope/:name': {
        render: ({ attrs: { scope, name } }) => m(App, { scope, name })
    }
});