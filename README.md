# Groot

> **THIS REPO IS IN ALPHA STATUS. ITS USE IN PRODUCTION IS NOT RECOMMENDED.**

The official SiteCrafting WordPress starter theme.

[![Build Status](https://travis-ci.org/sitecrafting/groot.svg?branch=master)](https://travis-ci.org/sitecrafting/groot)

## Migrating from the old, closed-source Groot

For client projects built on top of Groot, there are a few new ways of doing things using more consistent, reliable tooling that comes bundled with the Lando environment. Note that running `lando yarn` isn't necessary in normal circumstances: the new Lando environment installs everything for you on `lando start`.

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

### Building a new release

Groot includes a script for building itself and creating a release. To create a tag and corresponding release called `vX.Y.Z`:

```bash
scripts/build-release.sh vX.Y.Z
```

This will create a .tar.gz and a .zip archive which you can upload to a new release on GitHub.

If you have [`hub`](https://hub.github.com/) installed, it will also prompt you to optionally create a release directly!
