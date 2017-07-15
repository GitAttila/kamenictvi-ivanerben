var gulp = require("gulp"),
	minifyCss = require("gulp-minify-css"),
	autoprefixer = require("gulp-autoprefixer"),
	sourcemaps= require("gulp-sourcemaps"),
	postcss= require("gulp-postcss"),
	sass = require("gulp-sass"),
	hovershim = require("mq4-hover-shim");

gulp.task('styles',['vendorstyles'], function(){
	return gulp.src('./website/assets/scss/sitestyles.scss')
		.on('error',function(errorInfo){
			console.log(errorInfo.toString());
			this.emit('end');
		})
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(postcss([
            require('mq4-hover-shim').postprocessorFor({ hoverSelectorPrefix: '.bs-true-hover ' })
        ]))
        .pipe(autoprefixer())
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
		.pipe(gulp.dest('./website/temp/styles'));
})

gulp.task("vendorstyles", function(){
	return gulp.src('./website/assets/vendors/css/*.css')
		.pipe(gulp.dest('./website/temp/styles'));
})