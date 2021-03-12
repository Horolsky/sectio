/* eslint-disable no-console */
export default {
    computed: {
        ratioViewMode: {
            get() {
                return this.$store.getters[`uiOptions/GET_UI_OPTION`]("ratioViewMode");
            },
            set(val) {
                this.$store.dispatch(`uiOptions/SET_RATIOVIEW`, val);
            },
        },
        IG_portrait: function () {
            return this.$store.getters[`uiOptions/GET_UI_OPTION`]("IG_portrait");
        },
        smallScreen: function () {
            return this.$store.getters["uiOptions/smallScreen"];
        },
        windowWidth: function () {
            return this.$store.getters["uiOptions/windowWidth"];
        },
        touchOn: function () {
            return this.$store.getters["uiOptions/touchOn"];
        },
        dialogIsActive: function () {
            return this.$store.getters["uiOptions/dialogIsActive"];
        },

    },
    methods: {
        GET_UI_OPTION(key) {
            return this.$store.getters[`uiOptions/GET_UI_OPTION`](key);
        },
        SET_UI_OPTION(key, value) {
            this.$store.dispatch("uiOptions/SET_UI_OPTION", { key, value });
        }
    }
};