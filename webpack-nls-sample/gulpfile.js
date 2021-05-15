const gulp = require('gulp');
const del = require('del');
const rename = require('gulp-rename');
const es = require('event-stream');
const nls = require('vscode-nls-dev');

// 支持的语言
const languages = [{ folderName: 'zh-cn', id: 'zh-cn' }];

const cleanTask = function() {
        return del(['**/nls.metadata.json', '**/nls.metadata.header.json', '**/nls.bundle.*.json', 'package.nls.*.json']);
}
gulp.task('clean', cleanTask);

// 源码
const sourcesNsl = function () {
        return gulp.src(['**/*.nls.metadata.json'], { base: "./out" })
                .pipe(nls.createAdditionalLanguageFiles(languages, 'i18n', ''))
                .pipe(nls.bundleMetaDataFiles('webpack-nls-sample', ''))
                .pipe(nls.bundleLanguageFiles())
                .pipe(gulp.dest(`./out`));
};

// package.json
const packageNls = function () {
        return gulp.src(['package.nls.json'], { allowEmpty: true })
                .pipe(nls.createAdditionalLanguageFiles(languages, 'i18n'))
                .pipe(gulp.dest('.'));
};

const nlsTask = gulp.series(cleanTask, sourcesNsl, packageNls);
gulp.task('nls', nlsTask);


// 提取需要翻译的字符串到i18n/base目录，方便翻译
const sourcesMsg = function () {
        const suffix = '.i18n.json';
        var r = gulp.src(['out/**/*.nls.metadata.json'], { base: "./out" })
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
        var r = gulp.src(['package.nls.json'])
                .pipe(rename({ basename:"package", suffix: ".i18n"}))
                .pipe(gulp.dest(`./i18n/base`));
        return r;
};

const messageTask = gulp.series(sourcesMsg, packageMsg);
gulp.task('message', messageTask);