# @flowforge/nr-auth

A Node-RED Authentication Plugin for the FlowForge platform.

This plugin provides a complete `adminAuth` configuration to tie a Node-RED instance
to the FlowForge platform.

### Configuration

```
adminAuth: require("@flowforge/nr-auth")({
    baseURL: 'http://localhost:1880',
    forgeURL: 'http://localhost:3000',
    clientID: 'ffp_c3Q_9joF21JiAEUopN9RKc4sJbGZbkmFOM13mT3nlEg',
    clientSecret: 'XjS2D7fYYhFW2yUj5mdDm0Oys8zVRVd0EKIla2iEpgP-vXSBkSy6-qEujLqIf7Og'
})
```

 - `baseURL` - the URL for the local Node-RED Admin API
 - `forgeURL` - the URL for the FlowForge platform instance
 - `clientID`/`clientSecret` - credentials for the project created by the FlowForge platform
