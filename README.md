<img src="https://user-images.githubusercontent.com/68260779/208254746-0055f6a3-2510-426c-b5c2-b3b6ad85715e.png" alt="logo" width="125"/>

# ROBLOX RPC

> **⚠️ PROJECT STATUS: NO LONGER MAINTAINED**
> 
> Discord has officially added native Roblox Rich Presence integration, making this application redundant. While ROBLOX RPC will continue to function for now, there's no longer a need to use it once Discord's native feature becomes available to all users.
> 
> **This project is now considered complete and will no longer receive updates or maintenance.**

<a href="https://discord.com/invite/aq9rwUCQrK"><img src="https://discordapp.com/api/guilds/1149469425968361523/widget.png?style=banner3" alt="Discord Banner"/></a>

### Download the latest [release](https://github.com/ItzBlinkzy/roblox-rpc/releases) of ROBLOX RPC.

**ROBLOX RPC** integrates Discord Rich Presence with the ROBLOX API to find the current game on ROBLOX you're playing.

![example](https://github.com/ItzBlinkzy/roblox-rpc/assets/68260779/a986ef6e-7259-4616-a2e1-962dedc4e2dd)
![example2](https://github.com/ItzBlinkzy/roblox-rpc/assets/68260779/f691473f-2cd8-4001-b6d3-38c037c5f6a2)

### This is an alternative to [ro-presence](https://github.com/JiveOff/roPresence).

- **_Why?_** Because ro-presence goes overboard by reading from your [registry](https://github.com/JiveOff/roPresence/blob/master/lib/bloxauth.js) to retrieve your `.ROBLOSECURITY` cookie in order to function.

### How ROBLOX RPC does it.

- **ROBLOX RPC** uses [Bloxlink Verification](https://blox.link) through Discord to find out the account you're verified with and will utilise the ROBLOX API to find the games you're in.
- You will have to create a new account and use it's cookie .
  - This is a "**bot account**" that will be used to track what games you play on a separate account.

---

## How to use

1. **Verify** with Bloxlink in the [Discord Server](https://discord.com/invite/aq9rwUCQrK).

2. Open an incognito window and **create a new ROBLOX account**.

3. Open your verified account in a normal window and **follow the new account** you just created.

4. Go to your verified account's **privacy settings** and set your `Who can join me?` privacy settings to `Friends and Users I Follow`.

   <img src="https://github.com/ItzBlinkzy/roblox-rpc/assets/68260779/dc5645db-e3b1-434d-aea3-904259e1ce8f" width="650" height="80"/>

5. Return back to the incognito window open the **Dev Tools** (inspect element) and go to Application tab then, go to cookies.
   <img src="https://github.com/ItzBlinkzy/roblox-rpc/assets/68260779/71ccb62c-3f49-476d-be9c-c82fa49c3469" width="800" height="310"/>
6. Right click and **copy the .ROBLOSECURITY value** including the warning and paste it into ROBLOX RPC's bot cookie input.

<img src="https://github.com/ItzBlinkzy/roblox-rpc/assets/68260779/83a6df6e-9014-4aa2-b365-7c58ebffd442" width="320" height="240" sty/>

7. Finally close the incognito window **(DONT CLICK LOG OUT)**

## Installation of exe

1. Download the latest [release](https://github.com/ItzBlinkzy/roblox-rpc/releases) here.
2. Run **roblox-rpc.exe**. _(refer to the FAQ section to confirm the application is running)_
   <img src="https://github.com/ItzBlinkzy/roblox-rpc/assets/68260779/ac7f6499-9329-47b9-ac01-949b6aa813e8" width="100" height="25"/>

---

### Running application locally

#### **_Only do this if you dont want to run the EXE file_**

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
    "clientId": "1018245597465157742"
}
```

- The `apiKey` is a guild api key from [Bloxlink](https://blox.link) you will have to go to their website and get one.
- The `clientId` is my Discord Application ID, you don't need to change it unless you want to.

Run the program using `electron ./main.js`. Make sure you are in the correct path.

_If you want to create your own exe, use `npm run make` and **electron-forge** should make your exe and store it in `out` folder. (located in the root of the repository)._

## FAQ

- **_How do I know it's running?_**

  - A window should pop up and load your ROBLOX and Discord account name and id's showing you which accounts you are verified with.

  <img src="https://github.com/ItzBlinkzy/roblox-rpc/assets/68260779/aa124731-a567-4a4e-85e4-886b337d92fa" alt="installation" width="640" height="480"/>

- **_Do I need the window open for the RPC to work on Discord?_**

  - No, ROBLOX RPC is able to run in the background when the window is closed.

  - To re-open the window, **left-click** the rpc icon in the tray (bottom right corner of your taskbar).

    <img src="https://github.com/ItzBlinkzy/roblox-rpc/assets/68260779/ada345f2-538e-4399-a9e8-1dacdbe803c4" alt="installation" width="250" height="150"/>

  - To exit, **right-click** the icon to view the context menu and choose the "❌ Quit" button.

    <img src="https://github.com/ItzBlinkzy/roblox-rpc/assets/68260779/b072bd5c-7821-45ca-b6a5-29e9dc94e60f" alt="installation" width="180" height="90"/>

- **_Can I use this on MacOS?_**

  - Currently this has only been tested on Windows. Downloading this on MacOS **or any other operating systems** might have many bugs or may not work at all.

## Issues

~~If you come across any problems using ROBLOX RPC feel free to ask help in the [Discord Server](https://discord.com/invite/aq9rwUCQrK) or submit an [issue](https://github.com/ItzBlinkzy/roblox-rpc/issues).~~

**Note: As this project is no longer maintained, no new issues will be addressed. The application will continue to function as-is until Discord's native Roblox integration becomes widely available.**

## Credits

- [ItzBlinkzy](https://github.com/ItzBlinkzy/)
- [DarthMDev](https://github.com/DarthMDev/)
  - You can be here too if you'd like to contribute.

## License

MIT License
