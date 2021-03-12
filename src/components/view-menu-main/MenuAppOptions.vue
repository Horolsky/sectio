<template>
  <v-container>
    <div>in development</div>
    <!--<v-list dense>
      <v-list-item>
        <v-list-item-title>Language</v-list-item-title>
        <v-list-item-content></v-list-item-content>
        <v-list-item-action></v-list-item-action>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>Options</v-list-item-title>
        <v-list-item-content></v-list-item-content>
        <v-list-item-action></v-list-item-action>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>About</v-list-item-title>
        <v-list-item-content></v-list-item-content>
        <v-list-item-action></v-list-item-action>
      </v-list-item>
    </v-list>-->

    <v-dialog v-if="drawer_content" v-model="drawer_dialog" max-width="500px">
      <v-card>
        <v-card-title>
          {{ drawer_content.name }}
        </v-card-title>
        <v-card-text>
          <v-list dense>
            <!-- SCHEMATA -->
            <v-list-item
              v-for="(item, i) in drawer_content.items"
              :key="i"
              @click="drawer_dialog = false"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "MenuAppOptions",
  props: {},
  components: {},
  data: () => ({
    drawer_dialog: false,
    drawer_content: null,
  }),
  created() {
    this.initialize();
  },
  computed: {},
  methods: {
    openDialog(content) {
      //:value="null"
      this.drawer_content = content;
      this.drawer_dialog = true;
    },
    initialize() {},
  },
  watch: {},
};
</script>

<style scoped></style>
