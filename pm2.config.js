module.exports = {
    apps: [{
        name: "easyrepay",
        script: "src/index.js",
        watch: true,
        watch_delay: 15000,
        ignore_watch: [
            "node_modules",
        ],
    }]
}
