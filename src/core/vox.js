/* eslint-disable no-console */

class Vox {

    static attack = 50;
    static decay = 200;
    static compressor = undefined;
    static context = undefined;
    node = undefined;
    oscillators = [];
    _wave = undefined;
    playing = false;

    get gain() {
        return this.node.gain;
    }



    constructor(freq, wave) {
        let node = Vox.context.createGain();
        node.connect(Vox.compressor);
        node.gain.setValueAtTime(0, Vox.context.currentTime);


        let oscillator = Vox.context.createOscillator();
        oscillator.type = wave;
        oscillator.frequency.setValueAtTime(freq, Vox.context.currentTime); // value in hertz
        oscillator.connect(node);
        oscillator.start();

        this.oscillators = [oscillator],
        this.node = node,
        this.playing = false,
        this._wave = wave
    }

    get wave() {
        return this._wave;
    }
    set wave(type) {
        for (let o = 0; o < this.oscillators.length; o++) {
            this.oscillators[o].type = type;
        }
        this._wave = type;
    }

    setChord(freqArray) {
        //cleaning
        for (let i = 0; i < this.oscillators.length; i++) {
            this.oscillators[i].stop();
        }
        this.oscillators = [];
        // setting chord
        for (let i = 0; i < freqArray.length; i++) {
            let oscillator = Vox.context.createOscillator();
            oscillator.type = this.wave;
            oscillator.frequency.setValueAtTime(freqArray[i], Vox.context.currentTime); // value in hertz
            oscillator.connect(this.node);
            oscillator.start();
            this.oscillators.push(oscillator);
        }
        return freqArray;
    }
    blow() {
        let attack = Vox.attack / 1000;
        attack = attack * (1 - this.gain.value);
        this.gain.cancelScheduledValues(Vox.context.currentTime);
        this.gain.setValueAtTime(this.gain.value, Vox.context.currentTime);
        this.gain.linearRampToValueAtTime(1, Vox.context.currentTime + attack);
        this.playing = true;
        if (!this.playing) this.release();
    }
    release() {
        let decay = Vox.decay / 1000;
        decay = decay * this.gain.value;
        this.gain.cancelScheduledValues(Vox.context.currentTime);
        this.gain.setValueAtTime(this.gain.value, Vox.context.currentTime);
        this.gain.linearRampToValueAtTime(0, Vox.context.currentTime + decay);
        this.playing = false;
    }
}

export default Vox;