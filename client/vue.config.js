module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3333',
      },
    },
    disableHostCheck: true,
  },
  outputDir: '../server/public',
};
