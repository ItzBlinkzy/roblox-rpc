const packager = require('electron-packager');

// for creating new build exe's
const options = {
    'arch': 'ia32',
    'platform': 'win32',
    'dir': './',
    'app-copyright': 'Blinkzy#3819',
    'app-version': '1.0.2',
    'asar': true,
    'icon': './logo.ico',
    'name': 'roblox-rpc',
    'out': './releases',
    'overwrite': true,
    'prune': true,
    'version': '12.0.2',
    'version-string': {
        'CompanyName': 'Blinkzy#3819',
        'FileDescription': 'Discord Rich Presence Client for ROBLOX.', /*This is what display windows on task manager, shortcut and process*/
        'OriginalFilename': 'roblox-rpc',
        'ProductName': 'roblox-rpc',
        'InternalName': 'roblox-rpc'
    }
};
packager(options, function done_callback(err, appPaths) {
    console.log("Error: ", err);
    console.log("appPaths: ", appPaths);
});
