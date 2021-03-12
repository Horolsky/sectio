/* eslint-disable no-console */
import Vue from 'vue';

let privateProps = {

};

let state = {

    //gettrs setters 
}

// shared data storage plugin
class AppDataStore {
    constructor(data = {}) {
        this.storeVM = new Vue({ data })
    }
    get state() {
            return this.storeVM.$data
        }
        //static methods
    start() {

    }

}
const dbManager = {
    Store: AppDataStore,
    install(Vue, options) {
        Vue.mixin({
            beforeCreate() {
                this.$dbManager = options.store
            }
        })
    }
}

// Install the plugin, and inject a new store instance
Vue.use(dbManager, {
    store: new dbManager.Store(state)
})

export default dbManager;