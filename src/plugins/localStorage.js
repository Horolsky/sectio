/* eslint-disable no-console */


const localStore = {

    schemata: [],

    update: () => {
        let LS_Reg = JSON.parse(localStorage.getItem('schemataRegister'));

        localStore.schemata = LS_Reg ? LS_Reg : [];
    },


    setSchema(schema) {
        let key = 1;
        while (localStore.schemata.findIndex((element) => element.key === `LS-${key}`) >= 0) {
            key++;
        }
        key = `LS-${key}`;
        let canon = JSON.parse(schema);
        localStorage.setItem(key, schema);
        //REGISTRATION
        let LS_Reg = JSON.parse(localStorage.getItem('schemataRegister'));
        if (!Array.isArray(LS_Reg)) LS_Reg = [];
        LS_Reg.push({
            key: key,
            code: canon.code,
            name: canon.name,
            date: new Date().toLocaleString()
        });
        localStorage.setItem('schemataRegister', JSON.stringify(LS_Reg));

        localStore.update();
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
        localStore.update();
    },
    getItem(key) {
        return localStorage.getItem(key);
    },

    // eslint-disable-next-line no-unused-vars
    install: (app, options) => {
        app.config.globalProperties.$localStorage = localStore;
    }
}

export default localStore;