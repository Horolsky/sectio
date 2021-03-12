/* eslint-disable no-console */
export default {
    watch: {
        dialog(val) {
            if (this.$parent.$parent.dialog != true) {
                this.$store.dispatch('uiOptions/SET_UI_OPTION', { key: 'dialogIsActive', value: val });
            }
            if (!val) {
                this.$emit("onclose");
            }
        },
    },
};