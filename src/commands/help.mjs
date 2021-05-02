import { MessageEmbed } from "discord.js";
import utils from "../utils.mjs";

export default {
    name: "help",
    aliases: ["commands", "cmds", "cmd"],
    usage: "[name]",
    permission: [],
    run({ bot, msg, args, prefix }) {
        const embed = new MessageEmbed();
        embed.setTitle(`${utils.emojis.help} | Help`);

        if (!args[0]) {
            const cmds = bot.commands.all();

            embed.addField(
                "All commands",
                cmds.map((x) => `\`${x.name}\``).join(", ")
            );

            embed.setDescription(
                `Use \`${prefix}${this.name} ${this.usage}\` to view detailed information about the command!`
            );
        } else {
            const cmd = bot.commands.resolve(args[0]);
            if (!cmd)
                return msg.reply(
                    `${utils.emojis.danger} | Unknown command name/alias: \`${args[0]}\`!`
                );

            embed.addField(
                "Invokers",
                [cmd.name, ...cmd.aliases].map((x) => `\`${x}\``).join(", ")
            );

            embed.addField(
                "Usage",
                `\`\`\`xl\n${prefix}${cmd.name} ${cmd.usage || ""}\`\`\``
            );

            embed.addField(
                "Required permissions",
                cmd.permission.map((x) => `\`${x}\``).join(", ")
            );
        }

        embed.setTimestamp();
        embed.setColor("RANDOM");
        embed.setFooter("<> - Required | [] - Optional");

        msg.reply({
            embed,
        });
    },
};
