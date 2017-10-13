const CHAR_COUNT = 26;
const A_CODE = 'A'.charCodeAt(0);

export class Router {
    constructor(advancement) {
        this.advancement = advancement * 2;
        this.advancementCounter = 0;
        this._position = 0;
    }

    set position(char) {
        console.log('rotor position set to ', char);
        return char.toUpperCase().charCodeAt(0) - A_CODE;
    }
    get position() {
        return String.fromCharCode(this._position + A_CODE);
    }

    transform(input) {
        const inputCode = input.toUpperCase().charCodeAt(0) - A_CODE;
        const outputCode = (inputCode + this._position) % CHAR_COUNT + A_CODE;
        this.advancementCounter += 1;
        if(this.advancementCounter == this.advancement) this._position += 1;
        const resultChar = String.fromCharCode(outputCode);
        console.log(this.advancement, this._position, input, resultChar);
        return resultChar;
    }
}