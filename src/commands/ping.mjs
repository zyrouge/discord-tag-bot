import utils from "../utils.mjs";

export default {
    name: "ping",
    aliases: ["pong", "test"],
    usage: "",
    permission: [],
    run({ bot, msg }) {
        msg.channel.send(
            `${utils.emojis.pong} | Pong! It took **${bot.ws.ping}ms**!`
        );
    },
};
