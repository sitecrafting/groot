const Bundler = require('parcel-bundler');
const path = require('path');
const fs = require('fs');

// watch files for changes?
const watch = process.argv.indexOf('--watch') > 0;
if (watch) console.log('Watching files... 👀 ');


/*
 * Describe our different bundles: JS and LESS, and any other custom bundles
 * you can define. Keys correspond to the first positional arg passed to this
 * script. The `path` and `options` values are required for each bundle.
 *
 * The %theme% value is interpolated from CLI args.
 * This is so we can keep this script as reusable as possible with zero
 * configuration or editing.
 *
 * See options here: https://parceljs.org/api.html#bundler
 */
const bundles = {
  js: {
    path: path.join(__dirname, '../src/common.js'),
    options: {
      publicUrl: '/wp-content/themes/%theme%/dist/',
      watch: watch,
      minify: true,
      hmr: false,
    }
  },

  less: {
    path: path.join(__dirname, '../../less/style.less'),
    options: {
      publicUrl: '/wp-content/themes/%theme%/',
      outDir: path.join(__dirname, '../..'),
      watch: watch,
      minify: true,
    },
  },
};



// run the build for the specified bundle
(async function bundleAssets() {
  const bundle = matchBundle(bundles, process.argv[2]);
  const { path, options } = bundle;
  const bundler = new Bundler(path, parseOptions(options, {
    theme: process.argv[3],
  }));

  bundler.on('bundled', writeAssetsVersion);

  await bundler.bundle();
})();


/**
 * Determine which bundle we're building
 *
 * @param Object bundles the object describing all our different builds and
 * their respective options
 * @param Array args the CLI args this script received
 * @return the bundle to be built, which includes the path and options keys
 */
function matchBundle(bundles, key) {
  if (!bundles[key]) {
    throw new Error('no matching bundle found!');
  }

  return bundles[key];
}

/**
 * Interpolate options based on CLI args. Currently the only option that
 * supports this is `publicUrl`
 */
function parseOptions(options, vars) {
  if (options.publicUrl) {
    options.publicUrl = options.publicUrl.replace('%theme%', vars.theme);
  }

  return options;
}

/**
 * Write to the assets.version file for cache-busting
 */
function writeAssetsVersion() {
  const version = Date.now().toString();
  fs.writeFileSync(path.join(__dirname, '../../assets.version'), version);
  console.log(`📆 Assets version: ${version}`);
}
