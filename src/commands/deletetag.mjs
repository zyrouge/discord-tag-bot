import utils from "../utils.mjs";

export default {
    name: "deletetag",
    aliases: ["dtag", "rmtag", "removetag"],
    usage: "<name>",
    permission: ["MANAGE_MESSAGES"],
    run({ bot, msg, args }) {
        const name = args[0];
        if (!name)
            return msg.reply(
                `${utils.emojis.danger} | Missing parameter: \`name\`!`
            );

        const { changes: deleted } = bot.tags.remove(name);
        if (!deleted)
            return msg.reply(
                `${utils.emojis.danger} | Unknown tag invoker: \`${name}\`!`
            );

        msg.reply(`${utils.emojis.success} | Deleted tag: \`${name}\`!`);
    },
};
