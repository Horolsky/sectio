<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <v-btn
    v-on:touchstart="attack"
    v-on:touchend="release"
    v-on:mousedown="attack"
    v-on:mouseup="release"
    :color="color"
    :disabled="disabled"
    class="my-0 text-none"
    v-html="btnText"
  >
  </v-btn>
</template>

<script>
export default {
  name: "SecBtn",
  props: {
    disabled: Boolean,
    sectionID: Number,
    freq: Number,
    //btnText: String,
    color: String,
  },
  data: () => ({
    playing: false,
    voice: { pluck: null, blow: null, release: null },
  }),
  created() {
    this.voice = this.$sound.createVoice(this.freq);
  },
  methods: {
    initialize() {},
    attack() {
      this.voice.blow();
    },
    release() {
      this.voice.release();
    },
  },
  mounted() {},
  computed: {
    btnText: function() {
      return this.$store.getters[`canon/getViewCode`](this.sectionID);
    },
  },
  watch: {
    freq(newVal) {
      this.voice.setChord([newVal]);
    },
  },
};
</script>

<style></style>
