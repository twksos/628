import keypress from 'keypress';
import fs from 'fs';
import {Rotor, Reflector} from './router';


class Enigma {
    constructor() {
        this.rotors = [new Rotor(1), new Rotor(2), new Rotor(3)];
        this.reflector = new Reflector();
        this.plugboard = {};
        this.mode = 0;
    }

    printRouters() {
        console.log('Router Setting is: ', this.rotors[2].position, this.rotors[1].position, this.rotors[0].position);
        this.mode = 0;
    }

    printPlugBoard() {
        console.log(this.plugboard);
        this.mode = 0;
    }

    setRotor(n) {
        return (char) => {
            this.rotors[n].position = char;
        }
    }
    setPlugBoard() {
        fs.readFile('./plugboard.config', 'utf8', (err, config) => {
            if (err) throw err;
            console.log(config);
            config.split(/\n/).forEach((pair)=>{
                if(!pair) return;
                if(!pair.toUpperCase().match(/^[A-Z]{2}$/)) console.log('Bad pair:', pair);
                const char1 = pair[0];
                const char2 = pair[1];
                const oldChar1Pair = this.plugboard[char1];
                if(oldChar1Pair) delete this.plugboard[oldChar1Pair];
                this.plugboard[char1] = char2;

                const oldChar2Pair = this.plugboard[char2];
                if(oldChar2Pair) delete this.plugboard[oldChar2Pair];
                this.plugboard[char2] = char1
            });

            this.mode = 0;
        });
    }

    process(input) {
        const key = input.toUpperCase();
        const keyAfterPlugboardIn = this.plugboard[key] || key;
        const keyAfterRoutersIn = this.rotors.reduce((result, rotor) => {
            return rotor.transform(result);
        }, keyAfterPlugboardIn);
        const keyReflected = this.reflector.transform(keyAfterRoutersIn);
        const keyAfterRoutersOut = [this.rotors[2], this.rotors[1], this.rotors[0]].reduce((result, rotor) => {
            return rotor.reverse(result);
        }, keyReflected);
        const result = this.plugboard[keyAfterRoutersOut] || keyAfterRoutersOut;
        console.log(result);
        return result;
    }
}

const enigma = new Enigma();
// make `process.stdin` begin emitting "keypress" events 
keypress(process.stdin);

console.log(`
        0: 'process',
        1: 'set rotor 1',
        2: 'set rotor 2',
        3: 'set rotor 3',
        4: 'set plugboard',
        5: 'print rotors'
`);
// listen for the "keypress" event 
process.stdin.on('keypress', function (ch, key) {
    if (enigma.mode == 4) return;
    // console.log('input:', ch.toUpperCase());
    if (!ch) return;
    const modeName = {
        0: 'process',
        1: 'set rotor 1',
        2: 'set rotor 2',
        3: 'set rotor 3',
        4: 'set plugboard',
        5: 'print rotors',
        6: 'print plugboard',
    };

    const action = {
        0: enigma.process.bind(enigma),
        1: enigma.setRotor(0).bind(enigma),
        2: enigma.setRotor(1).bind(enigma),
        3: enigma.setRotor(2).bind(enigma)
    };
    if (ch.match(/^[0-5]$/)) {
        const item = Number(ch);
        enigma.mode = item;
        console.log(modeName[enigma.mode]);
        if (item == 4) return enigma.setPlugBoard();
        if (item == 5) enigma.printRouters();
        if (item == 6) enigma.printPlugBoard();
        return;
    }

    if (ch.match(/^[a-z]$/)) {
        action[enigma.mode](ch);
        enigma.mode = 0;
        return;
    }
    if (key && key.ctrl && key.name == 'c') {
        process.stdin.pause();
    }
});

process.stdin.setRawMode(true);
process.stdin.resume();