<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">New Section</span>
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
            <v-col cols="auto" sm="6" md="4">
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
              <!-- Ratio input -->
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
  name: "Dialog_NewSection",
  mixins: [CanonData, SecEdit],
  props: {},
  data: () => ({
    dialog: false,

    editedName: undefined,
    editedCode: undefined,
    editedRTP: undefined,
    editedTemperament: undefined,
    editedParentID: undefined,
    editedFreq: undefined,
    editedStrL: undefined,

    warningFig: undefined,
    warningCode: undefined,
    //warningTemperament: undefined,

    parentOptions: [{ code: undefined, id: undefined }],
  }),
  created() {
    this.dialog = true;
    this.initialize();
  },
  methods: {
    initialize: function() {
      let vue = this;
      this.parentOptions = (function() {
        let pitches = vue.s_pitches;
        let s = new Array(pitches.length);
        for (let i = 0; i < pitches.length; i++) {
          s[i] = {
            id: pitches[i],
            code: pitches[i] + ": " + vue.sec_data[pitches[i]].code, //.concat(pitches[i]),
          };
        }
        return s;
      })();

      this.editedParentID = this.parentOptions[
        this.parentOptions.length - 1
      ].id;

      let infoRTP;
      if (this.editedParentID > 0) {
        infoRTP = Object.assign(
          {},
          this.s_relInfo[this.editedParentID][
            this.sec_data[this.editedParentID].parent
          ].down
        );
      } else {
        infoRTP = {
          approximation: [1, 1],
          euler: 0,
          temperament: 0,
        };
      }

      this.editedRTP =
        this.ratioViewMode != 1 ? infoRTP.approximation : infoRTP.euler * 1200;
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
    },
    saveSection() {
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

      rtp = rtp + temperament;

      let section = {
        name: this.editedName,
        code: this.editedCode,
        rtp: rtp,
        parent: this.editedParentID,
      };
      this.$store.dispatch(`canon/ADD_SECTION`, section);
      this.dialog = false;
    },
  },
  watch: {
    editedName(newVal) {
      let newID = this.$store.getters[`canon/pool_names`].indexOf(newVal);
      if (newID >= 0) this.warningFig = "this name is taken";
      else this.warningFig = undefined;
    },
    editedCode(newVal) {
      let newID = this.$store.getters[`canon/pool_codes`].indexOf(newVal);
      if (newID >= 0) {
        this.warningCode = "this code is taken";
      } else this.warningCode = undefined;
    },
  },
  computed: {},
};
</script>

<style scoped></style>
