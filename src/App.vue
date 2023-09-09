<template>
  <v-app id="app">
    <notifications
        classes="notification-vox"
        group="vox"
        position="bottom left"
        :max="1"
        :ignoreDuplicates="true"
      />
    <!-- App toolbar -->
    <v-app-bar app clipped-right color="blue-grey" dark>
      <!-- main menu -->
      <HintedButton
        @click="drawer_L = !drawer_L"
        icon="mdi-menu"
        :hintText="drawer_L ? 'close menu' : 'open menu'"
      />
      <v-toolbar-title>Sectio Canonis</v-toolbar-title>
      <v-spacer />

      <!-- dataViewMode  activator -->
      <v-btn-toggle
        v-model="dataViewMode"
        rounded
        mandatory
        background-color="blue-grey"
        borderless
        class="mx-2"
      >
        <HintedButton
          :active="dataViewMode == 0"
          elClass="mx-0"
          icon="mdi-view-list"
          hintText="open schemata table"
        />
        <HintedButton
          :active="dataViewMode == 1"
          elClass="mx-0"
          icon="mdi-piano"
          hintText="open keyboard"
        />
        <HintedButton
          :active="dataViewMode == 2"
          elClass="mx-0"
          icon="mdi-chart-donut"
          hintText="open infographic table"
        />
      </v-btn-toggle>

      <!-- ChordCtrl drawer activator -->
      <HintedButton
        @click="drawer_Chord = !drawer_Chord"
        icon="mdi-playlist-music"
        :active="drawer_Chord"
        :hintText="drawer_Chord ? 'close chord control' : 'open chord control'"
      />
      <!-- Dataview mode options drawer -->
      <HintedButton
        @click="drawer_options = !drawer_options"
        icon="mdi-cog"
        :active="drawer_options"
        :hintText="
          drawer_options ? 'close chord control' : 'open chord control'
        "
      />
    </v-app-bar>
    <!-- Content Tabs -->
    <v-main v-if="!waitForUserGesture">
      <TabsData :dataViewMode="dataViewMode" />
    </v-main>
    <!-- Menu Accordion -->
    <v-navigation-drawer v-model="drawer_L" app temporary>
      <v-list>
        <v-list-item @click.stop="loadBlancSchema()">
          <v-list-item-icon>
            <v-icon>mdi-plus-circle</v-icon>
          </v-list-item-icon>

          <v-list-item-title>New Schema</v-list-item-title>
        </v-list-item>

        <v-list-item @click.stop="MenuSchemata = true">
          <v-list-item-icon>
            <v-icon>mdi-bookshelf</v-icon>
          </v-list-item-icon>

          <v-list-item-title
            >Schemata
            <MenuSchemata v-if="MenuSchemata" @onclose="MenuSchemata = false" />
          </v-list-item-title>
        </v-list-item>

        <v-list-group prepend-icon="mdi-folder-open">
          <template v-slot:activator>
            <v-list-item-title>File</v-list-item-title>
          </template>
          <MenuFileIO />
        </v-list-group>

        <v-list-group prepend-icon="mdi-book-open-page-variant">
          <template v-slot:activator>
            <v-list-item-title>Info</v-list-item-title>
          </template>
          <!-- MenuAppInfo -->
          <MenuInfo />
        </v-list-group>

        <v-list-group prepend-icon="mdi-cogs">
          <template v-slot:activator>
            <v-list-item-title>App Options</v-list-item-title>
          </template>
          <!-- MenuAppOptions -->
          <MenuAppOptions />
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-footer
      app
      dark
      class="white--text font-weight-thin footer-bar"
      height="30px"
      style="align-content: center; font-size: 14px;"
    >
      <span>
        Developed by A. Horolsky
      </span>
      <!-- sound on/off -->
      <v-spacer />
      <HintedButton
        @click="$sound.state.mute = !$sound.state.mute"
        :icon="$sound.state.mute ? 'mdi-volume-off' : 'mdi-volume-high'"
        :color="$sound.state.mute ? 'black' : 'white'"
        :hintText="$sound.state.mute ? 'mdi-volume-off' : 'mdi-volume-high'"
        :elClass="smallScreen ? 'mx-0' : 'mx-2'"
        size="medium"
      />
      <!-- theme switch -->
      <HintedButton
        @click="$vuetify.theme.dark = !$vuetify.theme.dark"
        icon="mdi-theme-light-dark"
        :color="$vuetify.theme.dark ? 'black' : 'white'"
        :hintText="
          $vuetify.theme.dark ? 'switch to light theme' : 'switch to dark theme'
        "
        size="medium"
        :elClass="
          `${$vuetify.theme.dark ? 'white' : 'black'}${
            smallScreen ? 'mx-0' : 'mx-2'
          }`
        "
      />

    <!-- repo link -->
    <v-tooltip top open-delay="1000">
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            href="https://github.com/Horolsky/sectio-js"
            icon
            light
            color="white"
            :class="smallScreen ? '' : 'mx-2'"
            ><v-icon i size="medium">mdi-github</v-icon>
          </v-btn>
        </template>
        <span>GitHub repo</span>
      </v-tooltip>
    </v-footer>

    <v-dialog v-model="waitForUserGesture" max-width="500px" persistent>
      <v-card>
        <v-card-actions>
          <v-btn text v-html="'START'" @click="start" x-large width="100%" />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- OPTIONS -->
    <ChordControl
      ref="ChordControl"
      :drawer="drawer_Chord"
      @onclose="drawer_Chord = false"
    />
    <TabsOptions
      :drawer="drawer_options"
      @onclose="drawer_options = false"
      :mode="dataViewMode"
    />
  </v-app>
</template>

<script>
import TabsData from "./components/TabsData";
import TabsOptions from "./components/TabsUI_options";

import MenuFileIO from "./components/view-menu-main/MenuFileIO";
import MenuAppOptions from "./components/view-menu-main/MenuAppOptions";
import MenuInfo from "./components/view-menu-main/MenuInfo";
import MenuSchemata from "./components/view-menu-main/MenuSchemata";
import ChordControl from "./components/ctrl-sound/ChordControl";

export default {
  name: "App",

  components: {
    MenuSchemata,
    TabsData,
    TabsOptions,
    MenuFileIO,
    MenuAppOptions,
    MenuInfo,
    ChordControl,
  },
  props: {
    source: String,
  },
  data: () => ({
    MenuSchemata: false,
    waitForUserGesture: true,
    dataViewMode: 0,
    sections: {},
    drawer_L: null,
    drawer_Chord: false,
    drawer_options: false,
    starter_canon: {
      name: "Just C-maj",
      code: "just",
      description: "simple 5-limit diatonic",
      baseFreq: 130,
      baseStrL: 1200,
      params: {
        limit: 5,
        range: 64,
        period: 1,
      },
      sections: [
        {
          name: "C",
          rtp: 0,
        },
        {
          name: "D",
          parent: 0,
          rtp: 0.16992500144231237,
        },
        {
          name: "E",
          parent: 0,
          rtp: 0.32192809488736235,
        },
        {
          name: "F",
          parent: 0,
          rtp: 0.41503749927884376,
        },
        {
          name: "G",
          parent: 0,
          rtp: 0.5849625007211562,
        },
        {
          name: "A",
          parent: 0,
          rtp: 0.7369655941662062,
        },
        {
          name: "B",
          parent: 0,
          rtp: 0.9068905956085185,
        },
      ],
    },
    new_canon: {
      name: "New Schema",
      code: "new",
      description: "",
      baseFreq: 220,
      baseStrL: 1200,
      params: {
        limit: 5,
        range: 24,
        period: 1,
      },
      sections: [
        {
          name: "Г",
          rtp: 0,
        },
      ],
    },
  }),
  created() {
    this.initialize();
  },
  watch: {
    drawer_L(val) {
      this.SET_UI_OPTION("dialogIsActive", val);
    },
  },
  methods: {
    start() {
      this.waitForUserGesture = false;
      this.$sound.start();
    },
    log(message) {
      // eslint-disable-next-line no-console
      console.log(message);
    },
    initialize() {
      this.$localStorage.state.update();
      this.resetWindowWidth();
      window.addEventListener("resize", this.resetWindowWidth);
      this.$vuetify.theme.dark = true;

      //TODO put this to db
      if (this.$store.state.tabsData.canons.length < 1) {
        this.$store.dispatch("LOAD_SCHEMA", this.starter_canon);
      }

      //for touchscreen UI
      //let state = this.$globalUI.state;
      let vue = this;
      window.addEventListener("touchstart", function onFirstTouch() {
        vue.SET_UI_OPTION("touchOn", true);
        window.removeEventListener("touchstart", onFirstTouch, false);
      });
    },
    loadBlancSchema() {
      this.$store.dispatch("LOAD_SCHEMA", this.new_canon);
    },

    resetWindowWidth() {
      clearTimeout(delay); // clear current timer if any
      let self = this;
      let delay = setTimeout(function() {
        self.$store.commit("uiOptions/SET_SCREENSIZE", {
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 300);
    },
  },
};
</script>

<style>
/*.v-btn-toggle*/
.blue-grey .v-icon {
  color: white !important;
  opacity: 0.4;
}
.blue-grey .btn-on .v-icon,
.blue-grey .btn-on .btn-txt {
  opacity: 1 !important;
}
.blue-grey .btn-off .v-icon,
.blue-grey .btn-off .btn-txt {
  opacity: 0.4 !important;
}
.footer-bar {
  background-color: grey;
}
.notification-vox {
  margin: 0 5px 5px;
  padding: 10px;
  font-size: 20px;
  border-left: 5px solid purple;
  background-color: #607D8B !important;
  color:wheat !important;
}
/*
.btn-group-btn-on .v-icon.theme--dark {
  color: white !important;
}
.btn-group-btn-on .v-icon.theme--light {
  color: white !important;
}
.btn-group-btn-off .v-icon.theme--dark {
  color: darkgrey !important;
}
.btn-group-btn-off .v-icon.theme--light {
  color: grey !important;
}*/
</style>
