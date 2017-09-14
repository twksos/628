const {mod} = require('./mod');
const {freqCount} = require('./freq-count');
const A_CODE = 'A'.charCodeAt(0);

function solveShift(cstr, p, c) {
    //encrypt: mod(p + shift, 26) = c = mod(c, 26)
    //decrypt: mod(c - shift, 26) = p = mod(p, 26)

    //solve:   mod(shift, 26) = mod(c - p, 26)
    const shift = mod(c.charCodeAt(0) - p.charCodeAt(0), 26);
    const pstr = decShift(cstr, shift);
    return {key: shift, plainText: pstr};
}

function encShift(pstr, key) {
    return pstr.replace(/ /g, '').split('').map((x) => {
        return String.fromCharCode(mod((x.charCodeAt(0) - A_CODE + key), 26) + A_CODE)
    }).join('');
}

function decShift(cstr, key) {
    return cstr.replace(/ /g, '').split('').map((x) => {
        return String.fromCharCode(mod((x.charCodeAt(0) - A_CODE - key), 26) + A_CODE)
    }).join('');
}

function solveProblem1() {
    const problem1cipherText = 'XLCJS LOLWT EEWPV PJDSP VPAET ETYPD NCZHL ' +
        'YOPGP CJEST YRESL EXLCJ DLTOE SPQPO DHPCP DFCPE ZVYZH';
    const problem1FreqCount = freqCount(problem1cipherText);
    console.log(problem1FreqCount);

    const problem1Result = solveShift(problem1cipherText, 'E', 'P');
    console.log(problem1Result);
}

solveProblem1();

function test(key) {
    const cipherText = encShift('MARYHADALITTLEKEYSHEKEPTITINESCROWANDEVERYTHINGTHATMARYSAIDTHEFEDSWERESURETOKNOW', key);
    const correct = cipherText === 'XLCJS LOLWT EEWPV PJDSP VPAET ETYPD NCZHL YOPGP CJEST YRESL EXLCJ DLTOE SPQPO DHPCP DFCPE ZVYZH'.replace(/ /g, '')
    if(!correct) throw new Error('Test fails');
    console.log('correct');
}

test(11);