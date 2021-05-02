import utils from "../utils.mjs";

export default {
    name: "createtag",
    aliases: ["ctag", "edittag", "etag", "updatetag", "utag"],
    usage: "<name> <content/new content>",
    permission: ["MANAGE_MESSAGES"],
    run({ bot, msg, args }) {
        const [name, ...content] = args;
        if (!name)
            return msg.reply(
                `${utils.emojis.danger} | Missing parameter: \`name\`!`
            );
        if (!content.length)
            return msg.reply(
                `${utils.emojis.danger} | Missing parameter: \`content\`!`
            );

        const tag = bot.tags.set(name, content.join(" "));
        msg.reply(`${utils.emojis.success} | Created tag: \`${tag.key}\`!`);
    },
};
