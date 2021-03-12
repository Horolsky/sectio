<template>
  <div>
    <div v-if="!touchOn && !dialogIsActive && active">
      <Keypress
        v-if="!keyPressed"
        :key-code="keyCode"
        event="keydown"
        @pressed="blow"
      />
      <Keypress :key-code="keyCode" event="keyup" @pressed="endBlow" />
    </div>
    <v-btn
      :disabled="!hasData"
      v-on:touchstart="blow"
      v-on:touchend="endBlow"
      v-on:mousedown="blow"
      v-on:mouseup="endBlow"
      :style="`margin-left: ${interval}px; font-size: ${fontSize}px`"
      :width="diameter"
      :height="diameter"
      :color="color"
      fab
      :class="btnClass"
    >
      {{ tone ? tone.base.code : "" }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "HexKeyBtn",
  components: {
    Keypress: () => import("vue-keypress"),
  },
  props: {
    active: Boolean,
    col: Number,
    row: Number,

    diameter: Number,
    interval: Number,
    fontSize: Number,
    id: Number,
    keyCode: Number,
    //tone: Object
  },
  data: () => ({
    keyPressed: false,
    qwerty: false,

    bottom: false,
    btnText: "",
    btnClass: "",
    primaryClass: "",
    voice: undefined,
  }),
  methods: {
    blow() {
      this.voice.blow();
      this.btnClass = this.primaryClass + " lighten-4";
    },
    endBlow() {
      this.btnClass = this.primaryClass;
      this.voice.release();
    },
    getChord() {
      if (this.scale) {
        let chordStruc = [0].concat(this.activeChord);
        let chordFreqs = [];
        for (let i = 0; i < chordStruc.length; i++) {
          let chordFreq = this.scale.full[this.id + chordStruc[i] - 1]
            ? this.scale.full[this.id + chordStruc[i] - 1].freq
            : null;
          if (chordFreq) {
            chordFreqs.push(chordFreq);
          }
        }
        return chordFreqs;
      } else return [];
    },
  },
  created() {
    this.voice = this.$sound.createVoice();
    this.voice.setChord(this.chordFreqs);
  },
  computed: {
    hasData: function() {
      return this.$store.getters.CURRENT_CANON != undefined;
    },
    activeChord: function() {
      return this.$sound.state.activeChord;
    },
    scale: function() {
      if (this.hasData) {
        return this.$store.getters[`canon/GET_PROPERTY`]("map_scale");
      } else {
        return null;
      }
    },
    tone: function() {
      return this.scale ? this.scale.full[this.id - 1] : undefined;
    },
    color: function() {
      if (this.tone) {
        return this.tone.base.id === 0 ? "purple" : "blue-grey";
      } else return "grey";
    },
    chordFreqs: function() {
      if (this.scale) {
        let chordStruc = [0].concat(this.activeChord);
        let chordFreqs = [];
        for (let i = 0; i < chordStruc.length; i++) {
          let chordFreq = this.scale.full[this.id + chordStruc[i] - 1]
            ? this.scale.full[this.id + chordStruc[i] - 1].freq
            : null;
          if (chordFreq) {
            chordFreqs.push(chordFreq);
          }
        }
        return chordFreqs;
      } else return [];
    },
  },
  watch: {
    chordFreqs(newVal) {
      this.voice.setChord(newVal);
    },
  },
};
</script>

<style></style>
