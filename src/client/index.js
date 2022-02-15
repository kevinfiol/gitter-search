import m from "mithril";
import { searchChannel } from './api';
import { Input } from './components/Input';

const state = {
    results: [],
    inputs: {
        channel: { placeholder: 'channel name', value: 'mithriljs/mithril.js' },
        query: { placeholder: 'search terms', value: '' }
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
                    const { elements } = ev.target;

                    const channel = elements.channel.value;
                    const query = elements.query.value;

                    console.log('test');
                    const res = await searchChannel(channel, query);
                    console.log(res);
                }
            },
                Object.keys(state.inputs).map(name =>
                    m(Input, {
                        name,
                        placeholder: state.inputs[name].placeholder,
                        value: state.inputs[name].value,
                        onInput: (value) => actions.setInput(name, value)
                    })
                ),

                m('button', { type: 'submit' }, 'search')
            )
        )
});