var gulp = require('gulp');
var inlineNg2Template = require('gulp-inline-ng2-template');
var transform = require('gulp-transform-js-ast');


gulp.task('inline-resources', function(){
    gulp.src('./dist/build/demo/**/*.js')
        .pipe(inlineNg2Template({base: './dist/build', target: 'es5'}))
        .pipe(gulp.dest('./dist/build/demo'));
});



gulp.task('replace-core-relative-imports', function(){
    var CORE_PACKAGE_NAME = '@angular2-bootstrap/core';
    var CORE_IMPORT_REGEX = /^(.*\.\.\/core)(.*)$/;

    function isRequireMethod (path) {
        var node = path.value;
        return node.type === 'CallExpression' &&
            node.callee &&
            node.callee.type === 'Identifier' &&
            node.callee.name === 'require';
    }

    function isLiteral(path) {
        var args = path.value.arguments;
        return args &&
            args.length === 1 &&
            args[0].type === 'Literal';
    }

    function isCandidate(path) {
        return isRequireMethod(path) && isLiteral(path);
    }

    gulp.src(['./dist/cjs/**/*.js'])
        .pipe(transform({
            visitCallExpression: function (path) {
                if (isCandidate(path)) {
                    var match,
                        arg = path.value.arguments["0"];
                    if ((match = CORE_IMPORT_REGEX.exec(arg.value)) !== null) {
                        arg.value = arg.value.replace(CORE_IMPORT_REGEX, `${CORE_PACKAGE_NAME}$2`);
                    }
                }
                return path.value;
            }
        }))
        .pipe(gulp.dest('./dist/cjs'));
});