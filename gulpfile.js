var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var sprity = require('sprity');
var browserSync = require('browser-sync').create();

var env = process.argv[3] || 'development';

console.log('Building for environment ' + env);

var src = './public/src/';
var dist = './public/dist/';

var copy = [
    src + 'js/vendor/**/*',
    src + 'img/**/*',
    '!' + src + 'img/sprite',
    src + '*',
    '!' + src + 'scss'
];

var scripts = [
    src + 'js/**/*',
    '!' + src + 'js/vendor/**/*.js'
];

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

gulp.task('clean', function(cb) {
    return del([dist], cb);
});

gulp.task('copy', function() {
    return gulp
        .src(copy, {base: src})
        .pipe($.if('*.png', $.imagemin()))
        .pipe($.if('*.jpg', $.imagemin()))
        .pipe(gulp.dest(dist))
        .on('end', function() {
            browserSync.reload()
        });
});

gulp.task('sprites', function() {
    return sprity
        .src({
            src: src + 'img/sprite/*.png',
            style: '_sprites.scss',
            processor: 'sass', // make sure you have installed sprity-sass
            cssPath: '../img',
            margin: 1,
            orientation: 'binary-tree',
            dimension: [{
                ratio: 1, dpi: 72
            }, {
                ratio: 2, dpi: 192
            }]
        })
        .on('error', handleError)
        .pipe($.imagemin())
        .pipe($.if('*.png', gulp.dest(dist + 'img'), gulp.dest(src + 'scss')));
});

gulp.task('styles', function() {
    var task = gulp.src(src + 'scss/**/*.scss')
        .pipe($.sass({
            sourceComments: false,
            sourceMap: false,
            outputStyle: env === 'development' ? 'nested' : 'compressed'
        }))
        .on('error', handleError)
        .pipe($.autoprefixer("last 2 versions", "> 1%", "ie 8"))
        .on('error', handleError)
        .pipe($.inlineImage({
            baseDir: src + 'img'
        }))
        .on('error', handleError)
        .pipe(gulp.dest(dist + 'css'));

    if(browserSync.active) {
        task.pipe(browserSync.stream());
    }

    return task;
});

gulp.task('scripts', function() {
    return gulp.src(src + 'js/main.js')
        .pipe($.webpack({
            output: {
                filename: 'main.js'
            },
            resolve: {
                modulesDirectories: [src + 'js', 'node_modules']
            },
            module: {
                loaders: [
                    {test: /text!.*(\.html$|\.js$)/, loader: "text-loader"}
                ]
            },
            resolveLoader: {
                alias: {
                    'text': 'text-loader'
                }
            },
            externals: {
                "jquery": "$"
            }
        }))
        .pipe($.if(env !== 'development', $.uglify()))
        .pipe(gulp.dest(dist + 'js'))
        .on('end', function() {
            browserSync.reload()
        });
});

gulp.task('watch', function() {
    gulp.watch(copy, ['copy']);
    gulp.watch(src + 'scss/**/*.scss', ['styles']);
    gulp.watch(scripts, ['scripts']);
});

gulp.task('sync', function() {
    return browserSync.init({
        server: {
            baseDir: dist
        }
    });
});

gulp.task('server', function() {
    $.nodemon({
        script: 'server/index.js',
        ext: 'js',
        env: {'NODE_ENV': 'development'},
        ignore: ['public']
    }).on('restart', function() {
        browserSync.reload();
    });
});

var sequence;

if(env === 'development') {
    sequence = $.sequence('clean', 'copy', ['sprites', 'styles', 'scripts'], 'server', 'watch', 'sync');
} else {
    sequence = $.sequence('clean', 'copy', ['sprites', 'styles', 'scripts']);
}

gulp.task('default', sequence);

gulp.task('jshint', function() {
    return gulp.src(scripts)
        .pipe($.jshint('./.jshintrc'))
        .pipe($.jshint.reporter('jshint-stylish'));
});
