const {isMainThread, workerData, parentPort} = require('worker_threads');
const MerkleTree = require('@garbados/merkle-tree');
const Block = require("./Block");
const Tx = require("../tx/Tx");
//백그라운드 스레드에서만 실행한다
if (!isMainThread) {
    const blocks = workerData.blocks;
    let txs = workerData.txs;
    parentPort.on("message", newTxs => {
        txs = newTxs;
    });
    let lastBlock = Block.from(blocks[blocks.length - 1]);
    while (true) {
        const txData = []; //머클트리를 구성하기 위해 필요함
        for (const tx of txs) {
            txData.push(Tx.from(tx).toHex());
        }
        const merkleTree = new MerkleTree("sha256", txData);
        const newBlock = new Block(
            lastBlock.hash(),
            merkleTree.root, //현재는 머클루트만 있으면 된다.
            lastBlock.difficulty,
            Math.floor(new Date().getTime() / 1000),
            0,
            txs
        );
        newBlock.nonce = newBlock.pow();
        parentPort.postMessage(newBlock);//parentPort--부모 쓰레드
        lastBlock = newBlock;
    }

}