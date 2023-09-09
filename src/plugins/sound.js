/* eslint-disable no-console */
import Vue from 'vue';
import Vox from "@core/vox-class";

let privateProps = {
    _Context: undefined,
    _Master: undefined,
    _Compressor: undefined,
    _voices: [],
    _wavetype: "triangle",

    _baseScale: [],
    _fullScale: [],
    _activeChord: [],

    _mute: true
};

let state = {

    get Context() {
        return privateProps._Context;
    },
    get Master() {
        return privateProps._Master;
    },
    get Compressor() {
        return privateProps._Compressor;
    },
    get mute() {
        return privateProps._mute;
    },
    set mute(bool) {
        if (typeof bool != "boolean") return;
        else if (this.Master) {
            let val = bool ? 0 : 1;
            this.Master.gain.setValueAtTime(val, this.Context.currentTime);
            privateProps._mute = bool;
        }
    },

    get baseScale() {
        return privateProps._baseScale;
    },
    set baseScale(val) {
        privateProps._baseScale = val;
    },

    get fullScale() {
        return privateProps._fullScale;
    },
    set fullScale(val) {
        privateProps._fullScale = val;
    },
    get activeChord() {
        return privateProps._activeChord;
    },
    set activeChord(val) {
        privateProps._activeChord = val;
    },
    get voices() {
        return privateProps._voices;
    },
    get wavetype() {
        return privateProps._wavetype;
    },
    set wavetype(val) {
        privateProps._wavetype = val;
    }
}

// shared data storage plugin
class AppDataStore {
    constructor(data = {}) {
        this.storeVM = new Vue({ data })
    }
    get state() {
        return this.storeVM.$data
    }

    start() {
        privateProps._Context = new (window.AudioContext || window.webkitAudioContext)();
        privateProps._Master = privateProps._Context.createGain();
        privateProps._Master.connect(privateProps._Context.destination);
        privateProps._Master.gain.setValueAtTime(1, privateProps._Context.currentTime);

        privateProps._Compressor = privateProps._Context.createDynamicsCompressor();
        privateProps._Compressor.connect(privateProps._Master);
        state.mute = false;
    }
    createVoice(freq = 0, wave = "triangle") {
        let voice = new Vox(privateProps._Context, privateProps._Compressor, freq, wave);
        state.voices.push(voice);
        return voice;
    }
    toggleChordDegree(value) {
        if (value === 0) state.activeChord = [];
        else if (state.activeChord.indexOf(value) < 0)
            state.activeChord.push(value);
        else state.activeChord.splice(state.activeChord.indexOf(value), 1);
    }
    setWave(wave) {
        if (!["triangle", "sine", "square", "sawtooth", "custom"].indexOf(wave) < 0) return;
        if (wave != "custom") {
            let t = performance.now();
            for (let v = 0; v < state.voices.length; v++) {
                state.voices[v].wave = wave;
            }
            console.log(`wavetype update: ${(performance.now() - t).toFixed(3)} ms`);
        }
        //TODO custom
        state.wavetype = wave;
    }
}
const sound = {
    Store: AppDataStore,
    install(Vue, options) {
        Vue.mixin({
            beforeCreate() {
                this.$sound = options.store
            }
        })
    }
}

// Install the plugin, and inject a new store instance
Vue.use(sound, {
    store: new sound.Store(state)
})

export default sound;

