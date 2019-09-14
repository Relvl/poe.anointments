const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");
const glob = require("glob");
const _ = require("underscore");

const paths = {
    root: path.resolve(__dirname, ""),
    src: path.resolve(__dirname, "./src/main/web_build/"),
    dist: path.resolve(__dirname, "./src/main/webapp/"),
    artifact: path.join(__dirname, "build", "libs", "exploded", "logging-subsustem-interface-1.0.0-SNAPSHOT.war"),
};

module.exports = {
    name: "sources",
    context: paths.src,
    watch: false,
    mode: "development",
    devtool: "source-map",
    entry: {
        vendor: ["react", "react-dom", "react-router-dom", "underscore"],
        application: _.flatten([
            glob.sync("./pages/page_*.tsx", {cwd: paths.src}),
            /* Application последним, чтобы все предыдущие скрипты подгрузились */
            "./init.tsx",
            "./scss/application.scss",
        ]),
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    output: {
        path: paths.artifact,
        filename: "[name].[hash:8].js",
        sourceMapFilename: "[name].[hash:8].map",
        chunkFilename: "[id].[hash:8].js",
    },
    devServer: {
        contentBase: paths.dist,
        host: "localhost",
        port: 8443,
        https: true,
        hot: false,
        inline: false,
        stats: {
            colors: true,
            modules: false,
            chunks: false,
            chunkModules: false,
            children: false,
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, {loader: "css-loader", options: {url: false, sourceMap: true}}, {loader: "sass-loader", options: {sourceMap: true}}],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                path.join(paths.artifact, "/*.js"),
                path.join(paths.artifact, "/*.css"),
                path.join(paths.artifact, "/*.map"),
            ],
        }),
        new HtmlWebpackPlugin({
            title: "List of anointments",
            template: "./index.html",
            favicon: "./favicon.ico",
        }),
        new MiniCssExtractPlugin({filename: "[name].css"}),
        /*new OptimizeCssAssetsPlugin({
            cssProcessorOptions: {map: {inline: false}},
            cssProcessorPluginOptions: {preset: ['default', {discardComments: {removeAll: true}}]}
        }),*/
        /*
        new ExtractTextPlugin({
            filename: '[name]',
            allChunks: true,
        })*/
    ],
};

console.log("Scripts: ", module.exports.entry.application) /*FIXME Убрать!*/;
