import gulp from "gulp"
import gulpLoadPlugins from "gulp-load-plugins"
const $ = gulpLoadPlugins();

gulp.task("webserver", function() {
  gulp.src("./")
    .pipe($.webserver({
      livereload: true,
    }));
});

gulp.task("js", () => {
  gulp.src("./app/*.js")
    .pipe($.plumber())
    .pipe($.babel())
    .pipe(gulp.dest("dest"))
});

gulp.task("sass", () => {
  gulp.src("./app/*.scss")
    .pipe($.plumber())
    .pipe($.sass())
    .pipe(gulp.dest("dest"))
});

gulp.task("default", ["webserver"], () => {
  gulp.watch("./app/*.scss", ["sass"]);
  gulp.watch("./app/*.js", ["js"]);
});
