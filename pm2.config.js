module.exports = {
    apps: [
        {
            name: 'easyrepay',
            script: 'main.js',
            watch: true,
            watch_delay: 15000,
            exec_mode: 'cluster',
            instances: 2,
        },
    ],
};
