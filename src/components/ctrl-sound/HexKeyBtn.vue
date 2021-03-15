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
import RatioViewer from "../mixins/RatioViewer";
import CanonData from "../mixins/CanonData";
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
  mixins: [RatioViewer, CanonData],
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
      let msg = "";
      if (this.scale) {
        let chordStruc = [0].concat(this.activeChord);
        let chordIDs = [];//new Array(chordL);
        let chordCodes = [];//new Array(chordL);
        
        for (let i = 0; i < chordStruc.length; i++) {
            let id = (this.id + chordStruc[i])
            if (!this.scale.full[id]) break;
            chordIDs.push(this.scale.full[id].base.id);
            chordCodes.push(this.scale.full[id].base.code);
        }
        msg += chordCodes.join(', ') + " ";
        let get_chord_ratios = this.$store.getters[`canon/get_chord_ratios`];
        let relinfo = get_chord_ratios(chordIDs);
        if (this.ratioViewMode != 1){
          let ratios = [];
          ratios[0] = 1;
          let temps = [];
          temps[0] = 0;
          for (let i = 0; i < relinfo.length; i++){
            let mul = ratios[0];
            ratios = ratios.map(el => el * relinfo[i].approximation[1]);
            ratios[i+1] = relinfo[i].approximation[0] * mul;
            temps[i+1] = -relinfo[i].temperament;
          }
          ratios = ratios.map(el => el / Math.Canonis.gcf(ratios));
          for (let i = 0; i < relinfo.length; i++){
            ratios[i] = `${ratios[i]}${this.get_temperament(
              temps[i], this.comma
            )}`
          }
          msg = `${msg} ${ratios.join(':')}`;
        }
        else {
          msg = `${msg} ${relinfo.map(el => (el.euler * 1200).toFixed(2)).join(', ')}`;
        }
        
      } 

      this.$notify({
        group: "vox",
        text: msg
      });
    },
    endBlow() {
      this.btnClass = this.primaryClass;
      this.voice.release();
    }
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
      return this.scale ? this.scale.full[this.id] : undefined;
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
          let chordFreq = this.scale.full[this.id + chordStruc[i]]
            ? this.scale.full[this.id + chordStruc[i]].freq
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
