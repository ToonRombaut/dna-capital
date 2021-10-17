const { createVuePlugin } = require('vite-plugin-vue2');
const { ViteAliases } = require("vite-aliases");

module.exports = {
    plugins: [
        createVuePlugin(),
        ViteAliases()
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
             @import "./src/assets/scss/_vars";
             @import "./src/assets/scss/_mixins";
             @import "./src/assets/scss/_text";
             `
            },
        },
    },
};