const Command = require("../command.js");

module.exports = new Command("ping", "Antwortet dir!", (msg, args) => {
    msg.channel.sendTyping();
    setTimeout(() => {
        msg.channel.send("Hallo <@" + msg.author.id + ">");
    }, 250);
});