
var gulp =      require("gulp-param")(require("gulp"), process.argv);

var uglify =    require("gulp-uglify"),
    sass =      require("gulp-sass"),
    clean =     require("gulp-clean"),
    rename =    require("gulp-rename"),
    header =    require("gulp-header"),
    bump =      require("gulp-bump");

var fs =        require("fs"),
    semver =    require("semver");


////////////////////////////////////////////////////////////////////////////////////////////////////


var createBanner = function() {

    var pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));

    return "/*\n" +
    "       _ _      _       _\n" +
    "   ___| (_) ___| | __  (_)___\n" +
    "  / __| | |/ __| |/ /  | / __|\n" +
    "  \\__ \\ | | (__|   < _ | \\__ \\\n" +
    "  |___/_|_|\\___|_|\\_(_)/ |___/\n" +
    "                     |__/\n" +
    "   Version: "+ pkg.version +"\n" +
    "    Author: "+ pkg.author +"\n" +
    "   Website: http://kenwheeler.github.io\n" +
    "      Docs: http://kenwheeler.github.io/slick\n" +
    "      Repo: http://github.com/kenwheeler/slick\n" +
    "    Issues: http://github.com/kenwheeler/slick/issues\n" +
    "*/\n";

};

var updateReadme = function( oldv, newv ) {

    var readme = fs.readFileSync("./README.markdown", "utf8"),
        regex = new RegExp( "/"+oldv+"/", "gi" );

        readme = readme.replace( regex , "/" + newv + "/" );

    fs.writeFile("./README.markdown", readme, function(err) {
        if (err) { 
            throw err; 
        } else { 
            console.log(">> Bumping Version in README.markdown"); 
        }
    });

};


////////////////////////////////////////////////////////////////////////////////////////////////////


/**
 * Bump task can be used like:
 * 
 *     gulp bump --patch
 *     gulp bump --minor
 *     gulp bump --major
 *     
 * This task will ONLY bump the version, it will not
 * spawn the sub-tasks or write dist files.
 */

gulp.task("bump", function(patch, minor, major) {
    
    var b = 
        (patch) ? "patch" : 
        (minor) ? "minor" : 
        (major) ? "major" : 
        null;
    
    if( b ) {

        var pkg = require("./package.json"),
            oldv = pkg.version,
            newv = semver.inc( oldv , b );

        console.log(">> Bumping Version to " + newv );
        updateReadme( oldv, newv );

        return gulp.src([

                "./bower.json", 
                "./component.json", 
                "./package.json", 
                "./slick.jquery.json"

            ])
            .pipe(bump({ version: newv }))
            .pipe(gulp.dest("./"));

    } else {

        console.log(">> Not Bumping Version...");
        return gulp;

    }

});


/**
 * Clean task used to wipe out the dist files
 * and help prevent getting EODIR NOT EMPTY errors.
 */

gulp.task("clean", ["bump"], function() {

    return gulp.src("dist/*", {read: false})
        .pipe(clean());

});


/**
 * Copy all the Images and Fonts to the dist folder.
 */

gulp.task("copy", ["clean"], function() {

    gulp.src("src/fonts/*")
        .pipe(gulp.dest("dist/fonts"));

    return gulp.src("src/*.gif")
        .pipe(gulp.dest("dist/"));

});


/**
 * Add the banner to the JS files, uglify
 * and whack it in the dist folder!
 */

gulp.task("js", ["clean"], function() {

    gulp.src("src/slick.js")
        .pipe(header( createBanner() ))
        .pipe(gulp.dest("dist/"));

    return gulp.src("src/slick.js")
        .pipe(uglify())
        .pipe(header( createBanner() ))
        .pipe(rename("slick.min.js"))
        .pipe(gulp.dest("dist/"));

});


/**
 * compile the sass files and stick a banner
 * in the file, then chuck it in the dist folder.
 */

gulp.task("sass", ["clean"], function() {

    return gulp.src("src/*.scss")
        .pipe(sass({
            sourceComments: false,
            outputStyle: "expanded"
        }))
        .pipe(header( createBanner() ))
        .pipe(gulp.dest("dist/"));

});

/**
 * use the gulp task like:
 *
 *      gulp
 *      gulp --patch
 *      gulp --minor
 *      gulp --major
 *
 * gulping without a "--" suffix will just write the
 * dist files, so you can check out they werkin' jus' right
 * before you go and bump.
 * 
 */

gulp.task("default", ["bump", "clean", "copy", "sass", "js"]);
