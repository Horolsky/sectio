<template>
  <tr>
    <td>
      <SectionBtn
        :sectionID="sectionID"
        :freq="freq"
        :color="color"
        class="mx-0 my-0"
      />
    </td>

    <td v-if="!smallScreen" v-html="noteName" />
    <td v-if="!smallScreen" v-html="rtpView" />
    <td v-if="!smallScreen" v-html="parentCode" />
    <td v-if="!smallScreen" v-html="childrenInfo" />
    <td v-if="!smallScreen" v-html="rtbView" />

    <td v-if="smallScreen" style="font-size: 12px" v-html="denseInfo" />

    <td>
      <div style="width: 100%; display: inline-flex; justify-content: flex-end">
        <v-btn @click="drawer_relations = true" class="my-0 ml-2" icon>
          <v-icon>mdi-information-outline</v-icon>
        </v-btn>
        <v-btn @click="dialog_remove = true" class="my-0 ml-2" icon>
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
      </div>
    </td>
    <RelationsDrawer
      v-if="drawer_relations"
      @onclose="drawer_relations = false"
      :sectionID="sectionID"
    />
    <v-dialog v-model="dialog_remove" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline" v-html="removeConfirmQuestion" />
        </v-card-title>

        <v-card-text>
          <span v-if="sectionID === 0"
            >All sections except the root will be removed from the schema</span
          >

          <v-radio-group
            v-else
            v-model="cascadeRemoving"
            :mandatory="true"
            :disabled="!childrenInfo"
          >
            <v-radio
              label="Reassign children to the root"
              value="false"
            ></v-radio>
            <v-radio label="Delete descendants" value="true"></v-radio>
          </v-radio-group>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="blue darken-1"
            text
            @click="
              cascadeRemoving = false;
              dialog_remove = false;
            "
            >Cancel</v-btn
          >
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="
              dialog_remove = false;
              deleteSection();
            "
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </tr>
</template>

<script>
import SectionBtn from "./SectionBtn";
import RelationsDrawer from "./Drawer_ShowRelations";
import RatioViewer from "../mixins/RatioViewer";
import RowData from "./table-mixins/RowData";
import BasicRatiosView from "./table-mixins/BasicRatiosView";
export default {
  props: {
    orderN: Number,
    sectionID: Number,
  },
  mixins: [RatioViewer, RowData, BasicRatiosView],
  components: {
    SectionBtn,
    RelationsDrawer,
  },
  data: function() {
    return {
      drawer_relations: false,
      dialog_remove: false,
      cascadeRemoving: false,
    };
  },
  computed: {
    tableWidth: function() {
      return this.windowWidth * 0.95;
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
  },
  methods: {
    deleteSection() {
      this.$store.dispatch(`canon/REMOVE_SECTION`, {
        id: this.sectionID,
        cascade: this.cascadeRemoving === "true",
      });
    },
  },
};
</script>

<style scoped>
.col {
  height: inherit;
  vertical-align: middle;
  padding-left: 0%;
  padding-right: 0%;

  padding-bottom: 1px;
  padding-top: 1px;
}
</style>
