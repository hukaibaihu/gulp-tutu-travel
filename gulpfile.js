// generated on 2024-12-08 using generator-webapp 4.0.0-9
const { src, dest, watch, series, parallel, lastRun } = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');
const autoprefixer = require('autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('cssnano');
const { argv } = require('yargs');

const $ = gulpLoadPlugins();
const server = browserSync.create();

const port = argv.port || 9000;

const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const isDev = !isProd && !isTest;

function styles() {
  return src('src/styles/*.scss', {
    sourcemaps: !isProd,
  })
    .pipe($.plumber())
    .pipe(sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.'],
      silenceDeprecations: ['legacy-js-api'],
    }).on('error', sass.logError))
    .pipe($.postcss([
      autoprefixer()
    ]))
    .pipe(dest('.tmp/styles', {
      sourcemaps: !isProd,
    }))
    .pipe(server.reload({stream: true}));
};

function scripts() {
  return src('src/scripts/**/*.js', {
    sourcemaps: !isProd,
  })
    .pipe($.plumber())
    .pipe($.babel())
    .pipe(dest('.tmp/scripts', {
      sourcemaps: !isProd ? '.' : false,
    }))
    .pipe(server.reload({stream: true}));
};


const lintBase = (files, options) => {
  return src(files)
    .pipe($.eslint(options))
    .pipe(server.reload({stream: true, once: true}))
    .pipe($.eslint.format())
    .pipe($.if(!server.active, $.eslint.failAfterError()));
}
function lint() {
  return lintBase('src/scripts/**/*.js', { fix: true })
    .pipe(dest('src/scripts'));
};
function lintTest() {
  return lintBase('test/spec/**/*.js');
};

function pugs() {
  return src('src/*.pug')
    .pipe($.pug({ doctype: 'html', pretty: true }))
    .pipe(dest('.tmp'));
}

function html() {
  // return src('src/*.html')
  //   .pipe($.useref({searchPath: ['.tmp', 'src', '.']}))
  return src('.tmp/*.html')
    .pipe($.useref({searchPath: ['.tmp', '.']}))
    .pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
    .pipe($.if(/\.css$/, $.postcss([cssnano({safe: true, autoprefixer: false})])))
    // html压缩
    // .pipe($.if(/\.html$/, $.htmlmin({
    //   collapseWhitespace: true,
    //   minifyCSS: true,
    //   minifyJS: {compress: {drop_console: true}},
    //   processConditionalComments: true,
    //   removeComments: true,
    //   removeEmptyAttributes: true,
    //   removeScriptTypeAttributes: true,
    //   removeStyleLinkTypeAttributes: true
    // })))
    .pipe(dest('dist'));
}

function images() {
  return src('src/images/**/*', { since: lastRun(images) })
    .pipe($.imagemin())
    .pipe(dest('dist/images'));
};

function fonts() {
  return src('src/fonts/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe($.if(!isProd, dest('.tmp/fonts'), dest('dist/fonts')));
};

function extras() {
  return src([
    'src/*',
    '!src/*.html',
    '!src/pugs',
    '!src/**/*.pug',
  ], {
    dot: true
  }).pipe(dest('dist'));
};

function extraBootstrapIcons() {
  return src('node_modules/bootstrap-icons/font/fonts/*')
    .pipe(dest('dist/styles/fonts'));
};

function clean() {
  return del(['.tmp', 'dist'])
}

function measureSize() {
  return src('dist/**/*')
    .pipe($.size({title: 'build', gzip: true}));
}

const build = series(
  clean,
  parallel(
    lint,
    series(parallel(styles, scripts), pugs, html),
    images,
    fonts,
    extras,
    extraBootstrapIcons
  ),
  measureSize
);

function startAppServer() {
  server.init({
    notify: false,
    port,
    server: {
      baseDir: ['.tmp', 'src'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });

  watch([
    // 'src/*.html',
    'src/**/*.pug',
    'src/images/**/*',
    '.tmp/fonts/**/*',
  ]).on('change', server.reload);

  watch('src/**/*.pug', pugs);
  watch('src/styles/**/*.scss', styles);
  watch('src/scripts/**/*.js', scripts);
  watch('src/fonts/**/*', fonts);
}

function startTestServer() {
  server.init({
    notify: false,
    port,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/node_modules': 'node_modules'
      }
    }
  });

  watch('test/index.html').on('change', server.reload);
  watch('src/scripts/**/*.js', scripts);
  watch('test/spec/**/*.js', lintTest);
}

function startDistServer() {
  server.init({
    notify: false,
    port,
    server: {
      baseDir: 'dist',
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });
}

let serve;
if (isDev) {
  serve = series(clean, parallel(styles, scripts, fonts), pugs, startAppServer);
} else if (isTest) {
  serve = series(clean, scripts, startTestServer);
} else if (isProd) {
  serve = series(build, startDistServer);
}

exports.serve = serve;
exports.build = build;
exports.default = build;
