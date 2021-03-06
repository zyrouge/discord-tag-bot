import fs from "fs";
import path from "path";
import bsql from "better-sqlite3";

export function SchemaParser(schema = {}) {
    let keys = [];

    Object.entries(schema).forEach(([key, opts]) => {
        let type,
            constraints = [];

        if (typeof opts === "object") {
            type = opts.type;
            if (opts.constraints) constraints = opts.constraints;
        } else type = opts;

        let res = `${key} ${type}`;
        if (constraints.length) res += ` ${constraints.join(" ")}`;

        keys.push(res);
    });

    return keys.join(", ");
}

export default class Database {
    constructor(options = {}) {
        if (!options.path)
            throw new Error("Missing 'options.path' in 'Database'");
        this.path = options.path;

        const dir = path.dirname(this.path);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);

        if (!options.name)
            throw new Error("Missing 'options.name' in 'Database'");
        this.name = options.name;

        if (!options.schema)
            throw new Error("Missing 'options.schema' in 'Database'");
        this.schema = SchemaParser(options.schema);

        this.sql = new bsql(this.path, options.sql);
        this.ready = false;
    }

    prepare() {
        const initial = this.sql
            .prepare(
                "SELECT count(*) FROM sqlite_master WHERE type='table' AND name= ?;"
            )
            .get(this.name);

        if (!initial["count(*)"]) {
            this.sql
                .prepare(`CREATE TABLE ${this.name} (${this.schema});`)
                .run();

            this.sql.pragma("synchronous = 1");
            this.sql.pragma("journal_mode = WAL");
        }

        this.ready = true;
    }
}
