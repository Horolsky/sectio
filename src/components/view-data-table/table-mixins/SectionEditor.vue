<script>
export default {
  computed: {
    tempView: function() {
      if (this.ratioViewMode == 0 && this.editedTemperament) {
        let mixed = Math.Canonis.getMixedFraction(this.editedTemperament);
        let temp = "";

        if (mixed.integer != 0) temp = temp.concat(` ${mixed.integer}`);
        if (mixed.dividend != 0) {
          temp = temp.concat(
            " " +
              mixed.dividend.toString().sup() +
              "/" +
              mixed.divisor.toString().sub()
          );
        }
        if (temp != "")
          temp = (mixed.sign > 0 ? " + " : " - ").concat(temp).concat(" ϰ"); //𝛞 ϰ &#120542;
        return temp;
      } else return "";
    },
    invalid: function() {
      return (
        this.warningFig != undefined || this.warningCode != undefined
        //|| this.warningTemperament != undefined
      );
    },
  },
  methods: {
    approximate: function(euler) {
      return this.$store.getters[`canon/findApproximation`](euler);
    },
  },
};
</script>
