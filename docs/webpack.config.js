const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const eslintFriendlyFormatter = require("eslint-friendly-formatter");

module.exports = {
    context: __dirname,
    mode: process.env.NODE_ENV || 'development',
    module: {
        rules: [
            {
                test: /\.(js|vue)$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                enforce: "pre",
                options: {
                    formatter: eslintFriendlyFormatter
                }
            },
            {
                test: /\.js/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                  babelrc: true
                }
            },
            {
                test: /\.vue$/,
                use: ["vue-loader"],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    },

    plugins: [
        new VueLoaderPlugin()
    ],

    resolve: {
        extensions: [".js", ".vue"],
        alias: {
            vue: "vue/dist/vue.esm-bundler.js"
        }
    },

    entry: "./index.js",

    output: {
        path: path.resolve(__dirname, "build"),
        filename: "app.js",
        publicPath: "/build/"
    },

    devServer: {
        contentBase: __dirname,
        port: 2000
    }
};
