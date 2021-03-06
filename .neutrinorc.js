const react = require('@neutrinojs/react');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { StatsWriterPlugin } = require("webpack-stats-plugin");
const {DefinePlugin} = require("webpack");
const path = require('path');
const glob = require('glob');

//configure here the basepath for different development environments
//in production this variable is not used, as the basePath is always '/'
var ENV_BASE_PATH = '/php-react-skeleton/web/www';

module.exports = {
  options: {
    root: __dirname,
    source: 'src',
    output: 'www/bundles',
    mains: glob.sync(__dirname + '/src/pages/**/index.js').reduce(function(obj, el){
      let parentDirName = path.basename(path.dirname(el))
      obj[parentDirName] = el;
      return obj
    },{}),
    // mains: {
    //   index: {
    //     entry: 'pages/index.js'
    //   }
    // }
  },
  use: [

    react({
      //https://neutrinojs.org/packages/web/#deployment-path
      //this is the public path on the current work environment
      //the value of this property is not set here, but in the
      //middleware function at the bottom of this config
      publicPath: '',
      //we only want the bundles
      html: false,
      style: false,
      font: {
        name:
          process.env.NODE_ENV === 'production'
            ? '[name].[hash:8].[ext]'
            : '[name].[ext]',
      },
      image: {
        limit: 4192,
        name:
          process.env.NODE_ENV === 'production'
            ? '[name].[hash:8].[ext]'
            : '[name].[ext]',
      },
      clean: true,
      devServer: {
        port: 5000,
        open: false,
        //we want the bundles to be accessible to php
        writeToDisk: true,
        hot: true,
        // liveReload: false,
        // Redirect 404s to index.html, so that apps that use the HTML 5 History API work.
        historyApiFallback: false,
        overlay:{
          warnings: true,
          errors: true,
        },
      },
    }),


    (neutrino) => {
      //add stats-plugin
      neutrino.config
        .plugin('stats')
        .use(StatsWriterPlugin, [{
          stats: {
            all: false,
            entrypoints: true,
          }
        }]);
      //css loaders
      neutrino.config.module
        .rule('css')
        .test(/\.css$/)
          .use('style')
            .loader('style-loader')
            // .options({ injectType: 'linkTag' })
            .end()
          .use('css')
            .loader('css-loader');
      //avif image loader ( the default image-loader package does not support webp )
      neutrino.config.module
        .rule('avif')
        .test(/\.avif$/)
          .use('url')
            .loader('url-loader')
            .options({
              limit: 4192,
              name:
                process.env.NODE_ENV === 'production'
                  ? '[name].[hash:8].[ext]'
                  : '[name].[ext]',
            });
      //conditional configs
      neutrino.config
        .when(process.env.NODE_ENV === 'production',
          //PRODUCTION
          config => config
            .output
              .filename('[name].[contenthash:8].js')
              .publicPath('/bundles/')
              .end()
            .plugin('injection')
              .use(DefinePlugin, [{
                __ENV_BASE_PATH__ : false
              }]),

          //DEVELOPMENT
          config => config
            .output
              .filename('[name].js')
              .publicPath(ENV_BASE_PATH + '/bundles/')
              .end()
            .plugin('clean')
              .use(CleanWebpackPlugin)
              .end()
            .plugin('injection')
              .use(DefinePlugin, [{
                __ENV_BASE_PATH__ : JSON.stringify(ENV_BASE_PATH)
              }])
              .end()
            .devtool('inline-source-map')
        );
    },
  ],
};
