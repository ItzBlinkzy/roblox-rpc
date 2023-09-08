<img src="https://user-images.githubusercontent.com/68260779/208254746-0055f6a3-2510-426c-b5c2-b3b6ad85715e.png" alt="logo" width="125"/>

# ROBLOX RPC

**ROBLOX RPC** integrates Discord Rich Presence with the ROBLOX API to find the current game on ROBLOX you're playing.

![example](https://github.com/ItzBlinkzy/roblox-rpc/assets/68260779/f15927e0-47e5-4de1-a803-5726aa4ee3cb)
![example2](https://github.com/ItzBlinkzy/roblox-rpc/assets/68260779/2a92818e-d15e-40c7-8024-1793de5851cd)

### This is an alternative to [ro-presence](https://github.com/JiveOff/roPresence).

- **_Why?_** Because ro-presence goes overboard by reading from your [registry](https://github.com/JiveOff/roPresence/blob/master/lib/bloxauth.js) to retrieve your `.ROBLOSECURITY` cookie in order to function.

### How ROBLOX RPC does it.

- **ROBLOX RPC** uses [Bloxlink Verification](https://blox.link) through Discord to find out the account you're verified with and will utilise the ROBLOX API to find the games you're in.

---

## How to use

1. Make sure to follow [RobloxDiscRPC](https://www.roblox.com/users/2485537594/profile) on ROBLOX.

2. Go to your privacy settings and set your `Who can join me?` privacy settings to `Friends and Users I Follow`.
   <img src="https://github.com/ItzBlinkzy/roblox-rpc/assets/68260779/dc5645db-e3b1-434d-aea3-904259e1ce8f" width="600px" height="150"/>

3. Join the [ROBLOX RPC Discord Server](https://discord.com/invite/) to allow Bloxlink to retrieve your roblox details.
4. Verify using [Bloxlink](https://blox.link) with the account used to join the Discord Server.
5. Make sure Discord is open before running the application.

## Installation of exe

1. Download the latest [release](https://github.com/ItzBlinkzy/roblox-rpc/releases) here.
2. Run **roblox-rpc.exe**. _(refer to the FAQ section to confirm the application is running)_

<img src="https://github.com/ItzBlinkzy/roblox-rpc/assets/68260779/ac7f6499-9329-47b9-ac01-949b6aa813e8" width="100" height="25"/>

## Running application locally

**_If you do not want to download the exe file, you can run this application locally._**
Much more effort needed however.

- **Prerequisites**
  - Latest version of NodeJS installed.
  - A code editor, e.g Visual Studio Code.
  - Competent knowledge of NodeJS.

1. Download the repository, either by using `git clone https://github.com/ItzBlinkzy/roblox-rpc.git` command in the terminal or the download zip button.

   <img src="https://user-images.githubusercontent.com/68260779/208813278-614345f6-b3e7-4c23-9ff8-6d255eda9ef5.png"
   alt="installation" width="200"/>

2. Because this is an electron application you must install **electron** with npm by running this command in the terminal. `npm install electron -g`. This will allow you to run electron from the terminal.

3. You will have to add a `config.json` file in the root of the folder. This file includes the following.

```
{
    "apiKey": "API-KEY-HERE",
    "clientId": "1018245597465157742",
    "cookie": "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_A29UI34..............."
}
```

- The `apiKey` is a guild api key from [Bloxlink](https://blox.link) you will have to go to their website and get one.
- The `clientId` is my Discord Application ID, you don't need to change it unless you want to.
- The `cookie` comes from a "bot" account that will track what game you're in. You will have to create this bot account in an **incognito window** because logging out in a normal window will stop the cookie from working. Take the .ROBLOSECURITY Cookie and place it here **REMEMBER THE NAME OF THIS ACCOUNT!** _(Don't log out of the account, just close the window.)_

4. You will need to follow the account you just created with your main ROBLOX account that you wanted tracked and then set the privacy settings to `Friends and Users I Follow`.
5. Go back to your editor and run `npm install` to get all the packages that are required.
6. Run the program using `electron ./main.js`. Make sure you are in the correct path.

_If you want to create your own exe, use `npm run make` and **electron-forge** should make your exe and store it in `out` folder. (located in the root of the repository)._

## FAQ

- **_How do I know it's running?_**

  - A window should pop up and load your ROBLOX and Discord account name and id's showing you which accounts you are verified with.

  <img src="https://github.com/ItzBlinkzy/roblox-rpc/assets/68260779/6ad5a69b-1854-4619-b845-b19c195fc3d1"
    alt="installation" width="500" height="300"/>

- **_Do I need the window open for the RPC to work on Discord?_**

  - Closing the window will close the application, however you can minimize the window and it will work fine.

- **_Can I use this on MacOS?_**

  - Currently this has only been tested on Windows. Downloading this on MacOS might have many bugs. Or may not work at all

## Issues

If you come across any problems using ROBLOX RPC feel free to ask help in the [Discord Server](https://discord.com/invite/aq9rwUCQrK) or submit an [issue](https://github.com/ItzBlinkzy/roblox-rpc/issues).

## Credits

- [ItzBlinkzy](https://github.com/ItzBlinkzy/)
  - You can be here too if you'd like to contribute.

## License

MIT License
