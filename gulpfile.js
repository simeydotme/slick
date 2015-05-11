
var gulp =      require("gulp");

var uglify =    require("gulp-uglify"),
    sass =      require("gulp-sass"),
    clean =     require("gulp-clean"),
    rename =     require("gulp-rename"),
    header =    require("gulp-header"),
    bump =      require("gulp-bump");

var pkg =       require("./package.json");


var banner = "/*\n" +
"     _ _      _       _            \n" +
" ___| (_) ___| | __  (_)___        \n" +
"/ __| | |/ __| |/ /  | / __|       \n" +
"\\__ \\ | | (__|   < _ | \\__ \\   \n" +
"|___/_|_|\\___|_|\\_(_)/ |___/     \n" +
"                   |__/            \n" +
" Version: "+ pkg.version +" \n" +
"  Author: "+ pkg.author +" \n" +
" Website: http://kenwheeler.github.io \n" +
"    Docs: http://kenwheeler.github.io/slick \n" +
"    Repo: http://github.com/kenwheeler/slick \n" +
"  Issues: http://github.com/kenwheeler/slick/issues \n\n" +
"*/\n\n";


gulp.task("clean", function() {

    return gulp.src("dist/*", {read: false})
        .pipe(clean());

});

gulp.task("copy", ["clean"], function() {

    gulp.src("src/fonts/*")
        .pipe(gulp.dest("dist/fonts"));

    return gulp.src("src/*.gif")
        .pipe(gulp.dest("dist/"));

});

gulp.task("sass", ["clean"], function() {

    return gulp.src("src/*.scss")
        .pipe(sass({
            sourceComments: false,
            outputStyle: "expanded"
        }))
        .pipe(header( banner ))
        .pipe(gulp.dest("dist/"));

});

gulp.task("js", ["clean"], function() {

    gulp.src("src/slick.js")
        .pipe(header( banner ))
        .pipe(gulp.dest("dist/"));

    return gulp.src("src/slick.js")
        .pipe(uglify())
        .pipe(header( banner ))
        .pipe(rename("slick.min.js"))
        .pipe(gulp.dest("dist/"));

});




gulp.task("default", ["clean", "copy", "sass", "js"]);
