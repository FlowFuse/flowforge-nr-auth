const { OAuth2 } = require('oauth')
const { Strategy } = require('./strategy')

module.exports = (options) => {
    ['clientID', 'clientSecret', 'forgeURL', 'baseURL'].forEach(prop => {
        if (!options[prop]) {
            throw new Error(`Missing configuration option ${prop}`)
        }
    })

    const clientID = options.clientID
    const clientSecret = options.clientSecret
    const forgeURL = options.forgeURL
    const baseURL = options.baseURL

    const callbackURL = `${baseURL}/auth/strategy/callback`
    const authorizationURL = `${forgeURL}/account/authorize`
    const tokenURL = `${forgeURL}/account/token`
    const userInfoURL = `${forgeURL}/api/v1/user`

    const oa = new OAuth2(clientID, clientSecret, '', authorizationURL, tokenURL)

    const activeUsers = {}

    function addUser (username, profile, refreshToken, expiresIn) {
        if (activeUsers[username]) {
            clearTimeout(activeUsers[username].refreshTimeout)
        }
        activeUsers[username] = {
            profile,
            refreshToken,
            expiresIn
        }
        activeUsers[username].refreshTimeout = setTimeout(function () {
            oa.getOAuthAccessToken(refreshToken, {
                grant_type: 'refresh_token'
            }, function (err, accessToken, refreshToken, results) {
                if (err) {
                    delete activeUsers[username]
                } else {
                    addUser(username, profile, refreshToken, results.expires_in)
                }
            })
        }, expiresIn * 1000)
    }

    return {
        type: 'strategy',
        strategy: {
            name: 'FlowForge',
            autoLogin: true,
            label: 'Sign in',
            strategy: Strategy,
            options: {
                authorizationURL,
                tokenURL,
                callbackURL: callbackURL,
                userInfoURL: userInfoURL,
                scope: 'editor',
                clientID: clientID,
                clientSecret: clientSecret,
                pkce: true,
                state: true,
                verify: function (accessToken, refreshToken, params, profile, done) {
                    profile.permissions = ['*']
                    addUser(profile.username, profile, refreshToken, params.expires_in)
                    done(null, profile)
                }
            }
        },
        users: async function (username) {
            return activeUsers[username] && activeUsers[username].profile
        }
    }
}
