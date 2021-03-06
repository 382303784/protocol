// Attempts to execute a promise and returns false if no error is thrown,
// or an Array of the error messages
async function didContractThrow(promise) {
  try {
    await promise;
  } catch (error) {
    return error.message.match(/[invalid opcode|out of gas|revert]/, "Expected throw, got '" + error + "' instead");
  }
  return false;
}

async function minePendingTransactions(web3, time) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "evm_mine",
        params: [time],
        id: new Date().getTime()
      },
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

async function stopMining(web3) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "miner_stop",
        params: [],
        id: new Date().getTime()
      },
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

async function startMining(web3) {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "miner_start",
        params: [],
        id: new Date().getTime()
      },
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

// This function will mine all transactions in `transactions` in the same block with block timestamp `time`.
// The return value is an array of receipts corresponding to the transactions.
// Each transaction in transactions should be a web3 transaction generated like:
// let transaction = truffleContract.contract.methods.myMethodName(arg1, arg2);
// or if already using a web3 contract object:
// let transaction = web3Contract.methods.myMethodName(arg1, arg2);
async function mineTransactionsAtTime(web3, transactions, time, sender) {
  await stopMining(web3);

  const receiptPromises = [];
  for (const transaction of transactions) {
    const result = transaction.send({ from: sender });

    // Awaits the transactionHash, which signifies the transaction was sent, but not necessarily mined.
    await new Promise((resolve, reject) => {
      result.on("transactionHash", function() {
        resolve();
      });
    });

    // result, itself, is a promise that will resolve to the receipt.
    receiptPromises.push(result);
  }

  await minePendingTransactions(web3, time);
  const receipts = await Promise.all(receiptPromises);
  await startMining(web3);

  return receipts;
}

module.exports = {
  didContractThrow,
  mineTransactionsAtTime
};
