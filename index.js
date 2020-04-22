const path = require('path')
const Koa = require('koa')
const static = require('koa-static');
const proxy = require('koa-server-http-proxy');
const { historyApiFallback } = require('koa2-connect-history-api-fallback');
var c = require('child_process');
module.exports = async function(ctx, opts) {
  const app = new Koa();
  const {
    port = '4000',
    root = './',
    host = 'localhost',
    open = true
  } = (opts || {});
  // 单页应用 Borowser history 时刷新404 通过配置 historyApiFallback解决
  if ( opts.historyApiFallback ) {
    app.use(historyApiFallback(opts.historyApiFallback));
  }
  // 静态资源配置
  app.use(static(path.join(ctx.cwd, root )));
  // 代理配置
  if (opts.proxyTable ) {
    const proxyTable= opts.proxyTable;
    Object.keys(proxyTable).forEach((context) => {
      var options = proxyTable[context]
      app.use(proxy(context, options))
    })
  }
  app.listen(port, () => {
    const url = `http://${host}:${port}`;
    ctx.log.info(`服务已开启: ${url}`);
    if (open !== false) {
      c.exec(`start ${url}`);
    }
  })
}