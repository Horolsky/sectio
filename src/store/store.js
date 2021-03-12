/* eslint-disable no-console */
import Vue from 'vue'
import Vuex from 'vuex'
import modules from './static-modules/index'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = {
    modules,
    actions: {
        REG_MODULE(_, { name, template, callback }) {
            this.registerModule(name, template, { preserveState: false });
            if (callback) callback();
        },
        UNREG_MODULE(_, name) {
            this.unregisterModule(name);
            //if (callback) callback();
        },
    },
    strict: debug
};

export default new Vuex.Store(store);