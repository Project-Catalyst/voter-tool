let publicPath = ''
if (process.env.APP_ENV === 'production') {
  publicPath = '/voter-tool/'
}
if (process.env.APP_ENV === 'staging') {
  publicPath = '/'
}
module.exports = {
  publicPath: publicPath
}
