
// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

const webpack = require('webpack');
const path = require('path');
// const ReactIntlAggregatePlugin = require('react-intl-aggregate-webpack-plugin');
const WebpackErrorNotificationPlugin = require('webpack-error-notification');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const rulesEs6 = require('./rules/es6');
const rulesParity = require('./rules/parity');
const Shared = require('./shared');

const DAPPS_BUILTIN = require('../packages/shared/config/dappsBuiltin.json');
const DAPPS_VIEWS = require('../packages/shared/config/dappsViews.json').map((dapp) => {
  dapp.commons = true;
  return dapp;
});

const FAVICON = path.resolve(__dirname, '../packages/shared/assets/images/parity-logo-black-no-text.png');

const DEST = process.env.BUILD_DEST || '.build';
const ENV = process.env.NODE_ENV || 'development';
const EMBED = process.env.EMBED;

const isProd = ENV === 'production';
const isEmbed = EMBED === '1' || EMBED === 'true';
const isAnalize = process.env.WPANALIZE === '1';

const entry = isEmbed
  ? {
    embed: './embed.js'
  }
  : Object.assign({}, Shared.dappsEntry, {
    index: './index.js'
  });

module.exports = {
  cache: !isProd,
  devtool: isProd ? '#hidden-source-map' : '#source-map',

  context: path.join(__dirname, '../src'),
  entry: entry,
  output: {
    // publicPath: '/',
    path: path.join(__dirname, '../', DEST),
    filename: '[name].[hash:10].js'
  },

  module: {
    rules: [
      rulesParity,
      rulesEs6,
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [ 'happypack/loader?id=babel-js' ]
      },
      {
        test: /\.json$/,
        use: [ 'json-loader' ]
      },
      {
        test: /\.ejs$/,
        use: [ 'ejs-loader' ]
      },
      {
        test: /\.html$/,
        use: [
          'file-loader?name=[name].[ext]!extract-loader',
          {
            loader: 'html-loader',
            options: {
              root: path.resolve(__dirname, '../assets/images'),
              attrs: ['img:src', 'link:href']
            }
          }
        ]
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'html-loader',
            options: {}
          },
          {
            loader: 'markdown-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.css$/,
        include: [ /packages/, /src/ ],
        loader: (isProd && !isEmbed)
          ? ExtractTextPlugin.extract([
            // 'style-loader',
            'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
            'postcss-loader'
          ])
          : undefined,
        use: (isProd && !isEmbed)
          ? undefined
          : [ 'happypack/loader?id=css' ]
      },

      {
        test: /\.css$/,
        exclude: [ /packages/, /src/ ],
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(png|jpg)$/,
        use: [ 'file-loader?&name=assets/[name].[hash:10].[ext]' ]
      },
      {
        test: /\.(woff|woff2|ttf|eot|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [ 'file-loader?name=fonts/[name][hash:10].[ext]' ]
      },
      {
        test: /parity-logo-white-no-text\.svg/,
        use: [ 'url-loader' ]
      },
      {
        test: /\.svg(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        exclude: [ /parity-logo-white-no-text\.svg/ ],
        use: [ 'file-loader?name=assets/[name].[hash:10].[ext]' ]
      }
    ],
    noParse: [
      /node_modules\/sinon/
    ]
  },

  resolve: {
    alias: {
      '~/packages/api/local': path.resolve(__dirname, '../packages/api/local/localAccountsMiddleware.js'),
      '~': path.resolve(__dirname, '..'),
      '@parity/wordlist': path.resolve(__dirname, '../node_modules/@parity/wordlist'),
      '@parity': path.resolve(__dirname, '../packages'),
      '@parity/parity.js': path.resolve(__dirname, '../src/library.parity.js'),
      'oo7-parity': path.resolve(__dirname, '../oo7-parity'),
      'oo7-react': path.resolve(__dirname, '../oo7-react'),
      'oo7': path.resolve(__dirname, '../oo7'),
      'parity-reactive-ui': path.resolve(__dirname, '../parity-reactive-ui')
    },
    modules: [
      path.join(__dirname, '../node_modules')
    ],
    extensions: ['.json', '.js', '.jsx'],
    unsafeCache: true
  },

  node: {
    fs: 'empty'
  },

  plugins: (function () {
    const DappsHTMLInjection = []
      .concat(DAPPS_BUILTIN, DAPPS_VIEWS)
      .filter((dapp) => !dapp.skipBuild)
      .map((dapp) => {
        return new HtmlWebpackPlugin({
          title: dapp.name,
          filename: dapp.url + '.html',
          template: '../packages/dapps/index.ejs',
          favicon: FAVICON,
          secure: dapp.secure,
          chunks: [ !isProd || dapp.commons ? 'commons' : null, dapp.url ]
        });
      });

    let plugins = Shared.getPlugins().concat(
      new WebpackErrorNotificationPlugin()
    );

    if (!isEmbed) {
      plugins = [].concat(
        plugins,

        new HtmlWebpackPlugin({
          title: 'Parity',
          filename: 'index.html',
          template: './index.ejs',
          favicon: FAVICON,
          chunks: [
            isProd ? null : 'commons',
            'index'
          ]
        }),

        new ServiceWorkerWebpackPlugin({
          entry: path.join(__dirname, '../src/serviceWorker.js')
        }),

        DappsHTMLInjection,

        new webpack.DllReferencePlugin({
          context: '.',
          manifest: require(`../${DEST}/vendor-manifest.json`)
        }),

        new ScriptExtHtmlWebpackPlugin({
          sync: [ 'commons', 'vendor.js' ],
          defaultAttribute: 'defer'
        }),

        new CopyWebpackPlugin([
          { from: './error_pages.css', to: 'styles.css' },
          { from: '../packages/dapps/static' }
        ], {})
      );
    }

    if (isEmbed) {
      plugins.push(
        new HtmlWebpackPlugin({
          title: 'Parity Bar',
          filename: 'embed.html',
          template: './index.ejs',
          favicon: FAVICON,
          chunks: [
            isProd ? null : 'commons',
            'embed'
          ]
        })
      );
    }

    if (!isAnalize && !isProd) {
      // const DEST_I18N = path.join(__dirname, '..', DEST, 'i18n');

      plugins.push(
        // new ReactIntlAggregatePlugin({
        //   messagesPattern: DEST_I18N + '/i18n/**/*.json',
        //   aggregateOutputDir: DEST_I18N + '/i18n/',
        //   aggregateFilename: 'en'
        // }),

        new webpack.optimize.CommonsChunkPlugin({
          filename: 'commons.[hash:10].js',
          name: 'commons',
          minChunks: 2
        })
      );
    }

    if (isProd) {
      plugins.push(new ExtractTextPlugin({
        filename: 'styles/[name].[hash:10].css',
        allChunks: true
      }));
    }

    return plugins;
  }())
};
