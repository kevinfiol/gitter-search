import m from 'mithril';

export const Input = () => ({
    view: ({ attrs }) => {
        const { onInput, ...partialAttrs } = attrs;

        return (
            m('input.input', {
                ...partialAttrs,
                oninput: ({ target }) => onInput && onInput(target.value)
            })
        );
    }
});