const path = require('path');
const webpack = require('webpack');
const express = require('express')
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const i18n = require('marmoym-i18n');

const logger = require('./logger');
const getConfig = require('./getConfig');

/**
 * Marmoym-i18n sanity check.
 * On error, logs into console.
 */
const I18N_VERSION = '0.0.1';
if (i18n.version != I18N_VERSION) {
  logger.warn(
    `marmoym-i18n is an incompatible version. Check the version or 'npm install'.`);
  process.exit(-1);
}

const app = express();
const config = require(getConfig(process.env.PLATFORM, process.env.NODE_ENV));
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    color: true
  },
}));

app.use(webpackHotMiddleware(compiler, {
  heartbeat: 2000
}));

app.get('/ss/i18n/:locale', function(req, res) {
  logger.debug('Returning i18n', req.params.locale);
  const ret = {
    code: 200000,
    payload: {
      locale: i18n[req.params.locale]
    }
  }
  
  // todo: validation
  res.status(200)
    .send(ret);
});

app.use('/', function (req, res) {
  var file = path.resolve(__dirname, '..', 'dist', 'index.html');
  res.sendFile(file);
});

// app.use('*', function (req, res, next) {
//   /**
//    * Serving index.html generated by HtmlWebpackPlugin was a bit hard,
//    * Found a solution here, 
//    * @see https://github.com/jantimon/html-webpack-plugin/issues/145#issuecomment-170554832
//    */
//   var filename = path.join(compiler.outputPath, 'index.html');
//   compiler.outputFileSystem.readFile(filename, function(err, result){
//     if (err) {
//       return next(err);
//     }
//     res.set('content-type','text/html');
//     res.send(result);
//     res.end();
//   });
// });

app.listen(3001, function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('Listening at http://localhost:3001/');
});