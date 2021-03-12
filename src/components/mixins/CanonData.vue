<script>
export default {
  computed: {
    hasData: function() {
      return this.$store.state.tabsData.canons.length > 0;
    },
    canonID: function() {
      return this.$store.getters.CURRENT_CANON;
    },
    period: function() {
      return this.$store.getters[`canon/GET_PROPERTY`]("params").period;
    },
    comma: function() {
      return this.$store.getters[`canon/GET_PROPERTY`]("params").comma;
    },
    canonName: function() {
      return this.$store.getters[`canon/GET_PROPERTY`]("name");
    },
    sec_data: function() {
      return this.$store.getters[`canon/GET_PROPERTY`]("sec_data");
    },
    s_pitches: function() {
      return this.$store.getters[`canon/GET_PROPERTY`]("s_pitches");
    },
    s_relInfo: function() {
      return this.$store.getters[`canon/GET_PROPERTY`]("s_relInfo");
    },
    map_intervals: function() {
      return this.$store.getters[`canon/GET_PROPERTY`]("map_intervals");
    },
    map_color: function() {
      return this.$store.getters[`canon/map_color`];
    },
    //normalised ordered scale
    btnScale: function() {
      return this.$store.getters[`canon/GET_PROPERTY`]("map_scale").base.map(
        (el) => el.id
      );
    },
  },
  methods: {
    SET_PROPERTY(property, value) {
      this.$store.dispatch(`canon/SET_PROPERTY`, { property, value });
    },
    GET_PROPERTY: function(property) {
      return this.$store.getters[`canon/GET_PROPERTY`](property);
    },
  },
};
</script>
