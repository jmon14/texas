// Webpack
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { Configuration, DefinePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import 'webpack-dev-server';

// External libraries
import dotenv from 'dotenv';

// Node
import path from 'path';
import fs from 'fs';

// Environment types
type WebpackEnv = {
  ENVIRONMENT?: Environment;
};
type EnvIndex = dotenv.DotenvParseOutput;
type Environment = 'none' | 'development' | 'production';

const config = (env: WebpackEnv = {}): Configuration => {
  const environment: Environment | undefined = env.ENVIRONMENT;

  // Create the fallback path (the production .env)
  const basePath = path.resolve(__dirname, '.env');
  let envKeys: EnvIndex;
  if (environment !== 'production') {
    // Specify the correct env file
    const envPath = environment ? path.resolve(__dirname, `.env.${environment}`) : basePath;
    // Check if the file exists, otherwise fall back to the production .env
    const finalPath = fs.existsSync(envPath) ? envPath : basePath;
    // Set the path parameter in the dotenv config
    const fileEnv = dotenv.config({ path: finalPath }).parsed as EnvIndex;

    // Merge file env with process.env (process.env takes precedence, but only if values are not empty)
    const processEnvFiltered = Object.fromEntries(
      Object.entries(process.env).filter(([, value]) => value !== undefined && value !== ''),
    );
    const mergedEnv = { ...fileEnv, ...processEnvFiltered };

    // Reduce it to a process env object
    envKeys = Object.keys(mergedEnv || {}).reduce<EnvIndex>((prev, next) => {
      prev[`process.env.${next}`] = JSON.stringify(mergedEnv[next]);
      return prev;
    }, {});
  } else {
    // Reduce it to a process env object
    envKeys = Object.keys(process.env || {}).reduce<EnvIndex>((prev, next) => {
      prev[`process.env.${next}`] = JSON.stringify(process.env[next]);
      return prev;
    }, {});
  }

  return {
    // Remove DevTools warnings regarding node_modules source maps
    ...(environment === 'development' && { devtool: 'eval-source-map' }),
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].js',
      publicPath: '/',
      clean: true,
    },
    mode: environment || 'development',
    optimization: {
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
          mui: {
            test: /[\\/]node_modules[\\/]@mui[\\/]/,
            name: 'mui',
            priority: 20,
            reuseExistingChunk: true,
          },
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/, // Babel compiler
          use: ['babel-loader'],
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/index.html'),
      }),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public'),
            to: path.resolve(__dirname, 'dist'),
          },
        ],
      }),
      new DefinePlugin(envKeys),
      ...(environment === 'production'
        ? [
            new CompressionPlugin({
              algorithm: 'gzip',
              test: /\.(js|css|html|svg)$/,
              threshold: 10240,
              minRatio: 0.8,
            }),
          ]
        : []),
    ],
    devServer: {
      port: 8080,
      open: true,
      hot: 'only',
      compress: true,
      historyApiFallback: true, // Send index.html when 404
      static: [
        {
          directory: path.join(__dirname, './src'),
          publicPath: '/',
        },
        {
          directory: path.join(__dirname, './public'),
          publicPath: '/',
        },
      ],
    },
  };
};

export default config;
