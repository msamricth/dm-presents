var gulp = require("gulp");
var pug = require("gulp-pug");
var minify = require("gulp-minify-inline");

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

// `bhm` will preview the black history month page
gulp.task("bhm", () => { 
	return gulp.src("src/preview/black-history-month/bhm.pug")
		.pipe(pug())
		.pipe(gulp.dest("build/us/en/black-history-month/"));
});

gulp.task("bhm-export", () => {
	return gulp.src("src/black-history-month/bhm*.pug")
		.pipe(pug())
		.pipe(minify())
		.pipe(gulp.dest("build/hybris/black-history-month/"));
}); 