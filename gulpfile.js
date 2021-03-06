/*! basestrap */

// Packages
const { src, dest, series, watch } = require("gulp");
const autoprefixer = require("autoprefixer");
const browserSync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const filter = require("gulp-filter");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("node-sass"));
const sourcemaps = require("gulp-sourcemaps");

// Remove pre-existing content from output folders
const cleanDist = (cb) => {
  del.sync(["dist/"]);
  return cb();
};

// Compile, autoprefix & minify SASS files
function buildStyles() {
  return src("./scss/basestrap.scss")
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        includePaths: "./node_modules",
        outputStyle: "expanded",
      }).on("error", function (err) {
        sass.logError(err);
        this.emit("end");
      })
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("./dist"))
    .pipe(filter("**/*.css"))
    .pipe(
      cleanCSS({
        level: {
          1: {
            specialComments: 0,
          },
        },
      })
    )
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(dest("./dist"));
}

// Watch for changes to the source directory
const serveDocs = (cb) => {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  cb();
};

// Reload the browser when files change
const reloadBrowser = (cb) => {
  browserSync.reload();
  cb();
};

// Watch all file changes
const watchSource = () => {
  watch("./scss/**/*.scss", series(buildStyles, reloadBrowser));
  watch("./index.html", reloadBrowser);
};

// Clean task
exports.clean = cleanDist;

// Build task
exports.build = buildStyles;

// Watch Task
exports.watch = watchSource;

// Default task
exports.default = series(cleanDist, series(this.build, serveDocs, watchSource));
