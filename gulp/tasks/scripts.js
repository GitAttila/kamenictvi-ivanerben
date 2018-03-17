var gulp = require("gulp"),
		order = require("gulp-order"),
		concat = require("gulp-concat"),
		uglify = require('gulp-uglify'),
		sourcemaps= require("gulp-sourcemaps");

//Scripts
gulp.task('scripts',['vendorscripts','phpscripts','JSONdatafiles'], function(){
	return gulp.src('./website/assets/js/**/*.js')

		.pipe(sourcemaps.init())
		.pipe(uglify())
		.on('error',function(errorInfo){
				console.log(errorInfo.toString());
				this.emit('end');
			})
		.pipe(concat('scripts.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./website/temp/js'))
});

// Vendor scripts
gulp.task("vendorscripts",['vendorscripts_custom'], function(){
	var paths = [
		'./website/assets/vendors/js/main/*.js',
		'!./website/assets/vendors/js/main/jquery*.js',
		'!./website/assets/vendors/js/main/debug*.js'
	]
	return gulp.src(paths)
		.pipe(order([
			"*popper*.*",
			"*bootstrap*.*",
			"*imagesloaded*.*",
			"*isotope*.*",
			"*ScrollMagic*.*",
			"*parallax*.*",
			"*TweenMax*.*",
			"*animation*.*"
		]))
		.pipe(concat('vendorscripts.js'))
		.pipe(gulp.dest('./website/temp/js'));
});

// Vendor scripts jquery + debug.addindicators...
gulp.task("vendorscripts_custom", function(){
	var paths = [
		'./website/assets/vendors/js/main/jquery*.js',
		'./website/assets/vendors/js/main/debug*.js'
	]
	return gulp.src(paths)
		.pipe(gulp.dest('./website/temp/js'));
});

//PHP scripts
gulp.task('phpscripts', function() {
    return gulp.src('./website/assets/php/**/*.*')
    	.pipe(gulp.dest('./website/temp/php'));
});

// JSON data files
gulp.task("JSONdatafiles", function(){
	return gulp.src('./website/assets/data/*.json')
		.pipe(gulp.dest('./website/temp/data'))
});
