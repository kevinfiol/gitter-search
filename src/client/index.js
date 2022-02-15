import m from "mithril";

m.mount(document.getElementById('app'), {
  view: () =>
    m('div',
      m('h1', 'gitter search')
    )
});