<template>
  <div ref="chart_cont" :class="contClass + ' my-4'">
    <div :class="linear ? 'cs-linear' : 'cs-cyclic'" />
    <div
      v-for="(interval, i) in chart_intervals"
      :key="'i' + i"
      :style="interval.style"
      :class="linear ? 'chart-intervals-linear' : 'chart-intervals-cycling'"
      :ref="i + ':' + interval.euler"
      v-show="interval.active"
    />
    <v-btn
      v-for="(button, i) in chart_buttons"
      :key="i"
      fab
      small
      absolute
      :color="button.color"
      :style="button.style"
      :class="linear && !vertical_layout ? 'linear-hl-btn' : 'chart-btn'"
      @click.stop="openDrawer(button.id)"
      v-html="button.code"
    ></v-btn>
  </div>
</template>

<script>
//import IGdata from "./IG_Data";

export default {
  name: "",
  //mixins: [IGdata],
  props: {
    chart_intervals: Array,
    chart_buttons: Array,
    linear: Boolean,
    vertical_layout: Boolean,
  },
  components: {},
  mounted: function() {
    this.initialize();
  },
  data: () => ({}),
  methods: {
    initialize: function() {},
    openDrawer: function(id) {
      this.$emit("show-section", id);
    },
  },
  computed: {
    contW: function() {
      if (this.linear) return this.contH * 1.5;
      else return this.contH;
    },
    contH: function() {
      return this.vertical_layout ? 70 : 50;
    },
    contClass: function() {
      if (this.linear)
        return this.vertical_layout ? "cc-vl-linear" : "cc-hl-linear";
      else return this.vertical_layout ? "cc-vl-cyclic" : "cc-hl-cyclic";
    },
  },
};
</script>

<style scoped>
/* hl = horizontal layout */
/* vl = vertical layout */
/* cc = chart cont */
/* cs = chart scale */
button {
  z-index: 2 !important;
  width: 4vmin !important;
  height: 4vmin !important;
  font-size: 60% !important;
  /*width: 5% !important;
  height: 0 !important;
  padding-bottom: 5% !important;*/
}
.cc-hl-cyclic {
  position: relative;
  /*width: 50vmin;
  height: 50vmin;*/

  width: 80% !important;
  height: 0 !important;
  padding-bottom: 80% !important;
}
.cc-vl-cyclic {
  position: relative;
  width: 70vmin;
  height: 70vmin;
}
.cc-hl-linear {
  transform-origin: top right;
  transform: rotate(-90deg) translate(-5vmin, -60vmin);
  width: 50vh;
  height: 50vh;
}
.cc-vl-linear {
  position: relative;
  width: 90vw;
  height: 60vh;
}

.cs-cyclic {
  width: 100% !important;
  /*height: 100% !important;*/
  height: 0 !important;
  padding-bottom: 98% !important;
  border: 5px solid grey;
  border-radius: 100%;
}
.cs-linear {
  position: absolute;
  top: 50%;
  width: 100%;
  height: 1px;
  border: 1px solid grey;
}
.chart-btn {
  position: absolute !important;
  transform: translate(-50%, -50%) !important;
}
.linear-hl-btn {
  position: absolute !important;
  transform-origin: center;
  transform: translate(-50%, -50%) rotate(90deg) !important;
}
.chart-intervals-cycling {
  position: absolute !important;
  background-color: red;
}
.chart-intervals-linear {
  position: absolute !important;
  border-radius: 100%;
  border: 2px solid red;
}
</style>
