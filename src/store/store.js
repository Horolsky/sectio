/* eslint-disable no-console */
import Vuex from 'vuex'
import modules from './static-modules/index'


const debug = process.env.NODE_ENV !== 'production'

const store = {
    strict: debug,
    modules,
    actions: {
        REG_MODULE(_, { name, template, callback }) {
            this.registerModule(name, template, { preserveState: false });
            if (callback) callback();
        },
        UNREG_MODULE(_, name) {
            this.unregisterModule(name);
        },
    },
    // eslint-disable-next-line no-unused-vars
    install: (app, options) => {
        app.config.globalProperties.$store = this;
    }
};

export default new Vuex.Store(store);