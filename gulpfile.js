var gulp = require('gulp');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var mustache = require('gulp-mustache');
var fs = require('fs');

// Minify & strip comments from all css in /src and put it in /build
gulp.task('css', () => {
	return gulp.src('src/*.css')
		.pipe(cleanCSS({ removeComments: true }))
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
		.pipe(uglify({ removeComments: true }))
		.pipe(gulp.dest('build'));
}); 

// TODO(AJ): These two tasks are *really* similar, there should be a way to clean this up

// Using the templates/preview.mustache template, render out build/index.html
// NOTE: Then run `serve build` (or use whatever local hosting solution you like) to preview things
gulp.task('buildPreview', () => {
	return gulp.src('templates/preview.mustache')
		.pipe(mustache({ 
			style: fs.readFileSync('build/style.css').toString(),
			content: fs.readFileSync('build/home.html').toString(), 
			script: fs.readFileSync('build/home.js').toString()
		}))
		.pipe(rename('index.html'))
		.pipe(gulp.dest('build')); 
});

// Using the templates/export.mustache template, render out build.export.html
// This is the giant blob of text that needs to be copy/pasted into hybris
gulp.task('buildExport', () => {
	return gulp.src('templates/export.mustache')
		.pipe(mustache({ 
			style: fs.readFileSync('build/style.css').toString(),
			content: fs.readFileSync('build/home.html').toString(), 
			script: fs.readFileSync('build/home.js').toString()
		}))
		.pipe(rename('export.html'))
		.pipe(gulp.dest('build')); 
});

// Just simplifing the minify tasks into one task
gulp.task('minify', gulp.parallel('html', 'css', 'js'));

// These are the two tasks that should be called
// By default, just running `gulp` will build a preview
gulp.task('default', gulp.series('minify', 'buildPreview')); 

// Running `gulp export` will create build/export, which is the blob to be copy/pasted into Hybris
gulp.task('export', gulp.series('minify', 'buildExport')); 