<template>
  <v-tooltip
    :bottom="!topHintPos"
    :top="topHintPos"
    :open-delay="numericDelay || 1000"
  >
    <template v-slot:activator="{ on }">
      <v-icon
        v-on="on"
        :class="elClass || 'lighten-1'"
        :size="size"
        :light="light"
        :color="color"
        >{{ info ? "mdi-information-outline" : "mdi-help-circle" }}</v-icon
      >
    </template>
    <span>{{ hintText }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "InfoHint",
  props: {
    info: Boolean,
    topHintPos: Boolean,
    color: String,
    hintText: String,
    href: String,
    size: String,
    light: Boolean,
    delay: String,
    elClass: String,
    small: Boolean,
  },
  data: () => ({
    bottom: false,
  }),
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      //this.bottom = this.topHintPos || false;
    },
    evaluate(str) {
      eval(str);
    },
  },
  mounted() {
    // Instead of calling the method we emit an event
  },
  computed: {
    numericDelay: function() {
      return parseInt(this.delay) || 1000;
    },
  },
};
</script>

<style></style>
