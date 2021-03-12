<script>
export default {
  methods: {
    getView_Ptolemaic(intv, comma) {
      let result = intv.approximation.join(" : ");
      if (Math.abs(intv.temperament) > comma / 100) {
        let temp = "";
        temp = temp.concat(
          intv.temperament > 0 ? "&nbsp;+&nbsp;" : "&nbsp;-&nbsp;"
        );
        let mixed = Math.Canonis.getMixedFraction(
          Math.Canonis.unlimFractionAppr(intv.temperament / comma, 99)
        );
        if (mixed.integer != 0) temp = temp.concat(` ${mixed.integer}`);
        if (mixed.dividend != 0) {
          temp = temp.concat(
            "&nbsp;" +
              mixed.dividend.toString().sup() +
              "/" +
              mixed.divisor.toString().sub()
          );
        }
        result = result.concat(temp.sup());
      }
      return result;
    },
    getView_FullPtolemaic(info, comma) {
      let i_up = this.getView_Ptolemaic(info.up, comma);
      let i_down = this.getView_Ptolemaic(info.down, comma);
      return [i_up, i_down]; //`<center>${i_up}&nbsp;&nbsp;//&nbsp;&nbsp;${i_down}</center>`;
      //possibly return array for reversion optiion
    },
    getView_Mixed(intv, comma) {
      let result = intv.approximation.join("&nbsp;:&nbsp;");
      if (Math.abs(intv.temperament) > comma / 100) {
        //TODO option: comma precision
        let temp = `${
          intv.temperament > 0 ? "&nbsp;+&nbsp;" : "&nbsp;-&nbsp;"
        }${Math.abs(1200 * intv.temperament).toFixed(2)}&nbsp;¢`;
        result = result.concat(temp.sup());
      }
      return result;
    },
    getView_FullMixed(info, comma) {
      let i_up = this.getView_Mixed(info.up, comma);
      let i_down = this.getView_Mixed(info.down, comma);
      return [i_up, i_down]; //`<center>${i_up}&nbsp;&nbsp;//&nbsp;&nbsp;${i_down}</center>`;
      //possibly return array for reversion optiion
    },
    getView_Ellis(intv) {
      let result = Math.abs(intv.euler * 1200).toFixed(2);
      result = (intv.euler > 0 ? "&nbsp;+&nbsp;" : "&nbsp;-&nbsp;").concat(
        result
      );
      //.concat("&nbsp;¢");
      return result;
    },
    getView_FullEllis(info, comma) {
      let i_up = this.getView_Ellis(info.up, comma);
      let i_down = this.getView_Ellis(info.down, comma);
      return [i_up, i_down]; //`<center>${i_up}&nbsp;&nbsp;//&nbsp;&nbsp;${i_down}</center>`;
      //possibly return array for reversion optiion
    },
  },
};
</script>
