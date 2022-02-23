# gitter-search

A tool to search [Gitter](https://gitter.im) rooms. Built with [Mithril.js](https://mithril.js.org).

## Usage

Navigate to https://gitter.pages.dev and enter the name of the Gitter room you'd like to search. Gitter room names are in the form of `{organization}/{repo}`, so for example `mithriljs/mithril.js`.

You can also append the room name to the URL for quicker searching, for example, https://gitter.pages.dev/mithriljs/mithril.js.

## Development

Development requirements include:

* Node 16.x (although 14.x is probably fine)
* Deno 1.18.x

The server portion of the codebase is written using Deno, and deployed via Deno Deploy. The Deno dev script requires [denon](https://github.com/denosaurs/denon) for monitoring changes.

`.env.defaults` provides default ENV variables. Copy these to `.env` to start building/developing.

Once everything is set, install Node dependencies, and run scripts:

```bash
pnpm install

# run client dev script
pnpm run dev

# run server dev script
pnpm run dev:server

# build client code
pnpm run build
```
