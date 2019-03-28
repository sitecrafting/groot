# Groot

> **THIS REPO IS IN ALPHA STATUS. ITS USE IN PRODUCTION IS NOT RECOMMENDED.**

The official SiteCrafting WordPress starter theme.

## Migrating from the old, closed-source Groot

There are a few new ways of doing things using more consistent, reliable tooling that comes bundled with the Lando environment. Note that running `lando yarn` isn't necessary in normal circumstances: the new Lando environment installs everything for you on `lando start`.

| Task                   | Old command           | New command              | Notes                         |
| ---------------------- | --------------------- | ------------------------ | ----------------------------- |
| Install dependencies   | `npm install`         | `lando yarn`             | Lando does this automatically |
| Add a dependency       | `npm install lib-xyz` | `lando yarn add lib-xyz` |                               |
| Watch LESS/JS          | `grunt watch`         | `lando webpack --watch`  |                               |
| Recompile LESS/JS once | `grunt`               | `lando webpack`          |                               |

### Asset Paths in LESS files

Webpack handles image paths differently. The simplest way to refer to theme files is to use the absolute path from the webroot.

Put something like this in `base/variables.less`:

```less
@theme-path: '/wp-content/themes/<theme-dir-name>/';
```

Replace `<theme-dir-name>` with the actual theme directory name. Now you can use the `@theme-path` variable like this:

```less
* { background-image: url(~'@{theme-path}img/icons/my-icon.svg'); }
```

### Adding code to functions.php

To make Groot as flexible as possible, all non-generic code has been stripped out of functions.php (In Conifer-speak, the [config callback](https://coniferplug.in/glossary#config-callback)). We now use some [custom tooling](https://github.com/sitecrafting/wp-cli-scaffold-groot-command) to generate that code for every new project.

To add SiteCrafting specific stuff, edit [this file](https://bitbucket.org/sitecrafting/wordpress/src/master/config_callback.inc).

## Development

To start hacking on the Groot starter theme itself, run:

```
git clone git@github.com:sitecrafting/groot.git && cd groot
lando start
```

This will prompt you for site info admin credentials to set up. Then it does some setup/cleanup. After this, you should have a fully functional WordPress site running Groot!
