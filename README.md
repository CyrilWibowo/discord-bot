# discord-bot (WIP)
Invite a work-in-progres, experimental discord-bot that dynamically creates, deletes and edits (WIP) user created commands. Have fun with other commands or just create your own. Note that this bot is in ongoing development and is subject to change, refinement and enhancement. Also note that this was only created as an educational learning experience and a fun project. This was not intended to be used for more serious/high profile servers.

## **Getting Started:** <a name="Getting-Started"></a>
1) Head over to [Discord Developer Portal](https://discord.com/developers/docs/intro) and create a new application in the website's **Application** tab. This requires you to be logged into you're discord account.
   
![Alt Text](https://cdn.discordapp.com/attachments/1046350822423928884/1183970495176122389/image.png?ex=658a4573&is=6577d073&hm=84b145fe11a5e83094912a302695bb428ddeee7a853e1af2085f6f9178eaeca5&)



2) If you are going to further develop this bot privately it may be required that certain privileged gateway intents be enabled/disabled. Head over to your bot's **Bot** tab and scroll down until **Privileged Gateway Intents**. You can read [here](https://discord.com/developers/docs/topics/gateway) to determine what is required for your bot. For the provided repository only **MESSAGE CONTENT INTENT** is required to be enabled.

![Alt Text](https://i.imgur.com/0bytSje.png)



3) Go to the **OAuth2** drop down menu under settings and navigate to **URL Generator**. Select **applications.commands** and **bot** as the scopes and select any permissions you want your bot to have. Note: be aware of what you're bot can and can not do as well as the permissions of members in your server. The following image is only an example. Copy the URL at the bottom and follow the required steps to invite your bot to your server

![Alt Text](https://cdn.discordapp.com/attachments/1046350822423928884/1183976080466518128/Screenshot_2023-12-12_143743.png?ex=658a4aa6&is=6577d5a6&hm=cc13499690f596231b3ede8d84f2057d2896ec46138dbb33fc08003cb1e2850b&)
![Alt Text](https://cdn.discordapp.com/attachments/1046350822423928884/1183976144362545192/Screenshot_2023-12-12_143807.png?ex=658a4ab6&is=6577d5b6&hm=98a71fc79e46ec5d6a119ef8d8b198f0491b4e9700a30526ff4178f9e937a36e&)



4) Download this repository and save it somewhere on your computer

5) Find the config.json file in the repository and edit the **"token", "clientId" and "guildId"**. Your token can be found in your [Discord Developer Portal](https://discord.com/developers/docs/intro) under the **Bot** tab **(DO NOT SHARE YOUR DISCORD TOKEN WITH ANYONE)**, your clientId can be found in the **General Information Tab** named **APPLICATION ID** and you're guildId is just the ID for your server. Enable developer mode on discord and right click on you're server's name and **Copy Server ID**. Insert all this information into you're config.json.



6) Run the following command in your directory to download all dependencies: ```npm install```




7) Run the following command in your directory to register all slash commands ```node deploy-commands.js```





## **Running the Bot**
After following all steps from **[Getting Started](#Getting-Started)**, run ```node.``` in your repository. Your bot should be online and able to take in commands now. Have fun!
