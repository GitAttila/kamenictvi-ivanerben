var gulp = require("gulp"),
	watch = require("gulp-watch"),
	browserSync = require('browser-sync').create();

//Watch task
gulp.task("watch", function(){
	
	browserSync.init({
		notify:false,
		server: {
			baseDir:"website"
		}
	});

	watch('./website/*.html', function(){
		browserSync.reload();
	})

	watch('./website/assets/scss/**/*.scss',function(){
		gulp.start('cssInject');
	});
	
	watch('./website/assets/js/**/*.js',function(){
		gulp.start('jsRefresh');
	});

	watch('./website/assets/vendors/js/main/**/*.js',function(){
		gulp.start('jsRefresh');
	});

	watch('./website/assets/php/**/*.php',function(){
		gulp.start('phpRefresh');
	});

	watch('./website/assets/data/*.json',function(){
		gulp.start('jsonRefresh');
	});

});

gulp.task('cssInject',['styles'], function(){
	return gulp.src('./website/temp/styles/styles.css')
		.pipe(browserSync.stream());
});

gulp.task('jsRefresh',['scripts'], function(){
	browserSync.reload();
});

gulp.task('phpRefresh',['phpscripts'], function(){
	browserSync.reload();
});

gulp.task('jsonRefresh',['JSONdatafiles'], function(){
	browserSync.reload();
});
