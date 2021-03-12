<template>
  <v-container
    class="mx-0"
    fluid
    fill-height
    v-show="active"
    style="align-items: start;"
  >
    <v-row dense class="justify-space-between" align="start">
      <v-col
        :cols="vertical_layout ? 12 : 5"
        class="d-flex justify-center mx-0 mt-0 py-0"
      >
        <InfoChart
          :chart_intervals="chart_intervals"
          :chart_buttons="chart_buttons"
          :linear="period == null"
          :vertical_layout="vertical_layout"
          @show-section="openDrawer"
        />
      </v-col>
      <v-col :cols="vertical_layout ? 12 : 7" class="mx-0 mt-2 my-0 py-0">
        <v-card flat tile>
          <v-simple-table dense :height="vertical_layout ? null : '60vh'">
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    <v-checkbox v-model="chartActWrapper" color="blue"
                      >V</v-checkbox
                    >
                  </th>
                  <th class="text-center" style="width: 50%">Ratio</th>
                  <th class="text-center" style="width: 50%">Primes</th>
                  <!--<th class="text-left pairs">Section pairs</th>-->
                </tr>
              </thead>
              <tbody>
                <tr v-for="(tabInt, i) in table_intervals" :key="i">
                  <td>
                    <v-checkbox dense v-model="tabInt.active" />
                  </td>
                  <td v-html="[tabInt.ratio,tabInt.mixed,tabInt.cents][ratioViewMode]" />
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>
    <RelationsDrawer
      v-if="sectionID != undefined"
      @onclose="sectionID = undefined"
      :sectionID="sectionID"
    />
  </v-container>
</template>

<script>
import RatioViewer from "../mixins/RatioViewer";
import CanonData from "../mixins/CanonData";
//import IGdata from "./IG_Data";
import Position from "./position-getters";
import InfoChart from "./IG_Chart";
import RelationsDrawer from "../view-data-table/Drawer_ShowRelations";
export default {
  name: "Infographic",
  components: {
    InfoChart,
    RelationsDrawer,
  },
  mixins: [RatioViewer, CanonData],
  props: {
    active: Boolean,
  },
  mounted: function() {
    this.$nextTick(function() {
      this.$nextTick(this.update);
    });
  },
  data: () => ({
    sectionID: undefined,
    chartActive: true,
    chart_buttons: undefined,
    chart_intervals: undefined,
    table_intervals: undefined,
  }),
  methods: {
    openDrawer: function(id) {
      this.sectionID = id;
    },
    update: function() {
      this.chart_buttons = this.getchart_buttons();
      this.chart_intervals = this.getchart_intervals();
      this.table_intervals = this.gettable_intervals();
    },
    getchart_buttons: function() {
      if (!this.hasData) return [];
      else
        return Position.getChartBtns(
          this.$store.getters[`canon/GET_PROPERTY`]("map_scale").base.map(
            (el) => el.id
          ),
          this.$store.getters[`canon/GET_PROPERTY`]("sec_data"),
          this.$store.getters[`canon/map_color`],
          this.$store.getters[`canon/GET_PROPERTY`]("params").period
        );
    },
    getchart_intervals: function() {
      if (!this.hasData) return [];
      else
        return Position.getChartIntvs(
          this.map_intervals,
          this.chart_buttons,
          this.$store.getters[`canon/GET_PROPERTY`]("params").period
        );
    },
    gettable_intervals: function() {
      if (!this.hasData) return [];
      let vue = this;
      let intvs = this.map_intervals;
      let findApproximation = this.$store.getters[`canon/findApproximation`];
      let table = new Array(intvs.length - 1);
      for (let i = 1; i < intvs.length; i++) {
        //let pairs = intvs[i].pairs,
        let recto = intvs[i].recto.euler,
          info = findApproximation(recto).up,
          ptol = this.getView_Ptolemaic(info, this.comma),
          ellis = this.getView_Ellis(info),
          mixed = this.getView_Mixed(info, this.comma);

        table[i - 1] = {
          recto: recto,
          ratio: ptol,
          cents: ellis,
          mixed: mixed,
          //pairs: this.getPairs(pairs),
          get active() {
            return vue.chart_intervals.find((el) => el.recto == recto).active;
          },
          set active(val) {
            if (!val) vue.chartActive = false;
            for (let y = 0; y < vue.chart_intervals.length; y++) {
              if (vue.chart_intervals[y].recto == recto)
                vue.chart_intervals[y].active = val;
            }
          }, //Todo setter
        };
      }

      table = table.sort((a, b) => a.recto - b.recto);
      return table;
    },
    getPairs(pairs) {
      let arr = [];
      let data = this.$store.getters[`canon/GET_PROPERTY`]("sec_data");
      for (let i = 0; i < pairs.length; i += 2) {
        let id1 = pairs[i],
          id2 = pairs[i + 1];

        arr.push(
          `${data[id1].code.bold()}${id1
            .toString()
            .sub()
            .sub()}&nbsp;-&nbsp;${data[id2].code.bold()}${id2
            .toString()
            .sub()
            .sub()}`
        );
      }
      return arr.join("&nbsp;, ");
    },
  },
  computed: {
    linear: function() {
      if (!this.hasData) return undefined;
      else
        return (
          this.$store.getters[`canon/GET_PROPERTY`]("params").period == null
        );
    },
    portraitScreen: function() {
      return this.$store.getters[`uiOptions/portraitScreen`];
    },
    vertical_layout: function() {
      if (this.portraitScreen) return true;
      else return this.$store.getters[`uiOptions/GET_UI_OPTION`]("IG_portrait");
    },
    chartActWrapper: {
      get() {
        return this.chartActive;
      },
      set(val) {
        if (val) {
          for (let y = 0; y < this.chart_intervals.length; y++) {
            this.chart_intervals[y].active = true;
          }
          this.chartActive = true;
        } else {
          for (let y = 0; y < this.chart_intervals.length; y++) {
            this.chart_intervals[y].active = false;
          }
          this.chartActive = false;
        }
      },
    },
  },
  watch: {
    canonID(val) {
      if (val != null) this.update();
    },
    map_intervals() {
      this.update();
    },
  },
};
</script>

<style>
.pairs {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  box-sizing: border-box;
}
</style>
