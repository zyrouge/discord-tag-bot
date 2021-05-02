import util from "util";
import utils from "../utils.mjs";

export default {
    name: "eval",
    aliases: ["ev"],
    usage: "<code>",
    permission: ["BOT_OWNER"],
    async run({ msg, args }) {
        try {
            const respTags = [];
            let evaled = eval(args.join(" "));
            if (evaled && evaled.then && typeof evaled.then === "function") {
                evaled = await evaled;
                respTags.push("Resolved");
            }
            if (typeof evaled !== "string") evaled = util.inspect(evaled);
            evaled = utils.functions.clean(evaled);
            msg.reply(
                `${utils.emojis.success} | **Success** ${respTags
                    .map((x) => `(${x})`)
                    .join(" ")}\n\`\`\`xl\n${utils.functions.shorten(
                    evaled,
                    1900
                )}\`\`\``
            );
        } catch (err) {
            msg.reply(
                `${
                    utils.emojis.danger
                } | **Error**\n\`\`\`xl\n${utils.functions.shorten(
                    err.toString(),
                    1000
                )}\`\`\``
            );
        }
    },
};
