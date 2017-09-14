const {mod} = require('./mod');
const {freqCount} = require('./freq-count');
const {genInvMul} = require('./mulModN');
const A_CODE = 'A'.charCodeAt(0);

const INV_MOD_26 = genInvMul(26).invmul;

function solveAffineVariable(pv, cv) {
    const pvSeq = pv.map((x) => x.charCodeAt(0) - A_CODE);
    const cvSeq = cv.map((x) => x.charCodeAt(0) - A_CODE);

    // mod(a(p0-p1), 26) = mod(c0-c1, 26)

    const dp = mod(pvSeq[0] - pvSeq[1], 26);
    const dc = mod(cvSeq[0] - cvSeq[1], 26);

    const possibleVariables = Object.keys(INV_MOD_26).map((possibleA) => {
        if (mod(dp * possibleA, 26) !== dc) return null;

        // b = mod(c - a * p, 26)

        const shift0 = mod(cvSeq[0] - pvSeq[0] * possibleA, 26);
        const shift1 = mod(cvSeq[1] - pvSeq[1] * possibleA, 26);
        if (shift0 !== shift1) return null;
        return {a: possibleA, b: shift0};
    }).filter(x => !!x);
    if (possibleVariables.length > 0) {
        return possibleVariables;
    }
    return null;
}

function encAffine(pstr, a, b) {
    const parr = pstr.replace(/ /g, '').split('');
    return parr.map((p) => {
        const pSeq = p.charCodeAt(0) - A_CODE;
        const cSeq = mod((pSeq) * a + b, 26);
        return String.fromCharCode(cSeq + A_CODE);
    }).join('');
}

function decAffine(cstr, a, b) {
    const carr = cstr.replace(/ /g, '').split('');
    return carr.map((c) => {
        const cSeq = c.charCodeAt(0) - A_CODE;
        const pSeq = mod((cSeq - b) * INV_MOD_26[a], 26);
        return String.fromCharCode(pSeq + A_CODE);
    }).join('');
}

function solveAffine(cstr, pv, cv) {
    const variables = solveAffineVariable(pv, cv);
    if (!variables) return null;
    return variables.map((variable) => {
        const pstr = decAffine(cstr, variable.a, variable.b);
        return {pv, cv, variable, plainText: pstr}
    });
}

function solveProblem2() {
    const problem2cipherText = 'FPFKR NEHAF LJHZH KRPHY EVURH HDVSF MHAFL JYRVY MR';
    const problem2FreqCount = freqCount(problem2cipherText);
    console.log(problem2FreqCount);

    const highFreq = ['E', 'T', 'A', 'O', 'N', 'I', 'S'];
    let results = [];
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            if (j == i) continue;
            const firstP = highFreq[i];
            const secondP = highFreq[j];
            const firstC = 'R';
            const secondC = 'F';
            const problem2Result = solveAffine(
                problem2cipherText,
                [firstP, secondP],
                [firstC, secondC]
            );
            if (problem2Result) results = results.concat(problem2Result);
        }
    }
    console.log(results);
}
solveProblem2();

function test(a, b) {
    const cipherText = encAffine('AMATEURSHACKSYSTEMSPROFESSIONALSHACKPEOPLE', a, b);
    const correct = cipherText == 'FPFKR NEHAF LJHZH ' +
        'KRPHY EVURH HDVSF MHAFL JYRVY MR'.replace(/ /g, '');
    if (!correct) throw new Error('Test fails');
    console.log('correct');
}

test(3, 5);

