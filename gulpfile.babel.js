import gulp from "gulp"
import gulpLoadPlugins from "gulp-load-plugins"
import browserify from "browserify";
import babelify from "babelify";
import source from "vinyl-source-stream";

const $ = gulpLoadPlugins();

gulp.task("webserver", function() {
  gulp.src("./dest")
    .pipe($.webserver({
      host: '0.0.0.0',
      livereload: true,
    }));
});

gulp.task("assets", () => {
  gulp.src("./app/assets/**")
    .pipe($.plumber())
    .pipe(gulp.dest("dest/assets"))
});

gulp.task("js", () => {
  browserify("./app/scripts/app.js")
    .transform(babelify)
    .bundle()
    .pipe(source("app.js"))
    .pipe(gulp.dest("dest/scripts"))
});

gulp.task("html", () => {
  gulp.src(["./app/views/*.html", "./app/*.html"])
    .pipe(gulp.dest("dest"))
});

gulp.task("sass", () => {
  gulp.src("./app/styles/*.scss")
    .pipe($.plumber())
    .pipe($.sass())
    .pipe(gulp.dest("dest/styles"))
});

gulp.task("default", ["js", "html", "sass", "assets", "webserver"], () => {
  gulp.watch("./app/styles/*.scss", ["sass"]);
  gulp.watch(["./app/views/*.html", "./app/*.html"], ["html"]);
  gulp.watch("./app/scripts/*.js", ["js"]);
});

gulp.task("copy", () => {
  gulp.src("./dest/**")
    .pipe(gulp.dest("./"))
});

gulp.task("build", ["copy"], () => {});

