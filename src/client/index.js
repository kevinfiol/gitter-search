import m from "mithril";
import tinydate from "tinydate";
import { searchRoom } from './api';
import { Spinner } from './components/Spinner';

const NOW = new Date();
const GITTER_URL = 'https://gitter.im';

const dateStamp = tinydate('{YYYY}-{MM}-{DD}');
const timeStamp = tinydate('{YYYY}-{MM}-{DD} at {HH}:{mm}')
const messageUrlStamp = (messageId, roomName) => `${GITTER_URL}/${roomName}?at=${messageId}`;

const state = {
    status: { loading: false, error: '' },
    inputs: {
        room: '',
        term: '',
        user: '',
        limit: 50,
        from: dateStamp(new Date(NOW.getFullYear() - 2, NOW.getMonth(), NOW.getDate())),
        to: dateStamp(NOW)
    },
    data: {
        roomId: '',
        roomName: '',
        results: [],
    }
};

const actions = {
    setLoading: (loading) => {
        if (loading) state.status.error = '';
        state.status.loading = loading;
        m.redraw();
    },

    setError: (error) => {
        state.status.error = error;
    },

    setInput: (key, value) => {
        state.inputs[key] = value;
    },

    setResults: (results) => {
        state.data.results = results;
    },

    setRoomName: (roomName) => {
        state.data.roomName = roomName;
    },

    setRoomId: (roomId) => {
        state.data.roomId = roomId;
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
                m('h1', m('a[href="/"]', 'gitter.im search')),

                m('form', {
                    onsubmit: async (ev) => {
                        ev.preventDefault();
                        if (state.status.loading) return;

                        const { room, term, user, limit, from, to } = state.inputs;
                        actions.setLoading(true);

                        let roomId = state.data.roomId;

                        if (room !== state.data.roomName) {
                            roomId = '';
                        }

                        const { data, error, message } = await searchRoom({
                            roomId,
                            roomName: room,
                            term: term,
                            user: user,
                            limit: limit,
                            from: from,
                            to: to
                        });

                        if (error) {
                            console.error(message);
                            actions.setError(message);
                        } else {
                            const { results, roomId, roomName } = data;
                            actions.setResults(results);
                            actions.setRoomId(roomId);
                            actions.setRoomName(roomName);
                        }

                        actions.setLoading(false);
                    }
                },
                    m('div.input-group',
                        m('input.input', {
                            type: 'text',
                            placeholder: 'mithriljs/mithril.js',
                            required: true,
                            value: state.inputs.room,
                            oninput: ({ target }) => actions.setInput('room', target.value)
                        }),

                        m('input.input', {
                            type: 'text',
                            placeholder: 'username',
                            value: state.inputs.user,
                            oninput: ({ target }) => actions.setInput('user', target.value)
                        }),

                        m('input.input', {
                            type: 'number',
                            min: 0,
                            max: 100,
                            value: state.inputs.limit,
                            oninput: ({ target }) => actions.setInput('limit', target.value)
                        })
                    ),

                    m('div.input-group',
                        m('input.input', {
                            type: 'date',
                            value: state.inputs.from,
                            oninput: ({ target }) => actions.setInput('from', target.value)
                        }),

                        m('input.input', {
                            type: 'date',
                            value: state.inputs.to,
                            oninput: ({ target }) => actions.setInput('to', target.value)
                        })
                    ),

                    m('div.input-group',
                        m('input.input.font-1-em', {
                            type: 'text',
                            placeholder: 'search terms',
                            value: state.inputs.term,
                            oninput: ({ target }) => actions.setInput('term', target.value)
                        }),

                        m('button', { type: 'submit' }, 'search')
                    )
                ),

                m('div.search-content',
                    state.status.loading &&
                        m(Spinner)
                    ,

                    state.status.error &&
                        m('div.message',
                            state.status.error
                        )
                    ,

                    state.data.roomId && !state.status.error &&
                        m('div.results-container', { class: state.status.loading ? 'opacity-50' : '' },
                            m('div.flex.flex-center.monospace',
                                `${state.data.results.length} results`
                            ),

                            state.data.results.map((result) =>
                                m('div.result',
                                    m('div.header',
                                        m('b', result.fromUser.username),
                                        m('span',
                                            m('a', { href: messageUrlStamp(result.id, state.data.roomName) },
                                                timeStamp(new Date(result.sent))
                                            )
                                        )
                                    ),
                                    m('p', m.trust(result.html))
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
