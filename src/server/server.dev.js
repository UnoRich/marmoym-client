const path = require('path');
const webpack = require('webpack');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const i18n = require('marmoym-i18n');

const getConfig = require('./getConfig');

const app = express();
const config = require(getConfig(process.env.PLATFORM, process.env.NODE_ENV));
const compiler = webpack(config);

const DIST_PATH = path.resolve(__dirname, '../../dist');

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    color: true,
  },
}));

app.use(webpackHotMiddleware(compiler, {
  heartbeat: 2000,
}));

app.get('/ss/i18n/:locale', function(req, res) {
  console.log('Returning i18n %s', req.params.locale);
  const ret = {
    code: 200000,
    payload: {
      locale: i18n[req.params.locale],
    },
  };

  // todo: validation
  res.status(200)
    .send(ret);
});

app.use('/', function(req, res) {
  var file = path.join(DIST_PATH, 'index.html');
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

// app.listen(3001, function(err) {
//   if (err) {
//     return logger.error(err);
//   }
//   logger.debug('Listening at http://localhost:3001/');
// });

module.exports = app;
