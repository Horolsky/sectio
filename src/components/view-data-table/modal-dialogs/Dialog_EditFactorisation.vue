<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <v-row>
          <span class="headline">Canon parameters</span>
          <InfoHint
            :hintText="
              `set period to ${
                ratioViewMode != 1 ? '0:1' : '0'
              } for nonperiodic system`
            "
            size="medium"
            color="grey"
            delay="100"
            elClass="mx-2"
          />
          <v-spacer />
        </v-row>
      </v-card-title>
      <v-card-actions> <v-spacer /><RatioViewMode /> </v-card-actions>
      <v-card-text>
        <v-container>
          <v-row no-gutters>
            <v-col cols="auto" sm="6" md="4" class="mx-2 my-0 py-0">
              <InputRatio
                label="Limit and Range"
                :ratio="e_factorisation"
                :optionsL="optional_primes"
                :min="1"
                :max="999999"
                :hint="'max range: ' + maxRange"
              />
            </v-col>
            <v-col cols="auto" sm="6" md="4" class="mx-2 my-0 py-0">
              <InputRatio
                v-if="ratioViewMode != 1"
                label="Period"
                :ratio="e_period"
                :min="1"
                :max="999999"
              />
              <v-text-field
                v-else
                v-model="e_period"
                type="number"
                :min="0"
                :max="12000"
                suffix="  "
                label="Period, ¢"
              />
            </v-col>
            <v-col cols="auto" sm="6" md="4" class="mx-2 my-0 py-0">
              <InputRatio
                v-if="ratioViewMode == 0"
                label="Comma"
                :ratio="e_comma"
                :min="1"
                :max="999999"
              />
              <v-text-field
                v-else-if="ratioViewMode == 2"
                v-model="e_comma"
                type="number"
                :min="0"
                :max="1200"
                suffix="  "
                label="Comma, ¢"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="
            saveFactorisation();
            dialog = false;
          "
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "EditDialog",
  props: {},
  data: () => ({
    dialog: false,
    e_factorisation: [1, 1],
    e_period: 1,
    e_comma: Math.log2(81 / 80),
    optional_primes: ["∞"].concat(Math.Canonis.primes.slice(1)),
    maxRange: 1000,
  }),
  created() {
    this.initialize();
  },
  methods: {
    initialize: function() {
      this.dialog = true;
      this.e_params = this.$store.getters[`canon/GET_PROPERTY`]("params");

      if (this.e_params.limit == undefined) this.e_params.limit = "∞";
      switch (this.e_params.limit) {
        case 2:
          this.maxRange = 10000000;
          break;
        case 3:
          this.maxRange = 10000000;
          break;
        case 5:
          this.maxRange = 1000000;
          break;
        case 7:
          this.maxRange = 600000;
          break;
        case 11:
          this.maxRange = 20000;
          break;
        case 13:
          this.maxRange = 5000;
          break;
        case 17:
          this.maxRange = 1000;
          break;
        case "∞":
          this.maxRange = 1000000;
          break;
      }
      this.e_factorisation = [this.e_params.limit, this.e_params.range];
      this.setPeriodAndComma();
    },
    setPeriodAndComma() {
      switch (this.ratioViewMode) {
        case 0:
          this.e_period = this.e_params.period
            ? Math.Canonis.unlimFractionAppr(2 ** this.e_params.period, 1000)
            : [0, 1];
          this.e_comma = Math.Canonis.unlimFractionAppr(
            2 ** this.e_params.comma,
            1000000
          );
          break;
        case 1:
          this.e_period = this.e_params.period
            ? this.e_params.period * 1200
            : 0;
          this.e_comma = null;
          break;
        case 2:
          this.e_period = this.e_params.period
            ? Math.Canonis.unlimFractionAppr(2 ** this.e_params.period, 1000)
            : [0, 1];
          this.e_comma = this.e_params.comma * 1200;
          break;
      }
    },
    saveFactorisation() {
      this.$store.dispatch(`canon/SET_PARAMS`, this.e_params);
      this.dialog = false;
    },
  },
  watch: {
    e_factorisation(newVal) {
      switch (newVal[0]) {
        case 2:
          this.maxRange = 10000000;
          break;
        case 3:
          this.maxRange = 10000000;
          break;
        case 5:
          this.maxRange = 1000000;
          break;
        case 7:
          this.maxRange = 600000;
          break;
        case 11:
          this.maxRange = 20000;
          break;
        case 13:
          this.maxRange = 5000;
          break;
        case 17:
          this.maxRange = 1000;
          break;
        case "∞":
          this.maxRange = 1000000;
          break;
      }
      this.e_params.limit = newVal[0] != "∞" ? newVal[0] : undefined;
      this.e_params.range = newVal[1];
    },
    e_period(newVal) {
      this.e_params.period = Array.isArray(newVal)
        ? Math.log2(newVal[0] / newVal[1])
        : newVal / 1200;
    },
    e_comma(newVal) {
      if (newVal) {
        this.e_params.comma = Array.isArray(newVal)
          ? Math.log2(newVal[0] / newVal[1])
          : newVal / 1200;
      }
    },
    ratioViewMode() {
      this.setPeriodAndComma();
    },
  },
};
</script>

<style scoped>
.ratio-align-right input {
  text-align: right;
  /*not working with style attr on component */
}
/*

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
*/
</style>
