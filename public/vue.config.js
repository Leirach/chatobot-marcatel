process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
    // config
    productionSourceMap: false,
    publicPath: '/',
    pwa: {
        workboxOptions: {
            skipWaiting: true
        },
        name: 'Dialogflow Agent',
        themeColor: '#42a5f5'
    }
}