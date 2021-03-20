<template>
  <v-list dense class="ml-2">
    <v-list-item @click.stop="storageDialog = !storageDialog">
      <v-list-item-title>Local storage</v-list-item-title>
    </v-list-item>

    <v-list-item @click.stop="importDialog = !importDialog">
      <v-list-item-title>Import file</v-list-item-title>
    </v-list-item>

    <v-list-item @click.stop="exportDialog = !exportDialog">
      <v-list-item-title>Export file</v-list-item-title>
    </v-list-item>

    <v-dialog v-model="storageDialog" max-width="500px">
      <v-card>
        <v-card>
          <v-card-subtitle>Local storage:</v-card-subtitle>
          <v-card-text>
            <v-container>
              <v-row
                dense
                v-for="schema in schemataLocalRegister"
                :key="schema.key"
              >
                <v-col cols="2">
                  <div>{{ schema.code }}</div>
                </v-col>
                <v-col cols="3">
                  <div>{{ schema.name }}</div>
                </v-col>
                <v-col cols="5">
                  <div>{{ schema.date }}</div>
                </v-col>
                <v-col cols="1">
                  <v-btn
                    icon
                    @click.stop="$localStorage.state.removeSchema(schema.key)"
                  >
                    <v-icon>mdi-file-remove-outline</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="1">
                  <v-btn icon @click.stop="loadLocalSchema(schema.key)">
                    <v-icon>mdi-file-upload-outline</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
            <!--<v-list dense>
              <v-list-item
                v-for="schema in schemataLocalRegister"
                :key="schema.key"
              >
              
                <v-list-item-title>{{ schema.code }}</v-list-item-title>
                <v-list-item-action>
                  <v-btn
                    icon
                    @click.stop="$localStorage.state.removeSchema(schema.key)"
                  >
                    <v-icon>mdi-file-remove-outline</v-icon>
                  </v-btn>
                  <v-btn icon @click.stop="loadLocalSchema(schema.key)">
                    <v-icon>mdi-file-upload-outline</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-list-item
                v-if="$localStorage.state.schemataRegister.length == 0"
              >
                <v-list-item-title>Local storage is empty</v-list-item-title>
              </v-list-item>
            </v-list>-->
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-subtitle>Select schema to save locally:</v-card-subtitle>
          <v-card-actions>
            <v-select
              v-model="outputCanon"
              :items="canons"
              
            ></v-select>
            <v-btn icon @click.stop="saveLocalSchema(outputCanon)">
              <v-icon>mdi-content-save-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </v-dialog>
    <v-dialog v-model="importDialog" max-width="500px">
      <v-card>
        <v-card-title>Import schema</v-card-title>
        <v-card-actions>
          <v-file-input
            accept=".canon"
            label="File input"
            v-model="inputFile"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="exportDialog" max-width="500px">
      <v-card>
        <v-card-title>Export schema</v-card-title>
        <v-card-actions>
          <v-select
            v-model="outputCanon"
            :items="canons"
            
          ></v-select>
          <!-- 
            item-text="code"
            item-value="id"
          -->
          <v-btn
            link
            :download="outputFileName"
            :href="outputURL"
            :disabled="outputURL === null"
          >
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-list>
</template>

<script>
export default {
  name: "MenuFileIO",
  props: {},
  components: {
    //
  },
  data: () => ({
    importDialog: false,
    exportDialog: false,
    storageDialog: false,
    openDialog: false,
    inputFile: null,
    outputCanon: null,
    outputURL: null,
    outputFileName: undefined,
  }),
  created() {
    this.initialize();
  },
  computed: {
    canons: {
      get() {
        let cns = this.$store.state.tabsData.canons.slice();
        return cns.map((el, i) => Object({value: i, text: el}));
      },
      set() {},
    },
    schemataLocalRegister: function() {
      return this.$localStorage.state.schemataRegister;
    },
  },
  methods: {
    initialize() {},
    loadLocalSchema(key) {
      let schema = JSON.parse(this.$localStorage.state.getItem(key));
      this.$store.dispatch("LOAD_SCHEMA", schema);
      this.storageDialog = false;
    },
    saveLocalSchema(canonID) {
      let schema = this.$localStorage.state.getCanon(canonID);
      this.$localStorage.state.setSchema(schema);
    },
    removeLocalSchema(key) {
      this.$localStorage.state.removeSchema(key);
    },
  },
  watch: {
    importDialog(val) {
      if (val) this.exportDialog = false;
    },
    exportDialog(val) {
      if (val) this.importDialog = false;
    },
    inputFile(file) {
      if (file != null) {
        let fl = new FileReader();
        let vue = this;
        fl.onload = (e) => {
          //TODO errors catch
          let data = JSON.parse(e.target.result);
          vue.$store.dispatch("LOAD_SCHEMA", data);
        };

        fl.readAsText(file);
      }
      this.importDialog = false;
    },
    outputCanon(id) {
      let schema = this.$localStorage.state.getCanon(id);
      const blob = new Blob([schema], { type: "text/plain" });
      this.outputFileName = this.canons[id].text + ".canon";
      this.outputURL = window.URL.createObjectURL(blob);
    },
  },
};
</script>

<style scoped></style>
