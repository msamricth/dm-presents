var gulp = require('gulp');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var mustache = require('gulp-mustache');
var fs = require('fs');

/*
	AJ (10/9/2020):
	In general here's a list of improvements that could be made over time to the build process
	- Splitting up CSS more granularly, right now it's just home & episodes but they share details
	- Make things async. I feel this is low priority, it runs plenty fast as-is. If we end up with 10+ episodes let's consider it.
	- Less hard coded values, or just organize them into one place.
	- There's also some duplicated HTML across pages, it would be cool use mustache to pull in a stupid-simple component.
*/

// Minify & strip comments from all css in /src and put it in /build
gulp.task('css', () => {
	return gulp.src('src/*.css')
		.pipe(cleanCSS())
		.pipe(gulp.dest('build'));
});

// Minify & strip comments from all html in /src and put it in /build
gulp.task('html', () => { 
	return gulp.src('src/*.html')
		.pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
		.pipe(gulp.dest('build'));
});

// Minify & ... you get the picture
gulp.task('js', () => { 
	return gulp.src('src/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('build'));
}); 

// Just simplifing the minify tasks into one task
gulp.task('minify', gulp.parallel('html', 'css', 'js'));

// These two arrays keep track of the build task names for preview(local) & export(hybris)
const previewBuildTasks = [], exportBuildTasks = [];

// This is a helper function to create two build tasks whenever we have a new page
// IMPROVEMENT(AJ): Right now it was built quickly (sync instead of async, hardcoded things, etc.) This could be better.
// TODO(AJ)[BUG]: If an empty string or no value is passed for style, content, or script this task will fail
const createBuildTask = (name, options) => { 
	previewBuildTasks.push(name + "Preview");
	gulp.task(name + "Preview", () => { 
		return gulp.src("templates/preview.mustache")
			.pipe(mustache({
				style: fs.readFileSync("build/" + options.cssFilename).toString(),
				content: fs.readFileSync("build/" + options.htmlFilename).toString(),
				script: fs.readFileSync("build/" + options.scriptFilename).toString(),
			}))
			.pipe(rename(options.previewFilename))
			.pipe(gulp.dest("build"));
	});

	exportBuildTasks.push(name + "Export");
	gulp.task(name + "Export", () => { 
		
		// TODO(AJ)[HACK]: DrMartens S3 wasn't allowing .woff files for @font-face, so we're base64 embedding it
		// ... this is obviously a bit of a hack, but it works for now. It requires naming the task "buildEpisode{n}" to be included.
		// It adds about 500Kb of text to the file that is copy/pasted into Hyrbris, the .woff files is a little less than that
		// Requesting a file takes a bit of latency so performance-wise I'd guess this is a bit of a wash. 
		// Code-maintainance-wise it's a mess. Apologies, hopefully we get their S3 to allow .woff files in the future.
		var fontCSS = "";
		if(name.includes("Episode")) 
			fontCSS = fs.readFileSync("src/handwritingFont.css").toString();

		return gulp.src("templates/export.mustache")
			.pipe(mustache({
				style: fs.readFileSync("build/" + options.cssFilename).toString() + fontCSS,
				content: fs.readFileSync("build/" + options.htmlFilename).toString(),
				script: fs.readFileSync("build/" + options.scriptFilename).toString(),
			}))
			.pipe(rename(options.exportFilename))
			.pipe(gulp.dest("build"));
	});
};

// ----------------------------------------------------------------
// Home page build tasks
// ----------------------------------------------------------------

createBuildTask('buildHome', { 
	cssFilename: "home.css",			// relative to src/ that should be used as css
	htmlFilename: "home.html",			// relative to src/ HTML only, no CSS or JS (otherwise htmlmin() doesn't work correctly)
	scriptFilename: "home.js",			// relative to src/ for JS, just include raw JS, no need for a <script> tag
	previewFilename: "index.html",		// relative to build/ where to put the preview html file to be viewed locally
	exportFilename: "hybris_home.html"	// relative to build/ where to put the blob of html/css/js to be copy/pasted into Hybris
});

// ----------------------------------------------------------------
// Episode pages build tasks
// ----------------------------------------------------------------

createBuildTask('buildEpisode1', { 
	cssFilename: "episodes.css",
	htmlFilename: "episode1.html",
	scriptFilename: "home.js",
	previewFilename: "01AliRoberto.html",
	exportFilename: "hybris_01AliRoberto.html"
}); 

createBuildTask('buildEpisode2', { 
	cssFilename: "episodes.css",
	htmlFilename: "episode2.html",
	scriptFilename: "home.js",
	previewFilename: "02GabrielGomez.html",
	exportFilename: "hybris_02GabrielGomez.html"
}); 


// These are the two tasks that should be called
// By default, just running `gulp` will build a preview
gulp.task('default', gulp.series('minify', gulp.parallel(previewBuildTasks))); 

// Running `gulp export` will create build/export, which is the blob to be copy/pasted into Hybris
gulp.task('export', gulp.series('minify', gulp.parallel(exportBuildTasks))); 