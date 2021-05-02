import { MessageEmbed } from "discord.js";
import utils from "../utils.mjs";

export default {
    name: "tag",
    aliases: ["tags"],
    usage: "[name]",
    permission: [],
    run({ bot, msg, args }) {
        if (!args.length) {
            const tags = bot.tags.all();
            return msg.reply(
                tags
                    .map((x, i) => `${i + 1}) ${x.key} [${x.uses} uses]`)
                    .join("\n"),
                {
                    split: true,
                    code: "xl",
                }
            );
        }

        const tag = bot.tags.get(args[0]);
        if (!tag)
            return msg.reply(
                `${utils.emojis.danger} | Unknown tag invoker: \`${args[0]}\`!`
            );

        const embed = new MessageEmbed();
        embed.addField("Invoker", `\`${tag.key}\``);
        embed.addField("Response", `\`\`\`xl\n${tag.content}\`\`\``);
        embed.setTimestamp();
        embed.setColor("RANDOM");

        msg.reply({
            embed,
        });
    },
};
