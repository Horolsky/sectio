/* eslint-disable no-console */
import Vue from 'vue';

let storageRegistry = {
    _schemata: [],
};


let state = {
    update() {
        let LS_Reg = JSON.parse(localStorage.getItem('schemataRegister'));

        this.schemataRegister = LS_Reg ? LS_Reg : [];
    },
    get schemataRegister() {
        return storageRegistry._schemata;
    },
    set schemataRegister(val) {
        if (Array.isArray(val)) storageRegistry._schemata = val;
    },
    setSchema(schema) {
        let key = 1;
        while (this.schemataRegister.findIndex((element) => element.key === `LS-${key}`) >= 0) {
            key++;
        }
        key = `LS-${key}`;

        localStorage.setItem(key, schema);
        //REGISTRATION
        let LS_Reg = JSON.parse(localStorage.getItem('schemataRegister'));
        if (!Array.isArray(LS_Reg)) LS_Reg = [];
        LS_Reg.push({
            key: key,
            code: schema.code,
            name: schema.name,
            date: new Date().toLocaleString()
        });
        localStorage.setItem('schemataRegister', JSON.stringify(LS_Reg));

        this.update();
    },
    storeCanon(json, id) {
        localStorage.setItem('canonData-' + id, json);
    },
    getCanon(id) {
        return localStorage.getItem('canonData-' + id);
    },
    removeSchema(key) {
        localStorage.removeItem(key);
        let LS_Reg = JSON.parse(localStorage.getItem('schemataRegister'));
        if (Array.isArray(LS_Reg)) LS_Reg.splice(LS_Reg.findIndex((element) => element.key === key), 1);
        localStorage.setItem('schemataRegister', JSON.stringify(LS_Reg));
        this.update();
    },
    getItem(key) {
        return localStorage.getItem(key);
    }
}

class AppDataStore {
    constructor(data = {}) {
        this.storeVM = new Vue({ data })
    }
    get state() {
        return this.storeVM.$data
    }
}
const LocalStorageManager = {
    Store: AppDataStore,
    install(Vue, options) {
        Vue.mixin({
            beforeCreate() {
                this.$localStorage = options.store
            }
        })
    }
}

Vue.use(LocalStorageManager, {
    store: new LocalStorageManager.Store(state)
})

export default LocalStorageManager;