var gulp = require('gulp')
var ts = require('gulp-typescript')
var clean = require('gulp-clean')
var path = require('path')
var server = require('gulp-develop-server')
var sourcemaps = require('gulp-sourcemaps')
var mocha = require('gulp-mocha')

var serverPath = 'server/'
var serverTS = [serverPath + '**/*.ts']
var serverCompiled = ['**/*.js', '**/*.js.map', '**/*.d.ts'].map(el => serverPath + el)

gulp.task('ts', ['clean'], function () {
  return gulp
        .src(serverTS)
        .pipe(sourcemaps.init())
        .pipe(ts({ module: 'commonjs', noImplicitAny: true }))
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: path.join(__dirname, serverPath), destPath: '.'}))
        .pipe(gulp.dest(serverPath))
})

gulp.task('clean', function () {
  return gulp
        .src(serverCompiled, {read: false})
        .pipe(clean())
})

gulp.task('server:start', ['ts'], function () {
  server.listen({path: serverPath + 'bin/www'}, function (error) {
    console.log(error)
  })
})

gulp.task('server:restart', ['ts'], function () {
  server.restart()
})

gulp.task('default', ['server:start'], function () {
  gulp.watch(serverTS, ['server:restart'])
})

gulp.task('test', ['ts'], function () {
  return gulp
        .src('server/**/*.Spec.js', {read: false})
        // wait for dev server to start properly :(
        // .pipe(wait(600))
        .pipe(mocha())
        .once('error', function () {
          process.exit(1)
        })
        .once('end', function () {
          process.exit()
        })
})
