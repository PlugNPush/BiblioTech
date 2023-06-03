const {createProxyMiddleware} = require("http-proxy-middleware");
module.exports = app => {
    app.use(createProxyMiddleware("/books/v1/", {
        target:'https://www.googleapis.com',
        changeOrigin: true
    }))
}