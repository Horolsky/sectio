/* eslint-disable no-console */
import Vox from "@core/vox";

const sound = {

    muted: false,
    Context: undefined,
    Master: undefined,
    Compressor: undefined,
    voices: [],
    wavetype: "triangle",

    baseScale: [],
    fullScale: [],
    activeChord: [],


    mute: () => {
        sound.muted = true
        if (sound.Master)
            sound.Master.gain.setValueAtTime(0, sound.Context.currentTime);
    },

    unmute: () => {
        sound.muted = false
        if (sound.Master)
            sound.Master.gain.setValueAtTime(1, sound.Context.currentTime);
    },

    switch: () => sound.muted ? sound.unmute() : sound.mute(),

    start: () => {
        sound.Context = new (window.AudioContext || window.webkitAudioContext)();
        sound.Master = sound.Context.createGain();
        sound.Master.connect(sound.Context.destination);
        sound.Master.gain.setValueAtTime(1, sound.Context.currentTime);
        sound.Compressor = sound.Context.createDynamicsCompressor();
        sound.Compressor.connect(sound.Master);
        Vox.compressor = sound.Compressor;
        Vox.context = sound.Context;
        sound.unmute();
    },
    createVoice: (freq = 0, wave = "triangle") => {
        let voice = new Vox(freq, wave);
        sound.voices.push(voice);
        return voice;
    },
    toggleChordDegree: (value) =>  {
        if (value === 0) sound.activeChord = [];
        else if (sound.activeChord.indexOf(value) < 0)
            sound.activeChord.push(value);
        else sound.activeChord.splice(sound.activeChord.indexOf(value), 1);
    },
    setWave: (wave) => {
        if (!["triangle", "sine", "square", "sawtooth", "custom"].indexOf(wave) < 0) return;
        if (wave != "custom") {
            let t = performance.now();
            for (let v = 0; v < sound.voices.length; v++) {
                sound.voices[v].wave = wave;
            }
            console.log(`wavetype update: ${(performance.now() - t).toFixed(3)} ms`);
        }
        //TODO custom
        sound.wavetype = wave;
    },

    // eslint-disable-next-line no-unused-vars
    install: (app, options) => {
        app.config.globalProperties.$sound = sound;
    }
}

export default sound;
