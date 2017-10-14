const CHAR_COUNT = 26;
const A_CODE = 'A'.charCodeAt(0);

export class Reflector {
    transform(x) {
        const inputCode = x.toUpperCase().charCodeAt(0) - A_CODE;
        const outputCode = (25 - inputCode) % 26 + A_CODE;
        const outputChar = String.fromCharCode(outputCode);
        return outputChar;
    }
}

export class Rotor {
    constructor(advancement) {
        this.advancement = advancement;
        this.advancementCounter = 0;
        this._position = 0;
    }

    set position(char) {
        console.log('rotor position set to ', char.toUpperCase());
        this._position = char.toUpperCase().charCodeAt(0) - A_CODE;
        this.advancementCounter = 0;
    }

    get position() {
        return String.fromCharCode(this._position + A_CODE);
    }

    transform(input) {
        const inputCode = input.toUpperCase().charCodeAt(0) - A_CODE;
        const outputPrepare = inputCode + this._position
        const outputCode = outputPrepare % CHAR_COUNT + A_CODE;
        const resultChar = String.fromCharCode(outputCode);
        return resultChar;
    }

    reverse(input) {
        const inputCode = input.toUpperCase().charCodeAt(0) - A_CODE;
        const outputPrepare = inputCode + CHAR_COUNT - this._position;
        const outputCode = outputPrepare % CHAR_COUNT + A_CODE;
        this.advancementCounter += 1;
        if (this.advancementCounter == this.advancement) {
            this.advancementCounter = 0;
            this._position += 1;
        }
        const resultChar = String.fromCharCode(outputCode);
        return resultChar;
    }
}