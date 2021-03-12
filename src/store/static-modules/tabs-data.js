/* eslint-disable no-console */
import { getLimitedRatioDict } from '../../utility/math-canonis';
export default {

    //namespaced: false,
    state: {
        canons: [],
        currentCanonID: undefined,
        ratioDict: [],
    },
    mutations: {
        _SET_CURRENT_CANON(state, canonID) {
            if (canonID === undefined) return;
            if (state.canons.length > canonID) {
                state.currentCanonID = parseInt(canonID);
                localStorage.setItem("currentCanonID", state.currentCanonID)
            } else {
                state.currentCanonID = undefined;
                localStorage.setItem("currentCanonID", "")
            }
        },
        REG_CANON(state, code) {
            state.canons.push(code);
        },
        _DISPOSE_CANON(state, canonID) {
            if (canonID >= state.canons.length) throw "dispose error, invalid id";
            state.canons.splice(canonID, 1);
            localStorage.removeItem(`canonData-` + canonID);
            sessionStorage.removeItem(`canonMaps-` + canonID);
            for (let i = canonID + 1; i <= state.canons.length; i++) {
                localStorage.setItem(`canonData-` + (i - 1), localStorage.getItem(`canonData-` + i));
                localStorage.removeItem(`canonData-` + i);
                sessionStorage.setItem(`canonMaps-` + (i - 1), sessionStorage.getItem(`canonMaps-` + i));
                sessionStorage.removeItem(`canonMaps-` + i);
            }

            if (state.canons.length == 0) {
                state.currentCanonID = undefined;
                localStorage.setItem("currentCanonID", "")
            } else {
                if (state.canons.length > canonID) {
                    state.currentCanonID = canonID;
                } else {
                    state.currentCanonID = canonID - 1;
                }
                localStorage.setItem("currentCanonID", state.currentCanonID)
            }
        },
        _UPDATE_REG(state) {
            let rdReg = [],
                canons = [];
            for (let prop in localStorage) {
                if (prop.match(/ratioDict-/)) rdReg.push(prop.replace('ratioDict-', '').split("-"));
                if (prop.match(/canonData-/)) {
                    let id = parseInt(prop.replace('canonData-', ''));
                    let code = JSON.parse(localStorage.getItem(prop)).code;
                    canons.push({ id, code });
                }
            }

            state.ratioDict = rdReg;
            state.canons = canons.sort((a, b) => a.id - b.id).map(el => el.code);
            let current = parseInt(localStorage.getItem('currentCanonID'));
            state.currentCanonID = isNaN(current) ? undefined : current;
        },
        STORE_RD(state, { limit, range }) {
            let i = state.ratioDict.findIndex(record => record[0] == limit && record[1] == range);
            if (i < 0) {
                let dict = getLimitedRatioDict(limit, range);
                localStorage.setItem('ratioDict-' + dict.limit + '-' + dict.range, JSON.stringify(dict));
                state.ratioDict.push([limit, range]);
            }
        },
    },
    getters: {
        GET_RD: (state) => (limit, range) => {
            let i = state.ratioDict.findIndex(record => record[0] == limit && record[1] == range);
            let dict;
            if (i < 0) {
                dict = getLimitedRatioDict(limit, range);
                localStorage.setItem('ratioDict-' + dict.limit + '-' + dict.range, JSON.stringify(dict));
                //state.ratioDict.push([limit, range]);
            } else {
                dict = JSON.parse(localStorage.getItem('ratioDict-' + limit + '-' + range));
            }
        },
        RD_REGISTER(state) {
            let rd = state.ratioDict;
            let groups = [];
            for (let r = 0; r < rd.length; r++) {
                let i = groups.findIndex(group => group[0][0] == rd[r][0]);
                if (i < 0) {
                    groups.push([rd[r]]);
                } else {
                    groups[i].push(rd[r]);
                }
            }
            for (let group of groups) {
                group.sort((a, b) => a[1] - b[1]);
            }
            groups.sort((a, b) => a[0][0] - b[0][0]);
            return groups.flat(1).map(el => el.join("-"));
        },
        test: (state) => (val) => {
            return { state: state, val: val };
        },
        CURRENT_CANON: (state) => {
            return state.currentCanonID;
        },
    },
    actions: {
        SET_CURRENT_CANON(ctx, id) {
            ctx.commit('_SET_CURRENT_CANON', id);
            ctx.dispatch('UPDATE_TAB');
        },
        UPDATE_TAB(ctx) {
            if (!isNaN(ctx.state.currentCanonID)) {
                let schema = JSON.parse(localStorage.getItem('canonData-' + ctx.state.currentCanonID));
                let maps = JSON.parse(sessionStorage.getItem('canonMaps-' + ctx.state.currentCanonID));
                schema.id = ctx.state.currentCanonID;
                ctx.dispatch(`canon/LOAD_DATA`, { schema, maps });
            }
        },
        LOAD_SCHEMA(ctx, schema) {
            let id = ctx.state.canons.length;
            let code = schema.code;
            ctx.commit('REG_CANON', code);
            localStorage.setItem('canonData-' + id, JSON.stringify(schema));
            ctx.dispatch('SET_CURRENT_CANON', id);
        },
        DISPOSE_CANON(ctx, canonID) {
            ctx.commit('_DISPOSE_CANON', canonID);
            if (ctx.state.canons.length < 1) ctx.commit(`canon/_CLEAR_DATA`);
            else {
                ctx.dispatch('UPDATE_TAB');
            }
        },
        UPDATE_REG(ctx) {
            ctx.commit('_UPDATE_REG');
            if (ctx.state.canons.length > 0) ctx.dispatch('UPDATE_TAB');
        }
    }
};