# Groot

> **THIS REPO IS IN ALPHA STATUS. ITS USE IN PRODUCTION IS NOT RECOMMENDED.**

The official SiteCrafting WordPress starter theme.

# Development

To start hacking on Groot itself, run:

```
git clone git@github.com:sitecrafting/groot.git && cd groot
lando start
```

The `lando start` command should output some URLs. Save the `APPSERVER` URL,
in case it's different from the default that `lando install` expects.

The `lando install` command will prompt you for site info admin credentials to
set up. Then it does some setup/cleanup. After this, you should have a fully
functional WordPress site running Groot!

## Composer errors

If you run into a composer error having to do with ssh, you may have to resolve
the issue manually. Try cloning [Conifer](https://bitbucket.org/sitecrafting/conifer)
into `wp/wp-content/plugins/conifer` directly. Then try running `lando install`.
