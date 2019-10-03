const readlineSync = require('readline-sync');
const {isMainThread, parentPort} = require('worker_threads');
if (!isMainThread) {
    process.stdin.isTTY = process.stdout.isTTY = true;
    while (true) {
        const action = readlineSync.question("Select action (1.MyBalance, 2. Send Transaction): \n");
        if (action === "1") {
            //parentPort--워커스레드를 발생시킨 부모 스레드
            parentPort.postMessage({
                action: "getBalance"
            });
        } else if (action === "2") {
            const amount = Number(readlineSync.question("Amount:"));
            const to = readlineSync.question("To: ");
            parentPort.postMessage({
                action: "sendTransaction",
                amount: amount,
                to: to
            });
        }
    }
}