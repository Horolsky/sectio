/* eslint-disable no-console */
export default {

    namespaced: true,
    state: {
        windowWidth: undefined,
        windowHeight: undefined,
        IG_portrait: false,
        touchOn: false,
        dialogIsActive: false,
        ratioViewMode: 0
    },
    mutations: {
        SET_UI_OPTION(state, { key, value }) {
            state[key] = value;
        },
        SET_SCREENSIZE(state, { width, height }) {
            state.windowWidth = width, state.windowHeight = height;
        },
        SET_RATIOVIEW(state, mode) {
            mode = parseInt(mode);
            if (mode < 0 || mode > 2) mode = 0;
            state.ratioViewMode = mode;
        }
    },
    getters: {
        GET_UI_OPTION: (state) => (key) => {
            return state[key];
        },
        portraitScreen: (state) => {
            return state.windowWidth < state.windowHeight;
        },
        smallScreen: (state) => {
            return state.windowWidth <= 600;
        },
        getScreenSize: (state) => {
            return [state.windowWidth, state.windowHeight];
        },
        windowWidth: (state) => {
            return state.windowWidth;
        },
        touchOn: (state) => {
            return state.touchOn;
        },
        dialogIsActive: (state) => {
            return state.dialogIsActive;
        }
    },
    actions: {
        SET_RATIOVIEW(ctx, payload) {
            ctx.commit('SET_RATIOVIEW', payload);
        },
        SET_UI_OPTION(ctx, payload) {
            ctx.commit('SET_UI_OPTION', payload);
        },
        SET_SCREENSIZE(ctx, payload) {
            ctx.commit('SET_SCREENSIZE', payload);
        }
    }
};
