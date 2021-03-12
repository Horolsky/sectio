<template>
  <v-btn-toggle
    :class="vertical ? 'btn-group-vertical' : 'btn-group-horizontal'"
    borderless
    :background-color="backColor"
    v-model="ratioViewMode"
  >
    <HintedButton
      :active="ratioViewMode == 0"
      icon
      text="R<sup>+k</sup>"
      hintText="Rational-Eitz notation"
      elClass="mx-0"
    />
    <HintedButton
      :active="ratioViewMode == 1"
      icon
      text="¢"
      hintText="Ellis notation"
      elClass="mx-0"
    />
    <HintedButton
      :active="ratioViewMode == 2"
      icon
      text="R<sup>+¢</sup>"
      hintText="Mixed notation"
      elClass="mx-0"
    />
  </v-btn-toggle>
</template>

<script>
export default {
  name: "RatioViewMode",
  props: {
    vertical: Boolean,
    backColor: String,
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
