<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Schema info</span>
        <v-spacer></v-spacer>
        <v-btn
          v-if="disableEdit"
          color="blue darken-1"
          icon
          @click="dialog = false"
          ><v-icon>mdi-close-circle</v-icon></v-btn
        >
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row no-gutters>
            <v-col>
              <!-- Label Name -->
              <div>Name:</div>
              <!-- Name view card -->
              <v-card
                v-if="disableNameEdit"
                width="100%"
                min-height="56px"
                class="mb-8"
              >
                <v-card-text
                  :class="$vuetify.theme.dark ? `white--text` : `black--text`"
                  style="font-size: 16px;"
                >
                  <v-row>
                    <div class="ml-2">{{ editedName }}</div>
                    <v-spacer />
                    <v-icon class="mr-2" @click="disableNameEdit = false"
                      >mdi-pencil</v-icon
                    >
                  </v-row></v-card-text
                >
              </v-card>
              <!-- Name edit card -->
              <v-text-field
                v-else
                v-model="editedName"
                full-width
                outlined
                autofocus
              >
              </v-text-field>

              <!-- Shortcode Name -->
              <div class="line">
                Shortcode:

                <InfoHint
                  hintText="shortcode for data referencing and filename"
                  size="medium"
                  color="grey"
                  delay="100"
                  elClass="ml-2"
                />
              </div>
              <!-- Shortcode view card -->
              <v-card
                v-if="disableCodeEdit"
                width="100%"
                min-height="56px"
                class="mb-8"
              >
                <v-card-text
                  :class="$vuetify.theme.dark ? `white--text` : `black--text`"
                  style="font-size: 16px;"
                >
                  <v-row>
                    <div class="ml-2">{{ editedShortcode }}</div>
                    <v-spacer />
                    <v-icon class="mr-2" @click="disableCodeEdit = false"
                      >mdi-pencil</v-icon
                    >
                  </v-row></v-card-text
                >
              </v-card>
              <!-- Shortcode edit card -->
              <v-text-field
                v-else
                v-model="editedShortcode"
                full-width
                outlined
                autofocus
              >
              </v-text-field>

              <!-- Description Name -->
              <div>Description:</div>
              <!-- Description view card -->
              <v-card
                v-if="disableDescrEdit"
                width="100%"
                min-height="150px"
                class="mb-8"
              >
                <v-card-text
                  :class="$vuetify.theme.dark ? `white--text` : `black--text`"
                  style="font-size: 16px;"
                >
                  <v-row>
                    <div class="ml-2">{{ editedDescription }}</div>
                    <v-spacer />
                    <v-icon class="mr-2" @click="disableDescrEdit = false"
                      >mdi-pencil</v-icon
                    >
                  </v-row></v-card-text
                >
              </v-card>
              <!-- Description edit card -->
              <v-textarea
                v-else
                v-model="editedDescription"
                full-width
                outlined
                autofocus
              >
              </v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <!-- Edition save/cancel -->
      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="disableEdit"
          color="blue darken-1"
          text
          @click="updateEditingInfo()"
          >Cancel</v-btn
        >
        <v-btn
          :disabled="disableEdit"
          color="blue darken-1"
          text
          @click="saveCanonInfo()"
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
  components: {},
  data: () => ({
    dialog: false,
    title: "Canon details",
    disableNameEdit: true,
    disableCodeEdit: true,
    disableDescrEdit: true,

    editedName: "",
    editedShortcode: "",
    editedDescription: "",
  }),
  created() {
    this.initialize();
  },
  methods: {
    initialize: function() {
      this.dialog = true;
      this.updateEditingInfo();
    },
    updateEditingInfo() {
      this.editedName = this.canonName;
      this.editedShortcode = this.canonShortcode;
      this.editedDescription = this.canonDescription;

      this.disableNameEdit = true;
      this.disableCodeEdit = true;
      this.disableDescrEdit = true;
    },
    saveCanonInfo() {
      this.canonName = this.editedName;
      this.canonShortcode = this.editedShortcode;
      this.canonDescription = this.editedDescription;

      this.disableNameEdit = true;
      this.disableCodeEdit = true;
      this.disableDescrEdit = true;
    },
    SET_PROPERTY(property, value) {
      this.$store.dispatch(`canon/SET_PROPERTY`, { property, value });
    },
  },
  computed: {
    canonName: {
      get: function() {
        return this.$store.getters[`canon/GET_PROPERTY`]("name");
      },
      set: function(val) {
        this.SET_PROPERTY("name", val);
      },
    },
    canonShortcode: {
      get: function() {
        return this.$store.getters[`canon/GET_PROPERTY`]("code");
      },
      set: function(val) {
        this.SET_PROPERTY("code", val);
      },
    },
    canonDescription: {
      get: function() {
        return this.$store.getters[`canon/GET_PROPERTY`]("description");
      },
      set: function(val) {
        this.SET_PROPERTY("description", val);
      },
    },
    disableEdit: function() {
      return (
        this.disableNameEdit && this.disableCodeEdit && this.disableDescrEdit
      );
    },
  },
};
</script>

<style scoped>
.ratio-align-right input {
  text-align: right;
  /*not working with style attr on component */
}
.line {
  display: inline-flex;
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
