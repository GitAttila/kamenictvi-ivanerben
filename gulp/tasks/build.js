var gulp = require('gulp'),
	imagemin = require('gulp-imagemin'),
	imageminPngQuant = require('imagemin-pngquant'),
	imageminJpegRecompress = require('imagemin-jpeg-recompress'),
	del = require('del'),
	usemin = require('gulp-usemin'),
	rev = require('gulp-rev'),
	cssnano = require('gulp-cssnano'),
	uglify = require('gulp-uglify'),
	browserSync = require('browser-sync').create();

gulp.task('previewDist', function(){
	browserSync.init({
		notify: false,
		server: {
			baseDir: "dist"
		}
	});
});

gulp.task('deleteDistFolder', function(){
	return del("./dist");
});

gulp.task('copyGeneralFiles',['deleteDistFolder'], function(){
	var pathsToCopy = [
		'./website/**/*',
		'!./website/assets/images/**',
		'!./website/assets/js',
		'!./website/assets/js/**',
		'!./website/assets/js',
		'!./website/assets/js/**',
		'!./website/assets/scss',
		'!./website/assets/scss/**',
		'!./website/assets/vendors',
		'!./website/assets/vendors/**',
		'!./website/temp',
		'!./website/temp/**'
	]
	return gulp.src(pathsToCopy)
		.pipe(gulp.dest('./dist'));
})

gulp.task('images',['deleteDistFolder'], function(){
	return gulp.src(["./website/assets/images/**/*"])
		.pipe(imagemin(
			[
				imagemin.gifsicle(),
				imagemin.jpegtran(),
				imagemin.optipng(),
				imagemin.svgo(),
				imageminPngQuant(),
				imageminJpegRecompress()
			],
			{
				verbose: true
   		 	}
		))
		.pipe(gulp.dest("./dist/assets/images"));
})

gulp.task('usemin',['deleteDistFolder','styles','scripts'],function(){
	return gulp.src("./website/*.html")
		.pipe(usemin({
			css: [function(){return rev()}],
			js: [function(){return rev()}]
		}))
		.on('error',function(errorInfo){
				console.log(errorInfo.toString());
				this.emit('end');
			})
		.pipe(gulp.dest('./dist'));
});

gulp.task('build',['deleteDistFolder','usemin','images','copyGeneralFiles']); 
gulp.task('quickbuild',['deleteDistFolder','usemin','copyGeneralFiles']);

gulp.task('default',['build']);
