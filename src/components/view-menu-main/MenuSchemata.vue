<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">Schemata</span>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" icon @click="dialog = false"
          ><v-icon>mdi-close-circle</v-icon></v-btn
        >
      </v-card-title>

      <v-card-text>
        <v-list dense class="ml-2">
          <SchemataSubfolder
            v-for="(key, i) in keys"
            :key="i"
            :content="register[key]"
            :title="key"
          />
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import getRegister from "../../assets/schemata/_schemata-register";
import SchemataSubfolder from "./menu-schemata/SchemataSubfolder";
export default {
  name: "SchemataMenu",
  props: {},
  components: {
    SchemataSubfolder,
  },
  data: () => ({
    dialog: false,
    register: undefined,
  }),
  created() {
    this.initialize();
  },
  methods: {
    initialize: function() {
      this.dialog = true;
      this.register = getRegister();
    }
  },
  computed: {
    keys() {
      return Object.getOwnPropertyNames(this.register).filter(
        (el) => el != "__ob__"
      );
    },
  },
};
</script>

<style scoped></style>
