<template>
  <div>
    <v-card flat class="mx-0 my-0" ref="keybcont">
      <v-container class="mx-0" fluid v-show="active">
        <v-row v-for="(columns, row) in keyb" :key="row" ref="keyrow">
          <div :style="`margin-right: ${(step / 2) * row}px`"></div>
          <HexKeyBtn
            v-for="col in columns"
            :key="col"
            :ref="`keybtn_${row + 1}x${col}`"
            :diameter="diameter"
            :interval="margin"
            :fontSize="fontSize"
            :row="row + 1"
            :col="col"
            :id="getId(row + 1, col)"
            :keyCode="getKeyCode(row + 1, col)"
            :active="active"
          />
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>
<script>
/*possible integer step/diam/margin:
      15 / 13 / 1
      30 / 26 / 2
      45 / 39 / 3
      60 / 52 / 4
      75 / 65 / 5
      +15 / +13 / +1
    */
// diameter = Math.round(Math.sqrt(this.step ** 2 * 0.75))),
// margin = Math.floor((this.step - this.diameter) / 2));
import HexKeyBtn from "./HexKeyBtn";

export default {
  name: "QwertyKeyboard",
  components: {
    HexKeyBtn,
  },
  props: {
    active: Boolean,
  },
  data: () => ({
    //QAZWSXEDCRFVTGBYHNUJMIK,OL.P;/[']
    poly: null,
    toneCodes: [
      81,
      65,
      90,
      87,
      83,
      88,
      69,
      68,
      67,
      82,
      70,
      86,
      84,
      71,
      66,
      89,
      72,
      78,
      85,
      74,
      77,
      73,
      75,
      188,
      79,
      76,
      190,
      80,
      186,
      191,
      219,
      222,
      221,
    ],
    keyboard: [],
    rows: 3,
    cols: 11,

    keyb: [12, 11, 10],
    contW: 0,
  }),
  computed: {
    btnStyle: function() {
      return `width: 13px; height: 13px; margin-left: 1px;`;
    },
    spcStyle: function() {
      return `width: 15px`;
    },
    diameter: {
      get: function() {
        return this.windowWidth / 14.5; //
      },
      set: () => {},
    },
    step: {
      get: function() {
        return Math.sqrt(this.diameter ** 2 / 0.75);
      },
      set: () => {},
    },
    margin: {
      get: function() {
        return this.step - this.diameter;
      },
      set: () => {},
    },
    fontSize: {
      get: function() {
        return Math.round(this.windowWidth / 40);
      },
      set: () => {},
    },
    containerW: function() {
      return this.$refs.keybcont.clientWidth;
    },
  },
  mounted: function() {
    this.contW = this.$refs.keybcont.clientWidth;

    this.$watch(
      function() {
        return this.$refs.keybcont.clientWidth;
      },
      function(newVal) {
        this.contW = newVal;
      }
    );
  },

  watch: {},
  methods: {
    getId(row, col) {
      let id = this.keyb.length * (col - 1) + row;
      if (id === 34) id = 33;
      return id;
    },
    getKeyCode(row, col) {
      let id = this.getId(row, col);
      return this.toneCodes[id - 1];
    },
  },
};
</script>

<style scoped>
.touchboard {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
