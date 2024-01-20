require('dotenv').config(); // 引入dotenv库以读取.env文件

const coinAmount = parseFloat(process.env.COIN_AMOUNT);
const coinPrice = parseFloat(process.env.COIN_PRICE);
const apr = parseFloat(process.env.APR);
const fee = parseFloat(process.env.FEE);

const principal = coinAmount * coinPrice; // 计算本金

const optimal = findOptimalFrequency(principal, apr, fee, coinPrice);
console.log(`最优复利频率为每年 ${optimal.frequency} 次，对应的年末总金额为 ${optimal.amount}，即每挖出 ${optimal.coinAmount} 个币复利一次，大约为 ${optimal.days} 天。`);

function findOptimalFrequency(principal, apr, fee, coinPrice) {
    let maxAmount = 0;
    let optimalFrequency = 0;

    for (let n = 1; n <= 365; n++) {
        const amount = compoundInterest(principal, apr, fee, n);
        if (amount > maxAmount) {
            maxAmount = amount;
            optimalFrequency = n;
        }
    }

    const coinAmount = (maxAmount - principal) / coinPrice / optimalFrequency;
    const days = 365 / optimalFrequency;

    return { frequency: optimalFrequency, amount: maxAmount, coinAmount, days };
}

function compoundInterest(principal, apr, fee, n) {
    const ratePerPeriod = apr / n;
    let amount = principal;

    for (let i = 0; i < n; i++) {
        amount = amount * (1 + ratePerPeriod) - fee;
    }

    return amount;
}