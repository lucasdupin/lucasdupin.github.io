
// -------------------------------------
//   Load plugins
// -------------------------------------

var YAML = require('yamljs'),
    autoprefixer = require('autoprefixer-stylus'),
    gulp = require('gulp'),
    cache = require('gulp-cached'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    stylus = require('gulp-stylus'),
    util = require('gulp-util'),
    uglify = require('gulp-uglify'),
    handlebars = require('gulp-compile-handlebars'),
    rename = require('gulp-rename')
  ;

var production = util.env.production;

// -------------------------------------
//   Tasks
// -------------------------------------

// ----- web server ----- //

gulp.task('webserver', function() {
  connect.server({
    root: 'dist',
    livereload: true,
    port: 8000
  });
});

// ----- templates ------ //

gulp.task('templates', function() {
  var options = {
    ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false
    partials : {},
    batch : ['./source/partials'],
    helpers : {
      stringify_json: function(obj) {
        return JSON.stringify(obj);
      }
    }
  }

  var config = YAML.load('config.yaml');
  gulp.src('./source/index.hbs')
    .pipe(handlebars(config, options))
    .pipe(rename("index.hbs"))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

// ----- copy scripts ----- //

gulp.task('vendor-scripts', function(){
  gulp.src([
      "source/js/vendor/*",
    ])
    .pipe(concat('dist/js/vendor.js'))
    .pipe(gulp.dest('./'))
});

// ----- Stylus/CSS ----- //

gulp.task('styles', function() {
  return gulp.src('./source/css/main.styl')
    .on('error', function (err) { console.log(err.message); })
    .pipe(stylus({
      errors: true,
      compress: false,
      cache: false,
      use: autoprefixer({browsers: ['ie 10', 'last 2 versions']})
    }))
    .pipe(gulp.dest('./dist/css'))
    .pipe(connect.reload());

});

// ----- Scripts ----- //

gulp.task('scripts', function() {
  return gulp.src([
    "source/js/main.js",
    "source/js/*.js",
  ])
  .pipe(concat('dist/js/main.js'))
  .pipe(gulpif(production,uglify()))
  .pipe(gulp.dest('./'))
  .pipe(connect.reload());
});

// ----- Images ----- //

gulp.task('images', function() {
  return gulp.src('./source/img/**/*')
    .pipe(gulp.dest('./dist/img'))
});

// -------------------------------------
//   Watch
// -------------------------------------

gulp.task('watch', function() {
  gulp.watch('source/**/*.hbs', ['templates']);
  gulp.watch('source/**/*.html', ['templates']);
  gulp.watch('source/css/**/*', ['styles']);
  gulp.watch('source/js/*.js', ['scripts']);
  gulp.watch('source/js/vendor/**/*.js', ['vendor-scripts']);
  gulp.watch('source/img/**/*', ['images']);
});

// -------------------------------------
//   Start
// -------------------------------------

gulp.task('default', ['webserver', 'watch', 'templates'], function() {
  return gulp.start('vendor-scripts', 'images', 'styles', 'scripts');
});

// -------------------------------------
//   Build
// -------------------------------------

gulp.task('build', ['templates', 'vendor-scripts', 'images', 'styles', 'scripts']);
