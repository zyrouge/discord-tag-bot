import path from "path";
import url from "url";
import { promises as fs } from "fs";
import { Client } from "discord.js";
import TagManager from "./tags.mjs";

export class CommandsManager {
    constructor() {
        this.commands = new Map();
        this.aliases = new Map();
    }

    async dir(dir) {
        const files = await fs.readdir(dir);

        for (const file of files) {
            this.load(path.join(dir, file));
        }
    }

    async load(dir) {
        const cmd =
            typeof dir === "string"
                ? (await import(url.pathToFileURL(dir))).default
                : dir;

        if (this.commands.has(cmd.name))
            throw new Error(`Duplicate command name "${cmd.name}"`);
        this.commands.set(cmd.name, cmd);

        cmd.aliases.forEach((alias) => {
            if (this.aliases.has(alias))
                throw new Error(`Duplicate command alias "${alias}"`);
            this.aliases.set(alias, cmd.name);
        });

        console.log(`Loaded command: ${cmd.name}`);
    }

    async unload(dir) {
        const cmd = typeof dir === "string" ? await import(dir) : dir;

        this.commands.delete(cmd.name);

        cmd.aliases.forEach((alias) => {
            this.aliases.delete(alias);
        });

        console.log(`Unloaded command: ${cmd.name}`);
    }

    resolve(key) {
        const alias = this.aliases.get(key);
        return this.commands.get(alias || key);
    }

    all() {
        return [...this.commands.values()];
    }
}

export default class Bot extends Client {
    constructor(options = {}) {
        super(options.client);

        this.tags = new TagManager(options.tags);
        this.commands = new CommandsManager();
    }
}
