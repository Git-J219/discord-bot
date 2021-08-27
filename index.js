const Discord = require("discord.js");
const Command = require("./command.js");
const { readdirSync } = require("fs");
require("dotenv").config();

const client = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILDS]});

const commands = [];

(() => {
    const commandFiles = readdirSync("./commands");
    for (let i = 0; i < commandFiles.length; i++) {
        commands.push(require("./commands/" + commandFiles[i]));
    }
})();

const noHelpCommands = [
    new Command("help", "", (msg) => {
        msg.channel.sendTyping();
        setTimeout(() => {
            if(commands[0]){
                const disableButton = new Discord.MessageButton()
                    .setCustomId(`help::${(commands[3] ? 1 : "disable")}::next`)
                    .setEmoji("➡️")
                    .setStyle("SUCCESS");
                if(!commands[3]) disableButton.setDisabled();
                const messageRow = new Discord.MessageActionRow().addComponents(
                    new Discord.MessageButton()
                        .setCustomId("help::disable::back")
                        .setEmoji("⬅️")
                        .setStyle("SUCCESS")
                        .setDisabled(),
                        disableButton
                );
                msg.channel.send({components: [messageRow], embeds: [getEmbedByCode("help", 0)]});
            } else {
                const embed = new Discord.MessageEmbed();
                embed.addField("Fehler", "Es gibt keine Befehle...");
                msg.channel.send({embeds: [embed]});
            }
            msg.delete();
        }, 250);
    })
]

function getEmbedByCode(id, page){
    switch (id) {
        case "help":
            {
                const j = page * 3;
                const embed = new Discord.MessageEmbed();
                for (let i = 0; i < 3; i++) {
                    if(!commands[j+i]) break;
                    embed.addField(`?${commands[j+i].name}`, commands[j+i].description);
                }
                return embed;
            }
    
        default:
            throw new Error("Unknown ID");
    }
}

client.on("ready", () => console.log("Ready"));
client.on("interactionCreate", (interact) => {
    if(interact.isButton()){
        const args = interact.customId.split("::");
        if(args[1] == "disable") return;
        if(args[0] == "help"){
            if(!commands[args[1] * 3]) return;
            args[1] = parseInt(args[1]);
            const messageRow = new Discord.MessageActionRow();
            const nextButton = new Discord.MessageButton()
                .setCustomId(`help::${(commands[(args[1] * 3) + 3] ? args[1] + 1 : "disable")}::next`)
                .setEmoji("➡️")
                .setStyle("SUCCESS");
            if(!commands[(args[1] * 3) + 3]) nextButton.setDisabled();
            const backButton = new Discord.MessageButton()
                .setCustomId(`help::${(args[1] != 0 ? args[1] - 1 : "disable")}::back`)
                .setEmoji("⬅️")
                .setStyle("SUCCESS");
            if(args[1] == 0) backButton.setDisabled();
            messageRow.addComponents(backButton, nextButton);
            interact.update({components: [messageRow], embeds: [getEmbedByCode("help", args[1])]})
        }
    }
});

for (let i = 0; i < commands.length; i++) {
    commands[i].register(client);
}
for (let i = 0; i < noHelpCommands.length; i++) {
    noHelpCommands[i].register(client);
}

client.login(process.env.token);
