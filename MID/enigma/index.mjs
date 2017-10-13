import keypress from 'keypress';
import {Router} from './router';

class Reflector {
    transform(x) {
        return String.fromCharCode(26 - x.charCodeAt(0));
    }
}

class Enigma {
  constructor() {
    this.rotors = [new Router(1), new Router(2), new Router(3)];
    this.reflector = new Reflector();
    this.plugboard = {};
    this.mode = 0;
  }
  printRouters() {
    console.log('Router Setting is: ', this.rotors[2].position, this.rotors[1].position, this.rotors[0].position);
  }
  setRotor(n) {
    return (char)=>{
      this.rotors[n].position = char;
    }
  }
  process(key) {
    const keyAfterPlugboardIn = this.plugboard[key] || key;
    console.log('keyAfterPlugboardIn', keyAfterPlugboardIn)
    const keyAfterRoutersIn = this.rotors.reduce((result, rotor)=>{
      return rotor.transform(result);
    }, keyAfterPlugboardIn);
    console.log('keyAfterRoutersIn', keyAfterRoutersIn)
    const keyReflected = this.reflector.transform(keyAfterRoutersIn);
    const keyAfterRoutersOut = [this.rotors[2], this.rotors[1], this.rotors[0]].reduce((result, rotor)=>{
      return rotor.transform(result);
    }, keyReflected);
    const result = this.plugboard[keyAfterRoutersOut] || keyAfterRoutersOut;
    console.log(result);
    return result;
  }
}

const enigma = new Enigma();
// make `process.stdin` begin emitting "keypress" events 
keypress(process.stdin);

// listen for the "keypress" event 
process.stdin.on('keypress', function (ch, key) {
  console.log('ch:', ch);
  const modeName = {0: 'process', 1: 'set rotor 1', 2: 'set rotor 2', 3: 'set rotor 3', 4: 'set plugboard', 5: 'print rotors'}
  const action = {
    0: enigma.process.bind(enigma), 
    1: enigma.setRotor(0).bind(enigma), 
    2: enigma.setRotor(1).bind(enigma), 
    3: enigma.setRotor(2).bind(enigma), 
    4: ()=>console.log('load plugboard')
  }

  if(ch.match(/^[0-5]$/)) {
    const item = Number(ch);
    enigma.mode = item;
    console.log(modeName[enigma.mode]);
    if(item == 5) {enigma.printRouters(); enigma.mode = 0}
  } else if(ch.match(/^[a-z]$/)) {
    action[enigma.mode](ch);
    enigma.mode = 0;
  }
  if (key && key.ctrl && key.name == 'c') {
    process.stdin.pause();
  }
});
 
process.stdin.setRawMode(true);
process.stdin.resume();