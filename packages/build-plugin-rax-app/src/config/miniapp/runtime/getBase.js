const getWebpackBase = require('../../getWebpackBase');
const getAppConfig = require('./getAppConfig');
const setEntry = require('./setEntry');
const KboneMpPlugin = require('../../../plugins/KboneMpPlugin');

module.exports = (context, target) => {
  const config = getWebpackBase(context);

  const appConfig = getAppConfig(context);
  setEntry(config, context, appConfig.routes);

  config.output
    .filename(`${target}/common/[name].js`)
    .library("createApp")
    .libraryExport("default")
    .libraryTarget("window");

  config.externals([
    function(ctx, request, callback) {
      if (request.indexOf("@weex-module") !== -1) {
        return callback(null, "undefined");
      }
      callback();
    },
  ]);

  config.plugin("MpPlugin").use(KboneMpPlugin, [{ ...appConfig, target }]);

  config.devServer.writeToDisk(true).noInfo(true).inline(false);

  return config;
};