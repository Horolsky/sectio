<template>
  <v-navigation-drawer
    v-model="dialog"
    app
    temporary
    overlay-color="black"
    overlay-opacity="0.5"
    right
    floating
    width="80px"
    color="rgba(0, 0, 0, 0)"
  >
    <v-container fluid fill-height class="px-2 py-2">
      <v-card
        color="blue-grey"
        height="100%"
        width="100%"
        class=" d-flex align-center flex-column py-2"
        dark
      >
        <!-- -->
        <RatioViewMode v-show="mode != 1" vertical backColor="blue-grey" />
        <v-icon v-show="mode != 1" disabled color="grey">mdi-dots-horizontal</v-icon>

        <WaveToggler v-show="mode != 2" vertical backColor="blue-grey" />
        <v-icon v-show="mode != 2" disabled color="grey">mdi-dots-horizontal</v-icon>
        <!-- ratioViewMode  activator -->

        <HintedButton
          v-if="mode == 2"
          @click="portrait = !portrait"
          :icon="
            portrait
              ? 'mdi-phone-rotate-landscape'
              : 'mdi-phone-rotate-portrait'
          "
          hintText="rotate infographic layout"
          elClass="my-2"
          :disabled="portraitScreen"
        />
        <v-spacer />
        <!--<span>{{ ratioViewMode }}</span>-->
      </v-card>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import WaveToggler from "./ctrl-sound/WaveToggler";
export default {
  name: "IG_options",
  props: {
    mode: Number,
    drawer: Boolean,
  },
  components: {
    WaveToggler,
  },
  data: () => ({
    //dialog: false,
    title: ["Table options", "Keyboard options", "Infographic options"],
    //ratioViewMode: 0,
  }),
  created() {
    this.initialize();
  },
  methods: {
    initialize: function() {
      this.dialog = true;
    },
  },
  computed: {
    dialog: {
      get() {
        return this.drawer;
      },
      set(val) {
        if (!val) this.$emit("onclose");
      },
    },
    portraitScreen: function() {
      return this.$store.getters[`uiOptions/portraitScreen`];
    },
    portrait: {
      get() {
        return this.GET_UI_OPTION("IG_portrait");
      },
      set(val) {
        this.SET_UI_OPTION("IG_portrait", val);
      },
    },
  },
};
</script>

<style></style>
