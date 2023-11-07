import path from "path";

const dirname = path.resolve();

export default {
    entry: [
        "./public/index.mjs"
    ],
    mode: "development",
    output: {
        filename: "index.mjs",
        path: path.resolve(dirname, "dist"),
    },
    devServer: {
        static: {
            directory: path.join(dirname, "public"),
        },
        open: {
            target: ["/index.html"]
        },
        client: {
            overlay: false,
        },
        compress: true,
        port: 3334,
        devMiddleware: {
            writeToDisk: true,
        },
    },
};
