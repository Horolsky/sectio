<template>
  <v-btn-toggle
    :class="vertical ? 'btn-group-vertical' : 'btn-group-horizontal'"
    borderless
    :background-color="backColor"
    v-model="waveType"
  >
    <HintedButton
      v-for="(wave, i) in wavetypes"
      :key="i"
      :active="waveType == i"
      :icon="icons[i]"
      :hintText="wave + ' wave type'"
      elClass="mx-0"
    />
  </v-btn-toggle>
</template>

<script>
export default {
  name: "WaveToggler",
  props: {
    vertical: Boolean,
    backColor: String,
  },
  data: () => ({
    wavetypes: ["sine", "triangle", "square", "sawtooth"],
    icons: [
      "mdi-sine-wave",
      "mdi-triangle-wave",
      "mdi-square-wave",
      "mdi-sawtooth-wave",
      //"mdi-waveform",
    ],
  }),
  computed: {
    waveType: {
      get() {
        return this.wavetypes.indexOf(this.$sound.wavetype);
      },
      set(val) {
        this.$sound.setWave(this.wavetypes[val]);
      },
    },
  },
};
</script>

<style>
.btn-group-vertical {
  flex-direction: column !important;
  border-radius: 0% !important;
  background-color: rgba(0, 0, 0, 0);
}
.btn-group-horizontal {
  border-radius: 0% !important;
  background-color: rgba(0, 0, 0, 0);
}
</style>
