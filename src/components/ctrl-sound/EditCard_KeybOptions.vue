<template>
  <!-- 

<EditCard_Factorisation
                v-if="dialog_editSec"
                @onclose="dialog_editSec = false"
                :canon="canon"
              />

-->
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ title }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row no-gutters>
            <v-col cols="5">
              <v-select v-model="mode" :items="modeOptions" />
              <v-text-field
                v-model="numOfCols"
                type="number"
                min="1"
                max="20"
                prefix=" "
                hint="max: 20"
                persistent-hint
                label="Number of columns"
                disabled
              />
            </v-col>
            <v-col cols="1">
              <div
                style="padding-top: 12px; margin-top: 8px; height: 100%; text-align: center;"
              >
                :
              </div>
            </v-col>
            <v-col cols="5">
              <v-text-field
                v-model="numOfRows"
                type="number"
                prefix=" "
                hint="number of rows"
                persistent-hint
                disabled
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click="saveOptions()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Options_TouchKeyboard",
  props: {
    cols: Number,
    total: Number,
    organMode: Boolean,
  },
  data: () => ({
    dialog: false,
    title: "Touch keyboard options",
    numOfCols: 1,
    modeOptions: ["Organ", "Cembalo"],
    mode: "",
  }),
  created() {
    this.initialize();
  },
  methods: {
    initialize: function() {
      this.dialog = true;
      this.numOfCols = this.cols;
      this.mode = this.organMode ? this.modeOptions[0] : this.modeOptions[1];
    },
    saveOptions() {
      this.$emit("onsave", {
        cols: parseInt(this.numOfCols),
        rows: parseInt(this.numOfRows),
        organMode: this.mode === this.modeOptions[0],
      });
      this.dialog = false;
    },
  },
  computed: {
    numOfRows: function() {
      let rows = Math.floor(this.total / this.numOfCols);
      if (rows == 0) rows = 1;
      return rows;
    },
  },
};
</script>

<style scoped></style>
