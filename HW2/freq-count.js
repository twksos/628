function freqCount(str) {
    const freqResult = str.replace(/ /g, '').split('').reduce((r, c) => {
        const currentCount = r[c];
        r[c] = currentCount ? currentCount + 1 : 1;
        return r;
    }, {});
    const keys = Object.keys(freqResult);
    return keys.map((key) => ({key, count: freqResult[key]})).sort((a, b) => a.count - b.count);
}

module.exports = {freqCount};