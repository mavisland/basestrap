/*! basestrap */

// Packages
const { src, dest } = require("gulp");
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");
const filter = require("gulp-filter");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("node-sass"));
const sourcemaps = require("gulp-sourcemaps");

// Compile, autoprefix & minify SASS files
function buildStyles() {
  return src("./scss/basestrap.scss")
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "expanded",
        sourceMap: true,
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

// Build task
exports.build = buildStyles;

// Default task
exports.default = this.build;
