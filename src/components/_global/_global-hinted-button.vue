<template>
  <v-tooltip
    :bottom="!topHintPos"
    :top="topHintPos"
    :open-delay="numericDelay || 1000"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        v-if="!info"
        v-on="on"
        :color="color"
        @click.stop="$emit('click')"
        :text="text != null"
        :icon="icon != null"
        :size="computedSize"
        :light="light"
        :outlined="outlined"
        :disabled="disabled"
        :small="small"
        :class="computedClass + (active ? ' btn-on' : ' btn-off')"
        :fab="round"
      >
        <div
          v-html="text"
          class="btn-txt"
          style="text-transform: none; font-family: serif;"
        ></div>
        <v-icon v-if="icon != null && text == null" :size="size">{{
          icon
        }}</v-icon>
      </v-btn>

      <v-icon
        v-if="info"
        v-on="on"
        :class="elClass || 'lighten-1'"
        :size="size"
        :light="light"
        :color="color"
        style="width: 100%"
        >{{ icon }}</v-icon
      >
    </template>
    <span>{{ hintText }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "HintedButton",
  props: {
    active: Boolean,
    info: Boolean,
    topHintPos: Boolean,
    icon: String,
    color: String,
    hintText: String,
    href: String,
    size: String,
    light: Boolean,
    delay: String,
    text: String,
    outlined: Boolean,
    disabled: Boolean,
    elClass: String,
    small: Boolean,
    round: Boolean,
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
    computedSize: function() {
      if (!this.round) return this.size;
      else return "";
    },
    computedClass: function() {
      let computedClass = this.elClass ? this.elClass : "mx-2";
      if (this.text != null) {
        if (this.round)
          computedClass =
            computedClass +
            (this.$vuetify.theme.dark
              ? " letter-btn-dark"
              : " letter-btn-light");
        else
          computedClass =
            computedClass +
            (this.$vuetify.theme.dark ? " text-btn-dark" : " text-btn-light");
      }

      return computedClass;
    },
  },
};
</script>

<style scoped>
.letter-btn-light {
  font-weight: 800;
  font-size: 200%;
  width: 48px;
  height: 48px;
  color: rgba(0, 0, 0, 0.54);
}
.letter-btn-dark {
  font-weight: 800;
  font-size: 200%;
  width: 48px;
  height: 48px;
  color: white;
}

.text-btn-light {
  font-weight: 800;
  font-size: 120%;
  color: rgba(0, 0, 0, 0.54);
}
.text-btn-dark {
  font-weight: 800;
  font-size: 120%;
  color: white;
}
</style>
