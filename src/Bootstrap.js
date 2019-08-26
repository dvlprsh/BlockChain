const fetch = require('node-fetch');

class Bootstrap {
    constructor(url) {
        this.url = url;
    }
    fetch = async () => {
        // TODO: https://www.npmjs.com/package/node-fetch

        const res = await fetch(this.url);
        const json = await res.json();
        return json;
    };
}
module.exports = Bootstrap;