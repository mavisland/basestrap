const { src, dest } = require("gulp");
const sass = require("gulp-sass")(require("node-sass"));
const prefixer = require("autoprefixer");
const minifier = require("cssnano");
const postcss = require("gulp-postcss");

function buildStyles() {
  return src("./scss/*.scss")
    .pipe(
      sass({
        includePaths: "./node_modules",
        outputStyle: "expanded",
      }).on("error", function (err) {
        sass.logError(err);
        this.emit("end");
      })
    )
    .pipe(dest("./css"));
}
