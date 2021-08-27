class Command {
    constructor(name, description, func) {
        this.name = name;
        this.description = description;
        this.function = func;
    }
    register(client){
        console.log("Registered ?" + this.name + " Command");
        client.on("messageCreate", (msg) => {
            if(msg.author.bot) return;
            const args = msg.content.split(" ");
            if(args[0] === `?${this.name}`){
                this.function(msg, args.slice(1));
            }
        });
    }
}

module.exports = Command;