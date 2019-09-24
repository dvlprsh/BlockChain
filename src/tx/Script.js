class Script {
    static OP_DUP = "76";
    static OP_HASH160 = "a9";
    static OP_EQUALVERIFY = "88";
    static OP_CHECKSIG = "ac";

    static OP_RETURN="6a"

    static from(object) {
        return new Script(object.values);
    }

    constructor(values = []) {
        this.values = values;
    }

    toHex() {
        let data = "";
        for (const value of this.values) {
            data += value;
        }
        return data;
    }
}

module.exports = Script;