<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<template>
  <div>
    <v-list dense class="ml-2">
      <v-list-group
        append-icon="mdi-chevron-down"
        :active-class="$vuetify.theme.dark ? 'white--text' : 'black--text'"
      >
        <template v-slot:activator>
          <v-list-item-title
            >{{ title }}
            <v-btn
              v-if="content.description"
              icon
              x-small
              class="mx-2 mb-1"
              @click.stop="descr_dialog = true"
            >
              <v-icon>mdi-information-outline</v-icon></v-btn
            >
          </v-list-item-title>
        </template>

        <template v-slot:default>
          <v-list-item-group item v-for="(key, i) in keys" :key="i">
            <SchemataSubfolder
              v-if="typeof content[key] == 'object'"
              :content="content[key]"
              :title="key"
            />
            <div v-else class="d-flex justify-end">
              <v-btn
                text
                small
                style="text-transform: none; font-weight: 400;"
                v-html="key"
                @click.stop="loadSchema(content[key])"
              >
              </v-btn>
            </div>
          </v-list-item-group>
        </template>
      </v-list-group>
    </v-list>
    <v-dialog v-model="descr_dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ title }}</span>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" icon @click="descr_dialog = false"
            ><v-icon>mdi-close-circle</v-icon></v-btn
          >
        </v-card-title>
        <v-card-subtitle class="text-center my-2">{{
          "SET DESCRIPTION"
        }}</v-card-subtitle>
        <v-card-text v-html="content.description" />
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: "SchemataSubfolder",
  props: {
    content: Object,
    title: String,
  },
  data: () => ({
    descr_dialog: false,
  }),
  computed: {
    keys() {
      return Object.getOwnPropertyNames(this.content).filter(
        (el) => el != "__ob__" && el != "description"
      );
      /*let keys = Object.getOwnPropertyNames(this.content);
      let sortedKeys = [];
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] == "__ob__") continue;
        if (typeof keys[i] == "object") {
          sortedKeys = [keys[i]].concat(sortedKeys);
        } else if (typeof keys[i] == "string") {
          sortedKeys.push(keys[i]);
        }
      }
      return sortedKeys;*/
    },
    subfolders() {
      return this.keys.filter(
        (el) => typeof this.content[el] == "object" && el != "_"
      );
    },
    schemas() {
      return this.keys.filter(
        (el) => typeof this.content[el] == "string" && el != "description"
      );
    },
  },
  methods: {
    loadSchema(schema) {
      this.$store.dispatch("LOAD_SCHEMA", JSON.parse(schema));
    },
  },
};
</script>

<style scoped>
.set-description {
}
</style>
