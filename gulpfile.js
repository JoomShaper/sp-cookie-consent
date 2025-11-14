const gulp = require('gulp');
const clean = require('gulp-clean');
const zip = require('gulp-zip');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const packageJson = require('./package.json');

const pluginName = 'spcookieconsent';
const buildDir = 'build';
const distDir = 'dist';

// Clean build directory
gulp.task('clean', function() {
    return gulp.src([buildDir, distDir], { read: false, allowEmpty: true })
        .pipe(clean());
});

// Copy plugin files to build directory
gulp.task('copy', function() {
    return gulp.src([
        'spcookieconsent.php',
        'spcookieconsent.xml',
        'assets/**/*',
        'language/**/*'
    ], { base: '.' })
        .pipe(gulp.dest(buildDir + '/plg_system_' + pluginName));
});

// Minify JavaScript
gulp.task('minify:js', function() {
    return gulp.src(buildDir + '/plg_system_' + pluginName + '/assets/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest(buildDir + '/plg_system_' + pluginName + '/assets/js'));
});

// Minify CSS
gulp.task('minify:css', function() {
    return gulp.src(buildDir + '/plg_system_' + pluginName + '/assets/css/*.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest(buildDir + '/plg_system_' + pluginName + '/assets/css'));
});

// Create ZIP package
gulp.task('zip', function() {
    return gulp.src(buildDir + '/plg_system_' + pluginName + '/**/*')
        .pipe(zip('plg_system_' + pluginName + '.zip'))
        .pipe(gulp.dest(distDir));
});

// Build task (copy files, minify, and create ZIP)
gulp.task('build', gulp.series('clean', 'copy', 'minify:js', 'minify:css', 'zip'));

// Build without minification (for development)
gulp.task('build:dev', gulp.series('clean', 'copy', 'zip'));

// Default task
gulp.task('default', gulp.series('build'));

