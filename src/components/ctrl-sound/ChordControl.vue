<template>
  <div>
    <v-navigation-drawer
      v-model="drawer_Chord"
      app
      clipped
      right
      mini-variant
      hide-overlay
      color="rgba(0, 0, 0, 0)"
      floating
      temporary
      style="width: 90px;"
    >
      <v-card
        flat
        :disabled="noData"
        color="rgba(0, 0, 0, 0)"
        class="d-flex flex-column-reverse"
      >
        <v-card-actions>
          <v-item-group background-color="rgba(0, 0, 0, 0)">
            <!-- POWER -->
            <v-btn
              @click.stop="powered = !powered"
              style="border-top-left-radius: 20px;"
              :class="`elevation-1 mb-1 blue-grey`"
            >
              <v-icon :color="powered ? 'white' : 'black'">{{
                powered ? "mdi-power-cycle" : "mdi-power"
              }}</v-icon>
              <!-- CHORD -->
            </v-btn>

            <div class="d-flex flex-column-reverse elevation-0">
              <v-btn
                v-for="n in intervals"
                :key="n"
                @click.stop="$sound.toggleChordDegree(n)"
                style="font-size: 125%;"
                :class="
                  `elevation-1 mb-1 ${
                    $sound.activeChord.includes(n)
                      ? btnColorOn
                      : btnColorOff
                  }`
                "
              >
                {{ `${n} ` }}
              </v-btn>
            </div>

            <!-- CREAR -->
            <v-btn
              @click.stop="$sound.toggleChordDegree(0)"
              style="border-bottom-left-radius: 20px;"
              :color="btnColorOff"
              :class="powered ? '' : 'disable-events'"
            >
              <v-icon :color="powered ? 'white' : 'grey'">{{
                $sound.activeChord.length > 0
                  ? "mdi-circle-off-outline"
                  : "mdi-circle-outline"
              }}</v-icon>
            </v-btn>
          </v-item-group>
        </v-card-actions>
      </v-card>
    </v-navigation-drawer>

    <div v-if="!touchOn && !dialogIsActive && powered">
      <Keypress
        v-for="icode in intervalcodes"
        :key="icode"
        :key-code="icode"
        event="keyup"
        @pressed="$sound.toggleChordDegree(intervalcodes.indexOf(icode))"
      />
    </div>
  </div>
</template>

<script>
//import Tone from "tone";

export default {
  name: "ChordControl",
  props: {
    drawer: Boolean,
  },
  components: {
    Keypress: () => import("vue3-keypress"),
  },
  data: () => ({
    powered: true,
    intervals: 16, //TODO user customisation
    intervalcodes: [],
  }),
  created() {
    this.initialize();
  },
  watch: {
    powered: function(newVal) {
      if (newVal === false) {
        this.$sound.toggleChordDegree(0);
      }
    },
    noData: function(newVal) {
      if (newVal) this.powered = false;
    },
  },
  computed: {
    noData: function() {
      return this.$store.getters.CURRENT_CANON == undefined;
    },
    btnColorOn: function() {
      return this.$vuetify.theme.dark
        ? ` white--text blue accent-4`
        : ` white--text blue accent-4`;
    },
    btnColorOff: function() {
      return `${
        this.powered ? "text--lighten-3" : "text--lighten-1"
      } blue-grey--text blue-grey`;
    },
    drawer_Chord: {
      get() {
        return this.drawer;
      },
      set(val) {
        if (!val) this.$emit("onclose");
      },
    },
  },

  methods: {
    initialize() {
      for (let i = 0; i <= 9; i++) {
        this.intervalcodes.push(i.toString().charCodeAt(0));
      }
    },
  },
};
</script>

<style scoped>
button {
  border-radius: 0%;
}

.disable-events {
  pointer-events: none;
}
</style>
