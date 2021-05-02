import Database from "./database.mjs";

export default class TagManager extends Database {
    constructor(options) {
        options.schema = {
            key: {
                type: "text",
                constraints: ["NOT NULL", "PRIMARY KEY"],
            },
            content: {
                type: "text",
                constraints: ["NOT NULL"],
            },
            uses: {
                type: "numeric",
                constraints: ["DEFAULT 0"],
            },
        };

        super(options);

        this.prepare();
    }

    get(key) {
        const res = this.sql
            .prepare(`SELECT * FROM ${this.name} WHERE key = ?`)
            .get(key);

        return res;
    }

    set(key, content) {
        const res = this.sql
            .prepare(
                `INSERT OR REPLACE INTO ${this.name} (key, content) VALUES (?, ?)`
            )
            .run(key, content);

        return { ...res, key, content };
    }

    remove(key) {
        const res = this.sql
            .prepare(`DELETE FROM ${this.name} WHERE key = ?`)
            .run(key);

        return res;
    }

    inc(key) {
        const res = this.sql
            .prepare(`UPDATE ${this.name} SET uses = uses + 1 WHERE key = ?`)
            .run(key);

        return res;
    }

    all() {
        const res = this.sql
            .prepare(`SELECT key, uses FROM ${this.name}`)
            .all();

        return res;
    }
}
