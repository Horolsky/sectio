<template>
  <v-navigation-drawer
    v-model="dialog"
    app
    temporary
    right
    color="rgba(0, 0, 0, 0)"
    width="400px"
    height="100%"
  >
    <v-card width="378px" height="96%" raised class="my-3 mx-3">
      <v-card-title>
        <span
          v-html="
            `${noteCode.bold()}${sectionID
              .toString()
              .sub()
              .sub()}`
          "
        />
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" icon @click="dialog = false"
          ><v-icon>mdi-close-circle</v-icon></v-btn
        >
      </v-card-title>

      <v-card-text>
        <v-list dense>
          <v-list-item>
            <v-spacer />
            <RatioViewMode />
          </v-list-item>
          <v-list-item>
            <p v-html="'Name:'" />
            <v-spacer />
            <p v-html="noteName.bold()" />
          </v-list-item>
          <v-list-item>
            <p v-html="'Frequency:'" />
            <v-spacer />
            <p v-html="freq + ' Hz'" />
          </v-list-item>
          <v-list-item>
            <p v-html="'String Length:'" />
            <v-spacer />
            <p v-html="strL + ' units'" />
          </v-list-item>
          <v-list-item v-if="parentCode">
            <p v-html="'Parent:'" />
            <v-spacer />
            <p v-html="parentCode" />
          </v-list-item>
          <v-list-item v-if="parentCode">
            <p v-html="'Ratio to parent:'" />
            <v-spacer />
            <p v-html="rtpView" />
          </v-list-item>
          <v-list-item>
            <p v-html="'Ratio to root:'" />
            <v-spacer />
            <p v-html="rtbView" />
          </v-list-item>
          <v-list-item v-if="childrenInfo">
            <p v-html="'Children:'" />
            <v-spacer />
            <p v-html="childrenInfo" />
          </v-list-item>
          <v-list-item v-if="equivInfo">
            <p v-html="'Period equivalents:'" />
            <v-spacer />
            <p v-html="equivInfo" />
          </v-list-item>
          <v-list-item
            v-html="'Comparison target:'.bold()"
            style="text-align: center !important;"
          />
          <v-list-item>
            <v-select
              v-model="relationTarget"
              :items="targets"
              item-text="noteCode"
              item-value="id"
              dense
            />
          </v-list-item>
          <v-list-item>
            <p v-html="'Ratio to target:'"/>
            <v-spacer />
            <p v-html="relativeInfo"></p
          ></v-list-item>
          <v-list-item>
            <v-btn
              @click="dialog_editSect = true"
              width="100%"
              class="blue-grey fill-height"
              small
            >
              Edit Parameters
              <v-icon right>mdi-square-edit-outline</v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <DialogEditSection
      v-if="dialog_editSect"
      @onclose="dialog_editSect = false"
      :sectionID="sectionID"
    />
  </v-navigation-drawer>
</template>

<script>
import DialogEditSection from "./modal-dialogs/Dialog_EditSection";
import RatioViewer from "../mixins/RatioViewer";
import RowData from "./table-mixins/RowData";
import BasicRatiosView from "./table-mixins/BasicRatiosView";
import CanonData from "../mixins/CanonData";

export default {
  name: "RelationsDrawer",
  props: {
    sectionID: Number,
  },
  mixins: [CanonData, RatioViewer, RowData, BasicRatiosView],
  components: {
    DialogEditSection,
  },
  data: () => ({
    dialog: false,

    dialog_editSect: false,
    relationTarget: 0,
  }),
  created() {
    this.dialog = true;
  },
  computed: {
    targets: function() {
      let pitches = this.s_pitches;
      let trgts = new Array(pitches.length);
      for (let i = 0; i < pitches.length; i++) {
        trgts[i] = {
          id: pitches[i],
          noteCode: this.sec_data[pitches[i]].code,
        };
      }
      return trgts;
    },
    w_rtt_ptolemaic: function() {
      let info = this.s_relInfo[this.relationTarget][this.sectionID];
      let ptol = this.getView_FullPtolemaic(info, this.comma);
      return this.period ? ptol.join("&nbsp;&nbsp;//&nbsp;&nbsp;") : ptol[0];
    },
    w_rtt_ellis: function() {
      let info = this.s_relInfo[this.relationTarget][this.sectionID];
      let ellis = this.getView_FullEllis(info);
      return this.period ? ellis.join("&nbsp;&nbsp;//&nbsp;&nbsp;") : ellis[0];
    },
    w_rtt_mixed: function() {
      let info = this.s_relInfo[this.relationTarget][this.sectionID];
      let mixed = this.getView_FullMixed(info, this.comma);
      return this.period ? mixed.join("&nbsp;&nbsp;//&nbsp;&nbsp;") : mixed[0];
    },
    removeConfirmQuestion: function() {
      let quest =
        this.sectionID === 0
          ? `Clear schema?`
          : `Remove section ${this.noteCode.bold()}${this.sectionID
              .toString()
              .sub()
              .sub()}?`;
      return quest;
    },
    relativeInfo: function() {
      let res;
      switch (this.ratioViewMode) {
        case 0:
          res = this.w_rtt_ptolemaic;
          break;
        case 1:
          res = this.w_rtt_ellis;
          break;
        case 2:
          res = this.w_rtt_mixed;
          break;
        default:
          res = this.w_rtt_ptolemaic;
      }
      return res;
    },
  },
  methods: {
    deleteSection() {
      this.$store.dispatch(`canon/REMOVE_SECTION`, {
        sectionID: this.sectionID,
        cascade: this.cascadeRemoving === "true",
      });
    },
  },
};
</script>

<style scoped></style>
