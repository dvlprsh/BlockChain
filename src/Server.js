const http = require("http");
const WebSocketServer = require("websocket").server;
const NodeRSA = require("node-rsa");
const utils = require("./utils");
class Server {
    // TODO
    //리스너 등록
    constructor() {

        this.listeners={};

    }

    on=(type, listener)=>{
        this.listeners[type]=listener;
    }


    //리스너 등록

    start = () => {
        // TODO
        const httpServer = http.createServer((request, response) => {
            utils.log("Server", request.url);
            response.writeHead(404); //이쪽은 호출될 일이 없어야 함
            response.end(); //이쪽은 호출될 일이 없어야 함
        });
        httpServer.listen(43210, () => {
            utils.log("Server", "Listening on port 43210");
        });
        this.webSocket = new WebSocketServer({
            httpServer: httpServer,
            autoAcceptConnections: false
        });
        this.webSocket.on("request", this._onRequest);
    };

    sendMessage = (connection, type, value) => {
        if (connection && connection.connected) {
            const data = {
                type: type,
                value: value
            };
            connection.sendUTF(JSON.stringify(data));
            utils.log("Server", "Sent: " + JSON.stringify(data) + " to " +
                connection.remoteAddress);
        }
    };

    _onRequest = request => {
        // TODO
        const connection = request.accept("dnext-chain", request.origin);
        utils.log("Server", "Connection accepted (" + request.remoteAddress + ")");
        connection.on("message", message => this._onMessage(connection, message));
        connection.on("close", this._onClose);

    };
    /*
    _onMessage = message => {
        // TODO
        const data = JSON.parse(message.utf8Data);
        utils.log("Server", "Received: " + data);
    };*/

/*
    _onMessage = message => {
        const data = JSON.parse(message.utf8Data);
        utils.log("Server", "Received: " + this._decrypt(data));
    };
    _decrypt = data => {
        const key = new NodeRSA();
        const publicKey = Buffer.from(data.publicKey, "hex");
        key.importKey(publicKey, "pkcs8-public-der");
        return key.decryptPublic(Buffer.from(data.cipher, "hex")).toString("utf8");
    };
*/

    _onMessage = (connection, message) => {
        const data = JSON.parse(message.utf8Data);
        utils.log("Server", "Received: " + message.utf8Data);
        if (this.listeners[data.type]) {
            this.listeners[data.type](connection, data.value);
        }
    };

    _verify = data => {
        const key = new NodeRSA();
        const publicKey = Buffer.from(data.publicKey, "hex");
        key.importKey(publicKey, "pkcs8-public-der");

        // TODO
        /*key.verify(buffer, signature, [source_encoding], [signature_encoding])*/
        //const decrypted=key.decryptPublic(Buffer.from(data.cipher, "hex")).toString("utf8");

        //const isValid=key.verify(Buffer.from(data.plain, "hex"), data.signature);
        const isValid=key.verify(Buffer.from(data.plain, "utf8"), Buffer.from(data.signature, "hex"));
        //Client.js 에서 시그니처를 보낼 때 16진수(hex)로 했으므로 검증할 때도 hex로 한다
        return isValid;

    };


    _onClose = connection => {
        // TODO
        utils.log("Server", "Disconnected (" + connection.remoteAddress + ")");
    };
}

module.exports = Server;