<img src="https://user-images.githubusercontent.com/68260779/208254746-0055f6a3-2510-426c-b5c2-b3b6ad85715e.png" alt="logo" width="125"/>

# ROBLOX RPC

**ROBLOX RPC** integrates Discord Rich Presence with the ROBLOX API to find the current game on ROBLOX you're playing.

![example](https://user-images.githubusercontent.com/68260779/208825844-fd52ffec-50cf-4ede-9f08-460dd26d52b6.png)
![example2](https://user-images.githubusercontent.com/68260779/208825994-a04c9a69-322d-4e8e-97cf-b8316426143f.png)


### This is an alternative to [ro-presence](https://github.com/JiveOff/roPresence).
* ***Why?*** Because ro-presence goes overboard by reading from your [registry](https://github.com/JiveOff/roPresence/blob/master/lib/bloxauth.js) to retrieve your `.ROBLOSECURITY` cookie in order to function.


### How ROBLOX RPC does it.
* **ROBLOX RPC** uses [Bloxlink Verification](https://blox.link) through Discord to find out the account you're verified with and will utilise the ROBLOX API to find the games you're in.

---

## How to use
1. Make sure to follow [RobloxDiscRPC](https://www.roblox.com/users/2485537594/profile) on ROBLOX and set your `Who can join me?` privacy settings to `Friends and Users I Follow`.
2. Verify using [Bloxlink](https://blox.link) with the account used to follow above ^.
3. Make sure Discord is open before running the application.

## Installation of exe
1. Download the latest [release](https://github.com/ItzBlinkzy/roblox-rpc/releases) here.
2. Follow the basic setup instructions.

    <img src="https://user-images.githubusercontent.com/68260779/208254672-14fc90c1-50be-4136-81c2-78524a78ba3b.png" alt="installation" width="450"/>
3. Run **roblox-rpc.exe**.  *(refer to the FAQ section to confirm the application is running)*

## Running application locally
***If you do not want to download the exe file, you can run this application locally.*** 
Much more effort needed however.

* **Prerequisites**
    * Latest version of NodeJS installed. 
    * A code editor, e.g Visual Studio Code.
    * Competent knowledge of NodeJS.
1. Download the repository, either by using `git clone https://github.com/ItzBlinkzy/roblox-rpc.git` command in the terminal or the download zip button.

    <img src="https://user-images.githubusercontent.com/68260779/208813278-614345f6-b3e7-4c23-9ff8-6d255eda9ef5.png"
 alt="installation" width="200"/>
2. Because this is an electron application you must install **electron** with npm by running this command in the terminal. `npm install electron -g`. This will allow you to run electron from the terminal.

3. You will have to add a `config.json` file in the root of the folder. This file includes the following.
```{
    "apiKey": "API-KEY-HERE",
    "clientId": "1018245597465157742",
    "cookie": "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_A29UI34..............."
}
```

 *  The `apiKey` comes from [Bloxlink](https://blox.link) you will have to go to their website and get one.
 *  The `clientId` is my Discord Application ID, you can make one yourself and replace if wanted, but there is no need.
 * The `cookie` comes from a new account. You will have to create this account in an **incognito window** because logging out in a normal window will stop the cookie from working. Take the .ROBLOSECURITY Cookie and place it here **(REMEMBER THE NAME OF THIS ACCOUNT!)**. Once done you may close the incognito window. *(Don't log out of the account)*
4. You will need to follow the account you just created with your main ROBLOX account and then set the privacy settings to `Friends and Users I Follow`.
5. Go back to your editor and run `npm install` to get all the packages that are required.
6. Run the program using `electron src/index.js`. Make sure you are in the correct path.


## FAQ
* ***How do I know it's running?***
    * It should appear as an icon (in your system tray) at the right side of your taskbar.
    
    <img src="https://user-images.githubusercontent.com/68260779/208254798-7b04920f-44a3-49fc-a676-f67293c3ae33.png"
 alt="installation" width="150"/>
    
    
* ***What account am I verified with?***
    * When you click the system tray icon, the relevant information will be shown.
    Clicking these will display a notification that shows the ROBLOX Username and Discord Tag being tracked.
    
    <img src="https://user-images.githubusercontent.com/68260779/208254818-63a48193-8f71-4d26-917b-dc70a7d41c8f.png" alt="installation" width="150"/>
    
* ***Can I use this on MacOS?***
    * Currently this has only been tested on Windows. Downloading this on MacOS might have many bugs.

## Issues
Feel free to open an issue or make a pull request if you have any problems using this.

## Credits
 * [ItzBlinkzy](https://github.com/ItzBlinkzy/)
      * You can be here too if you'd like to contribute.
        


## License
MIT License
