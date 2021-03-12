<script>
export default {
  computed: {
    comma: function() {
      return this.$store.getters[`canon/GET_PROPERTY`]("params").comma;
    },
    parentID: function() {
      return this.$store.state.canon.sec_data[this.sectionID].parent;
    },
    parentCode: function() {
      return this.parentID != null
        ? this.$store.getters[`canon/getViewCode`](this.parentID)
        : null;
    },
    denseInfo: function() {
      return `${this.rtpView} ${
        this.parentCode ? "<br/>to " + this.parentCode : ""
      }`;
    },
    noteName: function() {
      return this.$store.state.canon.sec_data[this.sectionID].name;
    },
    noteCode: function() {
      return this.$store.state.canon.sec_data[this.sectionID].code;
    },
    childrenInfo: function() {
      let children = this.$store.getters[`canon/map_children`][this.sectionID];
      return children
        .map((el) => this.$store.getters[`canon/getViewCode`](el))
        .join(" ");
    },
    equivInfo: function() {
      let equivs = [];
      let data = this.$store.getters[`canon/GET_PROPERTY`]("sec_data");
      let getViewCode = this.$store.getters[`canon/getViewCode`];
      for (let i = 0; i < data.length; i++) {
        let trgt = data.keys[i];
        if (trgt == this.sectionID) continue;
        else {
          if (
            Math.abs(data[trgt].rtr - data[this.sectionID].rtr) % this.period <
            10 ** -12
          )
            equivs.push(trgt);
        }
      }
      if (equivs.length > 0)
        return equivs.map((el) => getViewCode(el)).join(", ");
      else return null;
    },
    freq: function() {
      let freq = this.$store.getters[`canon/map_freq`][this.sectionID];
      return Math.round(freq * 100) / 100;
    },
    color: function() {
      return this.$store.getters[`canon/map_color`][this.sectionID];
    },
    strL: function() {
      let rtr = this.$store.state.canon.sec_data[this.sectionID].rtr;
      let baseStrL = this.$store.getters[`canon/GET_PROPERTY`]("baseStrL");
      return Math.round((100 * baseStrL) / 2 ** rtr) / 100;
    },
  },
};
</script>
