<img src="https://user-images.githubusercontent.com/68260779/208254746-0055f6a3-2510-426c-b5c2-b3b6ad85715e.png" alt="logo" width="125"/>

# ROBLOX RPC

**ROBLOX RPC** integrates Discord Rich Presence with the ROBLOX API to find the current game on ROBLOX you're playing.

![example](https://user-images.githubusercontent.com/68260779/208254688-ddc0bd8b-c458-4185-ba3b-d8b0b56d72e1.png)
![example2](https://user-images.githubusercontent.com/68260779/208254692-c8b0188e-747e-46da-96c1-07e226250557.png)


### This is an alternative to [ro-presence](https://github.com/JiveOff/roPresence).
* ***Why?*** Because ro-presence goes overboard by reading from your [registry](https://github.com/JiveOff/roPresence/blob/master/lib/bloxauth.js) to retrieve your `.ROBLOSECURITY` cookie in order to function.


### How ROBLOX RPC does it.
* **ROBLOX RPC** uses [Bloxlink Verification](https://blox.link) through Discord to find out the account you're verified with and will utilise the ROBLOX API to find the games you're in.

---

## How to use
1. Make sure to follow [RobloxDiscRPC](https://www.roblox.com/users/2485537594/profile) on ROBLOX and set your `Who can join me?` privacy settings to `Friends and Users I Follow`.
2. Verify using [Bloxlink](https://blox.link) with the account used to follow above ^.
3. Make sure Discord is open.

## Installation
1. Download the latest [release](https://github.com/ItzBlinkzy/roblox-rpc/releases) here.
2. Follow the basic setup instructions.

    <img src="https://user-images.githubusercontent.com/68260779/208254672-14fc90c1-50be-4136-81c2-78524a78ba3b.png" alt="installation" width="450"/>
3. Run **roblox-rpc.exe**

# FAQ
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
