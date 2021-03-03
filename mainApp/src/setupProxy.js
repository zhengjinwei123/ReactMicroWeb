const {createProxyMiddleware} = require("http-proxy-middleware")


module.exports = function (app) {
    app.use(
        createProxyMiddleware(
            '/api',
            {
                target: "http://localhost:8801",
                changeOrigin: true,
            }
        )
    )
}