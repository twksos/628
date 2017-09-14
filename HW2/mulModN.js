const {mod} = require('./mod');

function genInvMul(num) {
    const invmul = {};
    const title = [''];
    for (let i = 1; i < num; i++) title.push(i);
    let table = [title];
    for (let i = 1; i < num; i++) {
        table[i] = [i];
        for (let j = 1; j < num; j++) {
            table[i][j] = mod(i * j, 26);
            if (table[i][j] == 1) invmul[i] = mod(j, 26);
        }
    }
    return {table, invmul};
}

module.exports = {genInvMul};