const { src, dest, parallel } = require('gulp');
const less = require('gulp-less');
const minifyCSS = require('gulp-csso');
const babel = require('gulp-babel');

function css() {
  return src('less/*.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(dest('.'));
}

function js() {
  return src('js/src/common.js', { sourcemaps: true })
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('dist'));
}

exports.js = js;
exports.css = css;
exports.default = parallel(js, css);
