const gulp = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
const es = require('event-stream');
const nls = require('vscode-nls-dev');

// 支持的语言
const languages = [{ folderName: 'zh-cn', id: 'zh-cn' }];

const cleanout = function () {
    return del(['out/**', 'package.nls.*.json']);
}

gulp.task('clean', cleanout);

// 源码
// 如果不适用单一国际化文件，删除掉nls.bundleMetaDataFiles和nls.bundleLanguageFiles即可
const sourcesNsl = function () {
    var r = gulp.src(['./**/*.js', '!node_modules/**', '!gulpfile.js'])
        .pipe(nls.rewriteLocalizeCalls())
        .pipe(nls.createAdditionalLanguageFiles(languages, 'i18n', ''))
        .pipe(nls.bundleMetaDataFiles('js-nls-sample', ''))
        .pipe(nls.bundleLanguageFiles());

    // 输出到out目录
    return r.pipe(gulp.dest("out"));
};

// package.json
const packageNls = function () {
    return gulp.src(['package.nls.json'], { allowEmpty: true })
        .pipe(nls.createAdditionalLanguageFiles(languages, 'i18n'))
        .pipe(gulp.dest('.'));
};

gulp.task('nls', gulp.series(cleanout, sourcesNsl, packageNls));

// 提取需要翻译的字符串到i18n/base目录，方便翻译
const sourcesMsg = function () {
    const suffix = '.i18n.json';
    var r = gulp.src(['./**/*.js', '!node_modules/**', '!out/**', '!gulpfile.js'])
        .pipe(nls.rewriteLocalizeCalls())
        .pipe(nls.createKeyValuePairFile())
        .pipe(es.through(function (file) {
            // 仅处理.i18n.json
            if (file.path.indexOf(suffix, file.path.length - suffix.length) !== -1) {
                this.queue(file);
            }
        }))
        .pipe(gulp.dest(`./i18n/base`));
    return r;
};

// package.nls.json，结构一致，只需要拷贝一份
const packageMsg = function () {
    var r = gulp.src(['package.nls.json'], { allowEmpty: true })
        .pipe(rename({ basename: "package", suffix: ".i18n" }))
        .pipe(gulp.dest(`./i18n/base`));
    return r;
};

const messageTask = gulp.series(sourcesMsg, packageMsg);
gulp.task('message', messageTask);