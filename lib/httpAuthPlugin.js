const { setupAuthRoutes } = require('./httpAuthMiddleware')

module.exports = (RED) => {
    RED.plugins.registerPlugin('ff-auth-plugin', {
        onadd: () => {
            setupAuthRoutes(RED.httpNode)
        }
    })
}
