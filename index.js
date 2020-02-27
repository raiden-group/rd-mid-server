const path = require('path')
const Koa = require('koa')
const static = require('koa-static')
var c = require('child_process');
module.exports = async function(ctx, opts) {
  const app = new Koa();
  const {
    port = '4000',
    root = './',
    host = 'localhost',
    open = true
  } = (opts || {});
  app.use(static(path.join(ctx.cwd, root )));
  app.listen(port, () => {
    const url = `http://${host}:${port}`;
    ctx.log.info(`服务已开启: ${url}`);
    if (open !== false) {
      c.exec(`start ${url}`);
    }
  })
}