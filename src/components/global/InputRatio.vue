<template>
  <v-col class="mx-0 my-0 ratio">
    <v-row no-gutters class="my-0 py-0 ratio-label">{{ label }} </v-row>
    <v-row class="mt-0 pt-0" style="height: 70%" no-gutters>
      <v-col cols="5.5">
        <v-text-field
          v-if="!optionsL"
          v-model="ratio[0]"
          type="number"
          :min="min"
          :max="max"
          suffix="  "
          class="ratio-right pt-0 mt-0"
          hide-details
          :disabled="disabled"
        />
        <v-select
          v-else
          v-model="ratio[0]"
          :items="optionsL"
          class="ratio-right pt-0 mt-0"
          suffix="  "
          hide-details
          :disabled="disabled"
        ></v-select>
      </v-col>
      <v-col cols="1 pt-2">
        <span class="ratio-colon mt-1">:</span>
      </v-col>
      <v-col cols="5.5">
        <v-text-field
          v-if="!optionsR"
          v-model="ratio[1]"
          type="number"
          min="1"
          max="9999999"
          prefix=" "
          class="pt-0 mt-0"
          hide-details
          :disabled="disabled"
        />
        <v-select
          v-else
          v-model="ratio[1]"
          :items="optionsR"
          class="pt-0 mt-0"
          suffix="  "
          hide-details
          :disabled="disabled"
        ></v-select>
      </v-col>
    </v-row>
    <v-row style="font-size: 90%; padding-left: 12px; margin-top: 2px;">
      <v-card flat v-html="hint"></v-card>
    </v-row>
  </v-col>
</template>

<script>
export default {
  name: "InputRatio",
  props: {
    disabled: Boolean,
    label: String,
    ratio: Array,
    hint: String,
    max: Number,
    min: Number,
    optionsL: Array,
    optionsR: Array,
    hintL: String,
    hintR: String,
  },
};
</script>

<style scoped>
.ratio {
  padding-left: 0px !important;
  padding-right: 0px !important;
}
.ratio-colon {
  align-self: center;
  margin-left: 40%;
  margin-right: 40%;
  margin-top: 8px;
}
.ratio-label {
  font-size: 90%;
  height: 16px;
}
/* not working */
.ratio-right input {
  text-align: right !important;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
