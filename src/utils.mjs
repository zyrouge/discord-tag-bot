export default {
    emojis: {
        success: "👍",
        danger: "⚠️",
        help: "📃",
        pong: "🏓",
    },
    functions: {
        clean: (text) =>
            text
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203)),
        shorten: (text, length, dots = true) =>
            text.length > length
                ? text.slice(0, length - 3) + (dots ? "..." : "")
                : text,
    },
};
