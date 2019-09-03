const {isMainThread, workerData, parentPort} = require('worker_threads');
const Block = require("./Block");

//백그라운드 스레드에서만 실행한다
if (!isMainThread) {
    const blocks = workerData.blocks;
    let lastBlock = Block.from(blocks[blocks.length - 1]);
    while (true) {
        //논스가 비어있는 헤더
        const newBlock = new Block(lastBlock.hash(),
            "0000000000000000000000000000000000000000000000000000000000000000", //머클트리
            lastBlock.difficulty, Math.floor(new Date().getTime() / 1000));
        //-------------------------------
        newBlock.nonce = newBlock.pow();
        parentPort.postMessage(newBlock); //parentPort--부모 쓰레드
        lastBlock = newBlock;
    }
}