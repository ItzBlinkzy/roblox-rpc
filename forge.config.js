const fs = require('fs')
const path = require('path')
module.exports = {
  packagerConfig: {
    asar: true,
    icon: './images/logo.ico'
  },
  rebuildConfig: {},
  hooks: {
    packageAfterPrune: async (forgeConfig, buildPath, electronVersion, platform, arch) => {
      if (platform === 'darwin') {
        // we want to remove the problematic link on macOS 
        fs.unlinkSync(path.join(buildPath, 'node_modules/register-scheme/build/node_gyp_bins/python3'))
      }
    }
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
