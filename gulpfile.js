var gulp = require('gulp');
var clean = require('gulp-clean');
var zip = require('gulp-zip');
var util = require('gulp-util');

var os = require('os');
var pkg = require('./package.json');

gulp.task('clean', function() {
	util.log(os.platform());
	return gulp.src(['./debug', './build'], { read: false })
	.pipe(clean());
});

gulp.task('debug', function() {
	return gulp.src(['./src/*.*', './lib/raphael.js'])
	.pipe(gulp.dest('./debug'));
});

// Architecture specific
/*
gulp.task('install-files', ['copy-files'], function() {
	if (os.platform() == 'win32' && process.env.PROCESSOR_ARCHITEW6432 == 'AMD64') {
		return gulp.src('./debug/*.*')
		.pipe(gulp.dest('C:/Program Files/Construct 2/exporters/html5/plugins/' + pkg.name));
	} else if (os.platform() == 'win32' && process.env.PROCESSOR_ARCHITEW6432 == 'x86') {
		return gulp.src('./debug/*.*')
		.pipe(gulp.dest('C:/Program Files (x86)/Construct 2/exporters/html5/plugins/' + pkg.name));
	};
})
*/

gulp.task('copy-files', function() {
	return gulp.src(['./src/*.*', './lib/raphael-min.js'])
	.pipe(gulp.dest('./build/temp/files/' + pkg.name));
});

gulp.task('copy-info', ['copy-files'], function() {
	return gulp.src('info.xml')
	.pipe(gulp.dest('./build/temp'));
});

gulp.task('zip-files', ['copy-info'], function() {
	return gulp.src('./build/temp/**/*.*')
	.pipe(zip(pkg.name + '.c2addon'))
	.pipe(gulp.dest('./build'))
});

gulp.task('build', ['zip-files']);