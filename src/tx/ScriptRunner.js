const Script = require("./Script");
const Hashes = require("jshashes");
const NodeRSA = require("node-rsa");
const PUB_KEY_original="30820222300d06092a864886f70d01010105000382020f003082020a02820201008d950b0dad01201770100822d3818df31bfaf72431383819195849bf054c6621c3b7a0cb73485fa399f7f47527f2c6064259a9e9f0c4f468635e7a3feef6ad53ebfa9009a3c249f9ccdd54d4354ac9ecef31a2b31bdb0ffe3b74560f5fc93a99e2f65d8ff40e684033c99add375eac413db08414b3ec7f187107b3e9a3cd448b0bdf804af62774fdff315bcc254c3520271e54ed66fe252acb73f09c5bf07788509731bee0f8e26ae33a6f9997dbf0d70d8362f9578f95b0e1661751ecf93ad182cea27e2f3a70bc05fcc8af0253c50f8f5a756e120469da6eb9796dcc387fa3c760004e3a33e6905d44aa7012cc0f38177263397030282359745445da91ac5381d8c13b03c52493d9b9205c80ace92565e2610d515a2d2ef9299ccbec3230f00b19ef89d241c52d25b0ec86acc1bbe4a63a158d6534446e8277a3fb1cece6c3503dfc74442ea2ca5bc30a895eedbe12a2be1e567e25256ff6b522b33f214507e4fffcc4f98ed2389ce0690a1b4b63e006067384f64ed6ec203ce347183c3286d531de7d26848fb747a91ee0d82bce4698a9f67b9b88cdd8a0f818060d66acbd970b594e078b91d8842edfa3590493b8b9593f5e1e32d76c82d6b7e1fe36e733431def8c97418b9244c0e8e77d040298d8a95820e5cbb234f647d4c95ec3286e104e50f52cc8b1407ae6cb7251d189ebd1fd104b606570907808a244a988da9d0203010001";

class ScriptRunner {
    constructor(output, input, inputTx) {
        this.script = input.script.values.concat(output.script.values);
        this.inputTx = inputTx;
        for (const input of this.inputTx.inputs) {
            input.script = new Script();
        }
        this.stack = [];
    }

    run() {
        for (let i = 0; i < this.script.length; i++) {
            const value = this.script[i];
            let success = true;
            if (value === Script.OP_DUP) {
                success = this.op_dup();
            } else if (value === Script.OP_HASH160) {
                success = this.op_hash160();
            } else if (value === Script.OP_EQUALVERIFY) {
                success = this.op_equalverify();
            } else if (value === Script.OP_CHECKSIG) {
                success = this.op_checksig();
            } else if (value === Script.OP_RETURN) {
                if (i + 2 <= this.script.length) {
                    success = this.op_return(this.script[i + 1], this.script[i + 2]);
                    i = i + 2;
                } else {
                    return false;
                }
            } else {
                this.stack.push(value);
            }
            if (!success) {
                return false;
            }
        }
        if (this.stack.length === 1) {
            return Number(this.stack.pop()) === 1;
        } else {
            return false;
        }
    }

    op_dup() {
        if (this.stack.length >= 1) {
            const top = this.stack[this.stack.length - 1];
            this.stack.push(top);
            return true;
        } else {
            return false;
        }
    }

    op_hash160() {
        if (this.stack.length >= 1) {
            const top = this.stack.pop();
            const pubkeyHash = new Hashes.RMD160().hex(new Hashes.SHA256().hex(top));
            this.stack.push(pubkeyHash);
            return true;
        } else {
            return false;
        }
    }

    op_equalverify() {
        if (this.stack.length >= 2) {
            const top2 = this.stack.pop();
            const top1 = this.stack.pop();
            return top2 === top1;
        } else {
            return false;
        }
    }

    op_checksig() {
        if (this.stack.length >= 2) {
            const key = new NodeRSA();
            const publicKey = this.stack.pop();
            const signature = this.stack.pop();
            key.importKey(Buffer.from(publicKey, "hex"), "pkcs8-public-der");
            const rawTransaction = this.inputTx.toHex();
            const valid = key.verify(Buffer.from(rawTransaction, "hex"), Buffer.from(signature, "hex"));
            if (valid) {
                this.stack.push("01");
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    op_return(byteLength, data) {
        return data % 2 === 0 && data.length / 2 === parseInt(byteLength, 16);
    }
}

module.exports = ScriptRunner;
