var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var imagemin = require('gulp-imagemin');
var nunjucksRender = require('gulp-nunjucks-render');
var pngquant = require('imagemin-pngquant');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var webpack = require('webpack');

function init(config) {
    config = config || {};

    gulp.task('sass', function () {
        return gulp.src('src/assets/styles/*.scss')
            .pipe(sass())
            .pipe(gulp.dest('src/assets/styles'));
    });

    gulp.task('nunjucks', function () {
        nunjucksRender.nunjucks.configure(['src/templates/']);

        return gulp.src('src/pages/**/*html')
            .pipe(nunjucksRender({
                path: ['src/templates/']
            }))
            .pipe(gulp.dest('dist'));
    });

    gulp.task('webpack', function (callback) {
        var config = {
            entry: './src/modules/entry.js',
            output: {
                path: 'src/assets/scripts',
                filename: 'scripts.js'
            },
            resolve: {
                modulesDirectories: ['modules', 'bower_components'],
                alias: {
                    'scrollmagic': 'scrollmagic/scrollmagic/uncompressed/ScrollMagic',
                }
            },
            externals: {
                'jquery': 'jQuery'
            },
            module: {
                loaders: [
                  { test: /\.js/, loader: 'imports?define=>false' }
                ]
            },
            plugins: [
                new webpack.ResolverPlugin(
                    new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
                ),
                new webpack.ContextReplacementPlugin(/moment[\\\/]locale/, /^\.\/(en-gb)$/)
            ]
        };

        webpack(config, function (err, stats) {
            if (err) {
                throw new gutil.PluginError('webpack', err);
            }
            gutil.log('[webpack]', stats.toString());

            callback();
        });
    });

    gulp.task('scripts', ['webpack'], function () {
        return gulp.src('src/assets/scripts/*.js')
            .pipe(uglify({
                mangle: true,
                compress: {
                    drop_console: true
                },
                output: {
                    beautify: false
                }
            }))
            .pipe(gulp.dest('dist/scripts'));
    });

    gulp.task('css', ['sass'], function () {
        var input = config.css || [];
        input.push('src/assets/styles/base.css');
        
        return gulp.src(input)
            .pipe(concat('styles.css'))
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9'],
                cascade: false
            }))
            .pipe(cleanCSS({
                keepBreaks: false
            }))
            .pipe(gulp.dest('dist/css'));
    });

    gulp.task('images', function () {
        return gulp.src('src/assets/images/**/*.{png,gif,jpg,svg}')
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                use: [pngquant()]
            }))
            .pipe(gulp.dest('dist/images'));
    });

    gulp.task('watch', function () {
        gulp.watch('src/**/*.+(html|njk)', ['nunjucks']);
        gulp.watch('src/assets/styles/*.scss', ['css']);
        gulp.watch('src/modules/**/*.css', ['css']);
        gulp.watch('src/modules/*.js', ['scripts']);
    });

    gulp.task('copy', function () {
        var input = [
            'src/api/*.*',
            'src/favicon.ico',
        ];

        gulp.src(input, { base: 'src' }).pipe(gulp.dest('dist'));
        gulp.src('src/assets/fonts/*.*', { base: 'src/assets' }).pipe(gulp.dest('dist'));
        gulp.src('src/assets/sounds/*.*', { base: 'src/assets' }).pipe(gulp.dest('dist'));
    });

    gulp.task('default', ['nunjucks', 'css', 'scripts', 'copy', 'images'], function () {

    });
}

module.exports.init = init;