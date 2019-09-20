class MemPool {
    //메모리풀은 글로벌. 각각의 노드마다 가지고 있는것
    //현재 있는 체인의 블록 각각에 존재하는 트랜잭션들 모두 memPool에 들어감
    constructor() {
        this.txs = {};
        this.newTxHashes = [];
    }

    addTx(tx, newTx = false) {
        this.txs[tx.hash()] = tx;
        if (newTx) {
            this.newTxHashes.push(tx.hash());
        }
    }

    removeTx(txHash) {
        delete this.txs[txHash];
    }
    //getTxs() ----txs를 배열로 바꿔줌
    getTxs() {
        const txs = [];
        for (const txHash of Object.keys(this.txs)) {
            if (this.newTxHashes.includes(txHash)) {
                const tx = this.txs[txHash];
                txs.push(tx);
            }
        }
        return txs;
    }
}

module.exports = MemPool;