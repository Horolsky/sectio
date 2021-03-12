<script>
export default {
  computed: {
    rtpView: function() {
      if (this.sectionID === 0) return "root";
      else if (this.parentID != null) {
        let res;
        switch (this.ratioViewMode) {
          case 0:
            res = this.w_rtp_ptolemaic;
            break;
          case 1:
            res = this.w_rtp_ellis;
            break;
          case 2:
            res = this.w_rtp_mixed;
            break;
          default:
            res = this.w_rtp_ptolemaic;
        }
        return res;
      } else return null;
    },
    rtbView: function() {
      if (this.sectionID === 0) return "root";
      else {
        let res;
        switch (this.ratioViewMode) {
          case 0:
            res = this.w_rtr_ptolemaic;
            break;
          case 1:
            res = this.w_rtr_ellis;
            break;
          case 2:
            res = this.w_rtr_mixed;
            break;
          default:
            res = this.w_rtr_ptolemaic;
        }
        return res;
      }
    },
    w_rtp_ptolemaic: function() {
      let info = this.$store.getters[`canon/GET_PROPERTY`]("s_relInfo")[
        this.sectionID
      ][this.parentID];
      return this.getView_Ptolemaic(info.down, this.comma);
    },
    w_rtp_ellis: function() {
      let info = this.$store.getters[`canon/GET_PROPERTY`]("s_relInfo")[
        this.sectionID
      ][this.parentID];
      return this.getView_Ellis(info.down);
    },
    w_rtp_mixed: function() {
      let info = this.$store.getters[`canon/GET_PROPERTY`]("s_relInfo")[
        this.sectionID
      ][this.parentID];
      return this.getView_Mixed(info.down, this.comma);
    },
    w_rtr_ptolemaic: function() {
      let info = this.$store.getters[`canon/GET_PROPERTY`]("s_relInfo")[
        this.sectionID
      ][0];
      return this.getView_Ptolemaic(info.down, this.comma);
    },
    w_rtr_ellis: function() {
      let info = this.$store.getters[`canon/GET_PROPERTY`]("s_relInfo")[
        this.sectionID
      ][0];
      return this.getView_Ellis(info.down);
    },
    w_rtr_mixed: function() {
      let info = this.$store.getters[`canon/GET_PROPERTY`]("s_relInfo")[
        this.sectionID
      ][0];
      return this.getView_Mixed(info.down, this.comma);
    },
  },
};
</script>
