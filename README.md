# Groot

> **THIS REPO IS IN ALPHA STATUS. ITS USE IN PRODUCTION IS NOT RECOMMENDED.**

The official SiteCrafting WordPress starter theme.

[![Build Status](https://travis-ci.org/sitecrafting/groot.svg?branch=master)](https://travis-ci.org/sitecrafting/groot)

## Migrating from the old, closed-source Groot

For client projects built on top of Groot, there are a few new ways of doing things using more consistent, reliable tooling that comes bundled with the Lando environment. Note that running `lando yarn` isn't necessary in normal circumstances: the new Lando environment installs everything for you on `lando start`.

| Task                   |  New command              | Notes                         |
| ---------------------- | ------------------------ | ----------------------------- |
| Install dependencies   | `lando yarn`             | Lando does this automatically |
| Add a dependency       | `lando yarn add lib-xyz` |                               |
| Watch LESS/JS          | `lando webpack --watch`  |                               |
| Recompile LESS/JS once | `lando webpack`          |                               |

### Asset Paths in LESS files

Webpack handles image paths differently. The simplest way to refer to theme files is to use the absolute path from the webroot.

At build time, webpack will update the `@theme-path` variable in `base/variables.less` based on your theme's directory name:

```less
@theme-path: '/wp-content/themes/<theme-dir-name>/';
```

This will enable you to use the `@theme-path` variable like this:

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

__NOTE: For now, we don't import the SiteCrafting WP starter database when spinning up Groot locally. This can be imported manually, if desired. Note that this database expected ACF Pro to be in place, which is also not installed automatically for local development. ACF Pro will need to be installed manually if you require it.__

## SITKA Support
* Template content is required to be wrapped with an element with the class of `sitka-search-content-container` in order to crawl with sitka insights
* Feedback collector partial and starter custom styles have been provided. Include this partial at locations where the feedback collector should appear
* check with the PM/Team for any additional requirements - sitka insights plugin, scripts, ect

### Run commands from the root directory

For compiling LESS/JS assets within Groot itself, you should be able to run commands within the root directory. For example:

```bash
cd /path/to/groot
lando webpack --watch
```

### Building a new release

Start by updating the Groot release number in the `style.less` header comment. This is not strictly necessary, but can make things easier to troubleshoot:

```css
/*!
 * Theme Name: Groot
 * ...
 * Copyright 2020 SiteCrafting, Inc.
 * Based on Groot release: vX.X.X     // <-- UPDATE THIS NUMBER
 */
```

Make sure you commit this change before creating the actual release. Otherwise your release download will not include this update.

Groot includes a script for building itself and creating a release. To create a tag and corresponding release called `vX.Y.Z`:

```bash
scripts/build-release.sh vX.Y.Z
```

This will create a .tar.gz and a .zip archive which you can upload to a new release on GitHub.

If you have [`hub`](https://hub.github.com/) installed, it will also prompt you to optionally create a release directly!
