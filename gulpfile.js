var gulp = require("gulp");
var pug = require("gulp-pug");
var minify = require("gulp-minify-inline");

// These are the two tasks that should be called
// By default, just running `gulp` will build a preview
gulp.task("default", () => { 
	return gulp.src("src/preview/*.pug")
		.pipe(pug())
		.pipe(gulp.dest("build/us/en"));
});

// Running `gulp export` will create build/export, which is the blob to be copy/pasted into Hybris
gulp.task("export", () => {
	return gulp.src("src/dm-presents*.pug")
		.pipe(pug())
		.pipe(minify())
		.pipe(gulp.dest("build/hybris"));
}); 
