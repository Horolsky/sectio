<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Edit Section</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <!-- FIGURE -->
            <v-col cols="auto" sm="6" md="4">
              <v-text-field
                v-model="editedName"
                label="Note name"
                :maxlength="30"
                counter
                :hint="warningFig"
                persistent-hint
              >
                <template v-slot:message="{ message, key }">
                  <div :class="key === 0 ? 'error--text' : ''">
                    {{ message }}
                  </div>
                </template>
              </v-text-field>
            </v-col>
            <!-- SHORTCODE -->
            <v-col cols="auto" sm="6" md="4">
              <v-text-field
                v-model="editedCode"
                label="Shortcode"
                maxlength="3"
                counter
                :hint="warningCode"
                persistent-hint
              >
                <template v-slot:message="{ message, key }">
                  <div :class="key === 0 ? 'error--text' : ''">
                    {{ message }}
                  </div>
                </template></v-text-field
              >
            </v-col>

            <!-- PARENT -->
            <v-col v-if="sectionID != 0" cols="auto" sm="6" md="4">
              <v-select
                v-model="editedParentID"
                :items="parentOptions"
                item-text="code"
                item-value="id"
                label="Parent Section"
              >
              </v-select>
            </v-col>

            <v-col
              v-if="Array.isArray(editedRTP)"
              cols="auto"
              sm="6"
              md="4"
              class="my-0 py-0"
            >
              <!-- RTP -->
              <InputRatio
                label="Ratio to Parent"
                :ratio="editedRTP"
                :min="1"
                :max="999999"
              />
            </v-col>

            <v-col v-else-if="!isNaN(editedRTP)" cols="auto" sm="6" md="4">
              <v-text-field
                v-model="editedRTP"
                label="Ratio to Parent"
                max="2400"
                min="-2400"
                suffix="¢"
              >
              </v-text-field>
            </v-col>
            <!-- TEMPERAMENT -->
            <v-col
              v-if="sectionID != 0"
              v-show="ratioViewMode != 1"
              cols="auto"
              sm="6"
              md="4"
              class="my-0 py-0"
            >
              <InputRatio
                v-if="ratioViewMode == 0"
                label="Temperament"
                :ratio="editedTemperament"
                :min="-999999"
                :max="999999"
                :hint="tempView"
              />
              <v-text-field
                v-else
                v-model="editedTemperament"
                label="Temperament"
                suffix="¢"
                class="my-4"
              >
                <template v-slot:message="{ message, key }">
                  <div :class="key === 0 ? 'error--text' : ''">
                    {{ message }}
                  </div>
                </template></v-text-field
              >
            </v-col>
            <v-col v-if="sectionID == 0" cols="auto" sm="6" md="4">
              <v-text-field
                v-model="editedFreq"
                label="Frequency"
                suffix="Hz"
                class="my-4"
                min="20"
                max="4000"
              />
            </v-col>
            <v-col v-if="sectionID == 0" cols="auto" sm="6" md="4">
              <v-text-field
                v-if="sectionID == 0"
                v-model="editedStrL"
                label="String Length"
                suffix="units"
                class="my-4"
                min="1"
                max="120000"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
        <v-btn
          :disabled="invalid"
          color="blue darken-1"
          text
          @click.stop="
            saveSection();
            dialog = false;
          "
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import CanonData from "../../mixins/CanonData";
import SecEdit from "../table-mixins/SectionEditor";
export default {
  name: "Dialog_EditSection",
  props: {
    sectionID: Number,
  },
  mixins: [CanonData, SecEdit],
  data: () => ({
    dialog: false,

    editedName: undefined,
    editedCode: undefined,
    editedRTP: undefined,
    editedTemperament: "undefined",
    editedParentID: undefined,
    editedFreq: undefined,
    editedStrL: undefined,

    warningFig: undefined,
    warningCode: undefined,

    parentOptions: [{ code: undefined, id: undefined }],
  }),
  created() {
    this.dialog = true;
    this.initialize();
  },
  methods: {
    initialize: function() {
      this.editedName = this.sec_data[this.sectionID].name;

      this.editedCode = this.sec_data[this.sectionID].code;

      if (this.sectionID == 0) {
        this.editedFreq = this.GET_PROPERTY("baseFreq");
        this.editedStrL = this.GET_PROPERTY("baseStrL");
      } else {
        this.editedParentID = this.sec_data[this.sectionID].parent;
        let vue = this;

        this.parentOptions = (function() {
          let parents = vue.s_pitches;
          let map_children = vue.$store.getters[`canon/map_children`];
          //recursive parentlist cleaning (to prevent infinite parenting loops like a>b>c>a)
          (function clearParents(secID) {
            let selfIndex = parents.indexOf(secID);
            if (selfIndex >= 0) parents.splice(selfIndex, 1);

            let children = map_children[secID];
            for (let y = 0; y < children.length; y++) {
              clearParents(children[y]);
            }
          })(vue.sectionID);
          let result = new Array(parents.length);
          for (let i = 0; i < parents.length; i++) {
            result[i] = {
              id: parents[i],
              code: parents[i] + ": " + vue.sec_data[parents[i]].code, //.concat(parents[i].sub())
            };
          }
          return result;
        })();

        let infoRTP = Object.assign(
          {},
          this.s_relInfo[this.editedParentID][this.sectionID].up
        );

        this.editedRTP =
          this.ratioViewMode != 1
            ? infoRTP.approximation
            : infoRTP.euler * 1200;

        this.editedTemperament;
        switch (this.ratioViewMode) {
          case 0:
            this.editedTemperament = Math.Canonis.unlimFractionAppr(
              infoRTP.temperament / this.comma,
              1000
            );
            break;
          case 2:
            this.editedTemperament = 1200 * infoRTP.temperament;
            break;
          default:
            this.editedTemperament = 0;
        }
      }
    },
    saveSection() {
      let payload;
      if (this.sectionID == 0) {
        payload = {
          id: 0,
          name: this.editedName,
          code: this.editedCode,
          freq: this.editedFreq,
          strL: this.editedStrL,
        };
      } else {
        let rtp =
          this.ratioViewMode != 1
            ? Math.log2(this.editedRTP[0] / this.editedRTP[1])
            : this.editedRTP / 1200;

        let temperament;
        if (this.ratioViewMode == 0) {
          if (this.editedTemperament[0] * this.editedTemperament[1] == 0) temperament = 0;
          else {
            temperament =
              (Math.Canonis.comma * this.editedTemperament[0]) /
              this.editedTemperament[1];
          }
        } else if (this.ratioViewMode == 2) {
          temperament = this.editedTemperament / 1200;
        } else temperament = 0;

        payload = {
          id: this.sectionID,
          name: this.editedName,
          code: this.editedCode,
          parent: this.editedParentID,
          rtp: rtp + temperament,
        };
      }
      this.$store.dispatch(`canon/EDIT_SECTION`, payload);
      this.dialog = false;
    },
  },
  watch: {
    editedName(newVal) {
      let oldName = newVal == this.sec_data[this.sectionID].name;
      let newID = this.$store.getters[`canon/pool_names`].indexOf(newVal);
      if (!oldName && newID >= 0) this.warningFig = "this name is taken";
      else this.warningFig = undefined;
    },
    editedCode(newVal) {
      let oldCode = newVal == this.sec_data[this.sectionID].code;
      let newID = this.$store.getters[`canon/pool_codes`].indexOf(newVal);
      if (!oldCode && newID >= 0) this.warningCode = "this code is taken";
      else this.warningCode = undefined;
    },
  },
  computed: {},
};
</script>

<style scoped></style>
