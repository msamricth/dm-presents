var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var inject = require('gulp-inject-string');

const files = [
	'templates/test_header.html', 
	'build/style.min.css', 
	'templates/test_header2.html', 
	'src/home.html', 
	'templates/test_footer.html'
];

const exportFiles = [
	'build/style.export.css',
	'src/home.html'
];

gulp.task('css', () => {
	return gulp.src('src/style.css')
		.pipe(cleanCSS())
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest('build'));
});

gulp.task('combine', () => { 
	return gulp.src(files)
		.pipe(concat('index.html'))
		.pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
		.pipe(gulp.dest('build'));
});

gulp.task('cssExport', () => {
	return gulp.src('src/style.css') 
		.pipe(cleanCSS())
		.pipe(inject.prepend('<style type="text/css">'))
		.pipe(inject.append('</style>'))
		.pipe(rename('style.export.css'))
		.pipe(gulp.dest('build'));
});

gulp.task('combineExport', () => { 
	return gulp.src(exportFiles)
		.pipe(concat('export.html'))
		.pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
		.pipe(gulp.dest('build')); 
});

gulp.task('default', gulp.series('css', 'combine')); 
gulp.task('export', gulp.series('cssExport', 'combineExport')); 