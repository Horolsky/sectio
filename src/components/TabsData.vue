<template>
  <div>
    <v-card tile class="blue">
      <v-tabs
        height="40px"
        class="red"
        v-model="tabID"
        centered
        show-arrows
        center-active
        align-with-title
      >
        <v-tab
          v-for="(canon, i) in canons"
          :key="i"
          :href="'#' + i"
          class="myTab my-2"
          style="text-transform: none;"
        >
          {{ canon }}

          <v-btn class="ml-6" icon small @click="closeTab(i)">
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </v-tab>
      </v-tabs>
    </v-card>

    <!-- TAB CONTENT -->
    <SectionsTable :active="dataViewMode == 0" />
    <QwertyKeyboard :active="dataViewMode == 1" />
    <Infographic :active="dataViewMode == 2" />
  </div>
</template>

<script>
import SectionsTable from "./view-data-table/SectionsTable";
import QwertyKeyboard from "./ctrl-sound/QwertyKeyboard";
import Infographic from "./view-infographic/Infographic";
//import ChordControl from "./ctrl-sound/ChordControl";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    SectionsTable,
    QwertyKeyboard,
    Infographic,
  },
  mounted: function() {
    this.initialize();
  },
  props: {
    dataViewMode: Number,
  },
  data: () => ({
    tabID: undefined,
  }),
  methods: {
    initialize() {
      this.$set(this, "tabID", parseInt(this.CURRENT_CANON));
    },
    closeTab(canonID) {
      this.DISPOSE_CANON(canonID);
    },
    ...mapActions([
      "UPDATE_TAB",
      "UPDATE_REG", // -> this['SET_CURRENT_CANON']()
      "DISPOSE_CANON",
    ]),
  },
  computed: {
    ...mapGetters(["CURRENT_CANON"]),
    canons: {
      get() {
        return this.$store.state.tabsData.canons.slice();
      },
      set() {},
    },
  },
  watch: {
    tabID(newVal) {
      if (newVal != this.CURRENT_CANON) {
        this.$store.dispatch("SET_CURRENT_CANON", parseInt(newVal));
      }
    },
    CURRENT_CANON(newVal) {
      if (newVal != this.tabID) {
        this.tabID = parseInt(newVal);
      }
    },
  },
};
</script>

<style scoped>
/*.myTab {
  margin: 1px;
  margin-right: 0;
  outline: 1px solid white;
}*/
</style>
