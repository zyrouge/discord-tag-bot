import path from "path";
import url from "url";
import dotenv from "dotenv";
import discord from "discord.js";
import Bot from "./base/bot.mjs";
import utils from "./utils.mjs";

const start = async () => {
    dotenv.config();

    const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
    const bot = new Bot({
        client: {
            intents: [
                discord.Intents.FLAGS.GUILDS,
                discord.Intents.FLAGS.GUILD_MESSAGES,
            ],
        },
        tags: {
            path: path.join(__dirname, "..", "data", "tags.db"),
            name: "tags",
        },
    });

    await bot.commands.dir(path.join(__dirname, "commands"));

    bot.on("ready", () => {
        console.log(`Bot logged in as ${bot.user.tag}!`);
    });

    bot.on("message", (msg) => {
        if (msg.author.bot || !msg.guild) return;

        const prefix = process.env.PREFIX;
        if (!prefix || !msg.content.startsWith(prefix)) return;

        const content = msg.content.slice(prefix.length);
        const [cmdName, ...args] = content.split(" ");

        const command = bot.commands.resolve(cmdName);
        if (command) {
            const customPerms = ["BOT_OWNER"];
            const defPerms = command.permission.filter(
                (x) => !customPerms.includes(x)
            );

            const owners = process.env.OWNERS.split(",").map((x) => x.trim());
            if (
                command.permission.includes("BOT_OWNER") &&
                !owners.includes(msg.author.id)
            )
                return msg.reply(
                    `${utils.emojis.danger} | Missing permission: \`BOT_OWNER\`!`
                );

            const allPerms = Object.keys(discord.Permissions.FLAGS);
            const unknownPerms = defPerms.filter((x) => !allPerms.includes(x));
            if (unknownPerms.length)
                return msg.reply(
                    `${
                        utils.emojis.danger
                    } | Unknown required permission(s): ${unknownPerms
                        .map((x) => `\`${x}\``)
                        .join(", ")}!`
                );

            const missingPerms = command.permission.filter(
                (x) => !msg.member.permissions.has(x)
            );
            if (missingPerms.length)
                return msg.reply(
                    `${
                        utils.emojis.danger
                    } | Missing required permission(s): ${missingPerms
                        .map((x) => `\`${x}\``)
                        .join(", ")}!`
                );

            try {
                return command.run({
                    bot,
                    msg,
                    prefix,
                    args,
                });
            } catch (err) {
                return msg.reply(`Something went wrong! (\`${err}\`)`);
            }
        }

        const tag = bot.tags.get(cmdName);
        if (tag) {
            msg.channel.send(tag.content);
            bot.tags.inc(tag.key);
            return;
        }
    });

    if (!process.env.TOKEN) throw new Error("Missing 'process.env.TOKEN'");
    bot.login(process.env.TOKEN);
};

start();
