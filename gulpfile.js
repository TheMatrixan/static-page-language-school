var gulp = require("gulp"),
  autoprefixer = require("gulp-autoprefixer"),
  concat = require("gulp-concat"),
  minifycss = require("gulp-uglifycss"),
  notify = require("gulp-notify"),
  rename = require("gulp-rename"),
  sass = require("gulp-sass"),
  watch = require("gulp-watch"),
  image = require("gulp-image"),
  wait = require("gulp-wait"),
  sourcemaps = require("gulp-sourcemaps"),
  browserSync = require("browser-sync").create(),
  fileinclude = require("gulp-file-include");

const dir = {
  src: "./src/",
  dist: "./dist/"
};
const buildInclude = [
  // include common file types
  dir.src + "**/*.php",
  dir.src + "**/*.html",
  dir.src + "**/*.css",
  dir.src + "**/*.js",
  dir.src + "**/*.svg",
  dir.src + "**/*.ttf",
  dir.src + "**/*.webmanifest",
  dir.src + "**/*.ico",
  dir.src + "**/*.xml",
  dir.src + "**/*.otf",
  dir.src + "**/*.eot",
  dir.src + "**/*.woff",
  dir.src + "**/*.woff2",
  "!" + dir.src + "images/**/*.*",
  "!" + dir.src + "scss/**/*.*"
];

gulp.task("fileinclude", function() {
  gulp
    .src([dir.src + "**/*.html"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file"
      })
    )
    .pipe(gulp.dest(dir.dist));
});

gulp.task("serve", ["styles", "fileinclude", "img"], function() {
  browserSync.init({
    server: dir.dist
  });
  gulp.watch(dir.src + "scss/**/*.scss", ["styles"]);
  gulp.watch(dir.src + "img/**/*.*", ["img"]).on("change", browserSync.reload);
  gulp
    .watch(dir.src + "**/*.html", ["fileinclude"])
    .on("change", browserSync.reload);
});

gulp.task("buildfiles", function() {
  gulp.start("img");
  gulp.start("favicon");
  return gulp
    .src(buildInclude)
    .pipe(wait(500))
    .pipe(gulp.dest(dir.dist));
});

gulp.task("styles", function() {
  return gulp
    .src(dir.src + "scss/style.scss")
    .pipe(concat("style.scss"))
    .pipe(wait(500))
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }))
    .on("error", swallowError)
    .pipe(rename("style.css"))
    .pipe(autoprefixer("last 2 version", "> 1%"))
    .pipe(minifycss())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(dir.dist))
    .pipe(browserSync.stream());
});
gulp.task("img", function() {
  return gulp
    .src(dir.src + "images/**/*.*")
    .pipe(image())
    .pipe(gulp.dest(dir.dist + "img/"));
});

gulp.task("favicon", function() {
  return gulp
    .src([dir.src + "*.png", dir.src + "*.svg", dir.src + "*.ico"])
    .pipe(image())
    .pipe(gulp.dest(dir.dist));
});

function swallowError(error) {
  console.log("ERROR: " + error.toString());
  this.emit("end");
}

gulp.task("default", ["serve"]);
