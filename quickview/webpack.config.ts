// Webpack
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { Configuration, DefinePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import 'webpack-dev-server';

// External libraries
import dotenv from 'dotenv';

// Node
import path from 'path';
import fs from 'fs';

// Environment types
type WebpackEnv = {
  ENVIRONMENT: Environment;
};
type EnvIndex = dotenv.DotenvParseOutput;
type Environment = 'none' | 'development' | 'production';

const config = (env: WebpackEnv): Configuration => {
  // Create the fallback path (the production .env)
  const basePath = __dirname + '/.env';
  let envKeys: EnvIndex;
  if (env.ENVIRONMENT !== 'production') {
    // Specify the correct env file
    const envPath = basePath + '.' + env.ENVIRONMENT;
    // Check if the file exists, otherwise fall back to the production .env
    const finalPath = fs.existsSync(envPath) ? envPath : basePath;
    // Set the path parameter in the dotenv config
    const fileEnv = dotenv.config({ path: finalPath }).parsed as EnvIndex;
    // Reduce it to a process env object
    envKeys = Object.keys(fileEnv).reduce<EnvIndex>((prev, next) => {
      prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
      return prev;
    }, {});
  } else {
    // Reduce it to a process env object
    envKeys = Object.keys(process.env).reduce<EnvIndex>((prev, next) => {
      prev[`process.env.${next}`] = JSON.stringify(process.env[next]);
      return prev;
    }, {});
  }

  return {
    // Remove DevTools warnings regarding node_modules source maps
    ...(env.ENVIRONMENT === 'development' && { devtool: 'eval-source-map' }),
    entry: path.resolve(__dirname, 'src', 'index.tsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js',
      publicPath: '/',
    },
    mode: env.ENVIRONMENT,
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
      new DefinePlugin(envKeys),
    ],
    devServer: {
      port: 8080,
      open: true,
      hot: 'only',
      compress: true,
      historyApiFallback: true, // Send index.html when 404
      static: path.join(__dirname, './src'),
    },
  };
};

export default config;
