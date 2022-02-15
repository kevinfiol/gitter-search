import m from "mithril";
import { searchChannel } from './api';
import { Input } from './components/Input';

const state = {
    results: [],
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