const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const watch = require('gulp-watch');

const cssFiles = ['./css/fonts.css','./css/reset.css','./css/**/*.css','./css/main.css', '!./css/*.min.css'];
const jsFiles = ['./js/**/*.js', './js/main.js','!./js/*.min.js'];

function styles() {
  return gulp.src(cssFiles)
    .pipe(sourcemaps.init())
    .pipe(concat('style.css'))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./css/'))
}

function scripts() {
  return gulp.src(jsFiles)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./js/'))
}

async function optimizeImages() {
  const imagemin = await import('gulp-imagemin');
  return gulp.src('./images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./images/'));
}


function watchFiles() {
  gulp.watch(cssFiles, styles);
  gulp.watch(jsFiles, scripts);
  gulp.watch('./images/*', optimizeImages);
}

function serve() {  
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  browserSync.watch('./', browserSync.reload);
} 

exports.styles = styles;
exports.scripts = scripts;
exports.images = optimizeImages;
exports.watch = watchFiles;
exports.serve = serve;
exports.default = gulp.series( gulp.parallel(styles, scripts), gulp.parallel(watchFiles, serve) );


