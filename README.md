# Groot

> **THIS REPO IS IN ALPHA STATUS. ITS USE IN PRODUCTION IS NOT RECOMMENDED.**

The official SiteCrafting WordPress starter theme.

## Migrating from the old, closed-source Groot

For client projects built on top of Groot, there are a few new ways of doing things using more consistent, reliable tooling that comes bundled with the Lando environment. Note that running `lando yarn` isn't necessary in normal circumstances: the new Lando environment installs everything for you on `lando start`.

| Task                   | Old command           | New command              | Notes                         |
| ---------------------- | --------------------- | ------------------------ | ----------------------------- |
| Install dependencies   | `npm install`         | `lando yarn`             | Lando does this automatically |
| Add a dependency       | `npm install lib-xyz` | `lando yarn add lib-xyz` |                               |
| Watch LESS/JS          | `grunt watch`         | `lando webpack --watch`  |                               |
| Recompile LESS/JS once | `grunt`               | `lando webpack`          |                               |


## Development

To start hacking on the Groot starter theme itself, run:

```bash
git clone git@github.com:sitecrafting/groot.git && cd groot
lando start
```

This will prompt you for site info admin credentials to set up. Then it does some setup/cleanup. After this, you should have a fully functional WordPress site running Groot!

### Run commands from the root directory

For compiling LESS/JS assets within Groot itself, you should be able to run commands within the root directory. For example:

```bash
cd /path/to/groot
lando webpack --watch
```

