import m from 'mithril';

export const Input = () => ({
    view: ({ attrs: { name, placeholder, value, onInput } }) =>
        m('input.input', {
            name,
            placeholder,
            value,
            oninput: ({ target }) => onInput && onInput(target.value)
        })
});