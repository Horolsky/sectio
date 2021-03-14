/* eslint-disable no-console */
import { primes } from '../../utility/math-canonis';
import Helper from './scripts/_canon-helper'
//import storageManager from "../../plugins/LocalStorageManager";


import Vue from 'vue'
const precision = 10 ** -12;

export default {
    namespaced: true,
    state: {
        id: undefined,

        name: undefined,
        code: undefined,
        description: undefined,

        baseFreq: 300,
        baseStrL: 1200,
        baseColor: undefined,

        params: {
            limit: undefined,
            range: 1000,
            period: 1,
            comma: Math.log2(1.0125)
        },
        sec_data: Object.create(null, {
            keys: {
                get() { return Object.keys(this).map(el => parseInt(el)); },
            },
            lastID: {
                get() { return Math.max(...this.keys) },
            },
            length: {
                get() { return this.keys.length; }
            },
            findIndex: {
                value: function(f) {
                    for (let i = 0; i < this.keys.length; i++) {
                        if (f(this[this.keys[i]])) return this.keys[i];
                    }
                    return -1;
                },
                writable: false
            },
            clear: {
                value: function() {
                    let keys = this.keys.slice();
                    keys.splice(keys.indexOf(0), 1);
                    for (let i = 0; i < keys.length; i++) {
                        Vue.delete(this, keys[i]);
                    }
                },
                writable: false
            },
            toArray: {
                value: function() {
                    let arr = new Array(this.length);
                    for (let i = 0; i < this.keys.length; i++) {
                        arr[i] = { id: this.keys[i], ...this[this.keys[i]] };
                    }
                    return arr;
                },
                writable: false
            }
        }),
        s_pitches: [],
        dict_ratio: Object.create(null),
        map_intervals: [],
        s_relInfo: Object.create(null),
        map_scale: []
    },
    mutations: {
        SET_STATE(state, json) {
            let data = JSON.parse(json);
            let keys = Object.getOwnPropertyNames(data);
            for (let i = 0; i < keys.length; i++) {
                state[keys[i]] = data[keys[i]];
            }
        },
        _LOAD_MAPS(state, maps) {
            state.map_intervals = maps.intervals;
            state.s_relInfo = maps.relInfo;
            state.s_pitches = maps.pitches;
            state.map_scale = maps.scale;
        },
        _UPDATE_MAPS(state) {
            let rawmaps = Helper.buildMaps(state.sec_data, state.params.period);
            state.map_intervals = Helper.buildApproximationsMap(
                rawmaps.intervals,
                state.params.limit,
                state.params.range,
                state.params.limit != null ? state.dict_ratio.approximate : null
            );
            state.s_relInfo = Helper.buildRelInfoMap(state.sec_data.keys, rawmaps.relations, state.map_intervals, state.params.period);
            state.s_pitches = state.sec_data.keys.slice().sort((a, b) => state.sec_data[a].rtr - state.sec_data[b].rtr);
            state.map_scale = Helper.getScale(
                state.sec_data, state.s_pitches, 
                state.params.period, 
                state.baseFreq
                );
            /*
            saving schema to LS
            */
            let schema = {
                name: state.name,
                code: state.code,
                description: state.description,

                baseFreq: state.baseFreq,
                baseStrL: state.baseStrL,
                baseColor: state.baseColor,
                params: state.params,
                sections: state.sec_data.toArray()
            }

            localStorage.setItem('canonData-' + state.id, JSON.stringify(schema));
            sessionStorage.setItem('canonMaps-' + state.id, JSON.stringify({
                intervals: state.map_intervals,
                relInfo: state.s_relInfo,
                pitches: state.s_pitches,
                scale: state.map_scale
            }));
        },
        _LOAD_DATA(state, schema) {
            let sections = schema.sections;
            state.id = schema.id;
            state.name = schema.name ? schema.name : schema.id;
            state.description = schema.description ? schema.description : '';

            let code = schema.code ? schema.code : schema.name; //id;
            if (code.length > 2) code.slice(0, -2);
            state.code = code;
            state.baseFreq = schema.baseFreq ? schema.baseFreq : 130;
            state.baseStrL = schema.baseStrL ? schema.baseStrL : 1200;
            state.baseColor = schema.baseColor ? schema.baseColor : undefined;

            let limit = schema.params.limit ? schema.params.limit : undefined;
            let range = schema.params.range ? schema.params.range : 1000;
            let period = schema.params.period; //? schema.params.period : 1;
            let comma = schema.params.comma ? schema.params.comma : Math.log2(81 / 80);

            state.params = { limit, range, period, comma };
            state.dict_ratio = Helper.buildRatioDict(limit, range);

            state.sec_data.clear();
            sections = sections.sort((a, b) => a.parent - b.parent);
            for (let s = 0; s < sections.length; s++) {
                let id = sections[s].id ? sections[s].id : s;
                let name = sections[s].name ? sections[s].name : `s${s}`;
                let code = sections[s].code ? sections[s].code : name.slice(0, 2);
                let parent = sections[s].parent != null ? sections[s].parent : 0;
                if (id == 0) parent = null;
                let rtp = Array.isArray(sections[s].rtp) ? Math.log2(sections[s].rtp[0] / sections[s].rtp[1]) : sections[s].rtp;
                let rtr = parent != null ? state.sec_data[parent].rtr + rtp : 0;
                if (state.params.period != null) {
                    rtr = rtr % state.params.period;
                    if (rtr < 0) rtr = state.params.period + rtr;
                    if (Math.abs(rtr - state.params.period) < precision) rtr = state.params.period;
                }
                Vue.set(state.sec_data, id, { name, code, parent, rtp, rtr });
            }
        },
        // eslint-disable-next-line no-unused-vars
        _CLEAR_DATA(state) {

            state.id = undefined;
            state.name = undefined;
            state.code = undefined;
            state.description = undefined;
            state.baseFreq = 300;
            state.baseStrL = 1200;
            state.baseColor = undefined;
            state.params = {
                limit: undefined,
                range: 1000,
                period: 1,
                comma: Math.log2(1.0125)
            };
            state.sec_data.clear();

            state.s_pitches = [];
            //approximation irrelevant maps
            state.map_intervals = [];
            //approximation relevant
            state.dict_ratio = Object.create(null);
            state.s_relInfo = Object.create(null);
            state.map_scale = [];

        },
        ADD_SECTION(state, section) {
            //section: {name, code, parent, rtp};
            let id = state.sec_data.lastID + 1,
                name = section.name ? section.name : `s${id}`,
                code = section.code ? section.code : `s${id}`,
                parent = section.parent != null ? section.parent : 0,
                rtp = section.rtp,
                rtr = parent != null ? state.sec_data[parent].rtr + rtp : 0;
            if (state.params.period != null) {
                rtr = rtr % state.params.period;
                if (rtr < 0) rtr = state.params.period + rtr;
                if (Math.abs(rtr - state.params.period) < precision) rtr = state.params.period;
            }
            Vue.set(state.sec_data, id, { name, code, parent, rtp, rtr });
        },
        REMOVE_SECTION(state, { id, cascade }) {
            let keys = state.sec_data.keys.slice().sort();
            if (id == 0) {
                state.sec_data.clear();
            } else if (!cascade) {
                //reassigning children                    
                for (let s = keys.length - 1; s >= 0; s--) {
                    if (state.sec_data[keys[s]].parent == id) {
                        let child = keys[s];
                        state.sec_data[child].rtp = state.sec_data[child].rtr;
                        state.sec_data[child].parent = 0;
                        Vue.set(state.sec_data, child, state.sec_data[child])
                    }
                }
                Vue.delete(state.sec_data, id);
            } else {
                let branch = [id];
                (function collectBranch(secID) {
                    for (let s = keys.length - 1; s >= 0; s--) {
                        if (state.sec_data[keys[s]].parent == secID) {
                            branch.push(keys[s]);
                            collectBranch(keys[s]);
                        }
                    }
                })(id);

                for (let s = branch.length - 1; s >= 0; s--) {
                    Vue.delete(state.sec_data, branch[s]);
                }
            }
            //UPDATE_MAPS
        },
        EDIT_SECTION(state, payload) {
            //payload: { id, name, code, parent, rtp, freq, strL }
            if (state.sec_data[payload.id] == undefined) throw "EDIT_SECTION: invalid id";
            let id = payload.id;
            if (payload.name) state.sec_data[id].name = payload.name;
            if (payload.code) state.sec_data[id].code = payload.code;
            if (id == 0) {
                if (payload.freq > 20) state.baseFreq = payload.freq;
                if (payload.strL > 0) state.baseStrL = payload.strL;
            } else if (payload.parent != null || payload.rtp != null) {
                if (payload.parent != null && state.sec_data[payload.parent] == undefined) throw "EDIT_SECTION: invalid parent";
                if (isNaN(payload.rtp)) throw "EDIT_SECTION: invalid rtp";
                //new data
                let parent = payload.parent != null ? payload.parent : state.sec_data[id].parent;
                let rtp = payload.rtp != null ? payload.rtp : state.sec_data[id].rtp;

                state.sec_data[id].parent = parent;
                state.sec_data[id].rtp = rtp;

                //dependent data                    
                let rtr = parent != null ? state.sec_data[parent].rtr + rtp : 0;
                //rtr periodic normalisation
                if (state.params.period != null) {
                    rtr = rtr % state.params.period;
                    if (rtr < 0) rtr = state.params.period + rtr;
                    if (Math.abs(rtr - state.params.period) < precision) rtr = state.params.period;
                }
                state.sec_data[id].rtr = rtr;

                (function branchRecalc(parent) {
                    for (let s = state.sec_data.length - 1; s >= 0; s--) {
                        let child = state.sec_data.keys[s];
                        if (state.sec_data[child].parent == parent) {
                            state.sec_data[child].rtr = (state.sec_data[parent].rtr + state.sec_data[child].rtp) % (state.params.period ? state.params.period : Infinity);
                            Vue.set(state.sec_data, child, state.sec_data[child]);
                            branchRecalc(child);
                        }
                    }
                })(id)
                Vue.set(state.sec_data, id, state.sec_data[id]);
            }
            return true;
        },
        SET_PARAMS(state, payload) {
            // payload = {limit, range, period, comma}
            // NORMALISING LIMIT
            if (payload.limit == "∞") payload.limit = undefined;
            if (!primes.includes(payload.limit)) {
                for (let p = primes.length - 1; p > 0; p--) {
                    if (primes[p] < payload.limit) {
                        payload.limit = primes[p];
                        break;
                    }
                }
            }
            // NORMALISING RANGE
            switch (payload.limit) {
                case 2:
                    if (payload.range > 10000000) payload.range = 10000000
                    break;
                case 3:
                    if (payload.range > 10000000) payload.range = 10000000
                    break;
                case 5:
                    if (payload.range > 1000000) payload.range = 1000000
                    break;
                case 7:
                    if (payload.range > 600000) payload.range = 600000
                    break;
                case 11:
                    if (payload.range > 20000) payload.range = 20000
                    break;
                case 13:
                    if (payload.range > 5000) payload.range = 5000
                    break;
                case 17:
                    if (payload.range > 1000) payload.range = 1000
                    break;
                case undefined:
                    if (payload.range > 1000) payload.range = 1000000
                    break;
            }
            if (payload.comma < 0 || payload.comma > 1) payload.comma = Math.log2(81 / 80);
            if (payload.period <= 0) payload.period = null;
            let dictRecalc = (payload.limit != state.params.range || payload.range != state.params.range)

            if (payload.period != state.params.period) {
                (function resetRtr(parent) {
                    for (let s = state.sec_data.length - 1; s >= 0; s--) {
                        let child = state.sec_data.keys[s];
                        if (state.sec_data[child].parent == parent) {
                            state.sec_data[child].rtr = (state.sec_data[parent].rtr + state.sec_data[child].rtp) % (payload.period ? payload.period : Infinity);
                            Vue.set(state.sec_data, child, state.sec_data[child]);
                            resetRtr(child);
                        }
                    }
                })(0)
            }
            state.params = payload;
            if (dictRecalc) state.dict_ratio = Helper.buildRatioDict(state.params.limit, state.params.range);
        },
        SET_PROPERTY(state, { property, value }) {
            const allowed = [
                'name', 'string',
                'code', 'string',
                'description', 'string',
                'baseFreq', 'number',
                'baseStrL', 'number',
                'baseColor', 'number',
            ];
            let propID = allowed.indexOf(property);
            if (propID < 0) console.error('restricted property mutation: ' + property);
            else if (typeof value != allowed[propID + 1]) console.error('incorrect value type for ' + property);
            else state[property] = value;
        }
    },
    actions: {
        LOAD_DATA(ctx, payload) {
            let t = performance.now();
            ctx.commit('_LOAD_DATA', payload.schema);
            if (payload.maps == undefined) {
                ctx.commit('_UPDATE_MAPS');
            } else {
                ctx.commit('_LOAD_MAPS', payload.maps);
            }
            console.log(`data update: ${(performance.now() - t).toFixed(3)} ms`);
        },
        UPDATE_MAPS(ctx) {
            ctx.commit('_UPDATE_MAPS');
        },
        ADD_SECTION(ctx, payload) {
            ctx.commit('ADD_SECTION', payload);
            ctx.dispatch('UPDATE_MAPS');
        },
        REMOVE_SECTION(ctx, payload) {
            ctx.commit('REMOVE_SECTION', payload);
            ctx.dispatch('UPDATE_MAPS');
        },
        SET_PARAMS(ctx, payload) {
            ctx.commit('SET_PARAMS', payload);
            ctx.dispatch('UPDATE_MAPS');
        },
        EDIT_SECTION(ctx, payload) {
            ctx.commit('EDIT_SECTION', payload);
            ctx.dispatch('UPDATE_MAPS');
        },
        SET_PROPERTY(ctx, payload) {
            ctx.commit('SET_PROPERTY', payload);
        },
    },
    getters: {

        GET_SCHEMA: (state) => {
            let schema = {
                name: state.name,
                code: state.code,
                description: state.description,

                baseFreq: state.baseFreq,
                baseStrL: state.baseStrL,
                baseColor: state.baseColor,

                params: state.params,

                sections: state.sec_data.toArray()
            }
            return schema;
        },
        GET_PROPERTY: (state) => (property) => {
            if (Array.isArray(state[property])) {
                return state[property].slice();
            } else if (typeof state[property] == "object") {
                return JSON.parse(JSON.stringify(state[property]));
            } else return state[property];
        },
        findApproximation: (state) => (orig) => {
            let map = state.map_intervals.slice();
            let record = Object.create(null);
            let find = false;
            let val = Math.abs(orig);
            let is_recto = state.params.period ? state.params.period / 2 > val : false;
            let typo;
            for (let i = 0; i < map.length; i++) {
                if (is_recto) {
                    if (Math.abs(val - map[i].recto.euler) < (10 ** -12)) {
                        find = true, typo = map[i];
                        break;
                    }
                } else {
                    if (Math.abs(val - map[i].inverso.euler) < (10 ** -12)) {
                        find = true, typo = map[i];
                        break;
                    }
                }
            }
            if (find) {

                //NB bug here
                let rct = {
                        euler: is_recto ? typo.recto.euler : typo.inverso.euler,
                        approximation: is_recto ? typo.recto.approximation.slice() : typo.inverso.approximation.slice(),
                        temperament: is_recto ? typo.recto.temperament : typo.inverso.temperament,
                    },
                    inv = {
                        euler: is_recto ? (typo.inverso.euler * -1) : (typo.recto.euler * -1),
                        approximation: is_recto ? typo.inverso.approximation.slice().reverse() : typo.recto.approximation.slice().reverse(),
                        temperament: is_recto ? typo.inverso.temperament : typo.recto.temperament,
                    }
                if (orig > 0) record = { up: rct, down: inv };
                else record = { up: inv, down: rct };
            }
            return find ? record : null;
        },
        getViewCode: (state) => (id) => {
            return `${state.sec_data[id].code.bold()}${id.toString().sub().sub()}`;
        },
        //relevant maps
        map_freq: (state) => {
            let freqs = Object.create(null);
            for (let i = 0; i < state.sec_data.length; i++) {
                let id = state.sec_data.keys[i];
                let freq = state.baseFreq * (2 ** state.sec_data[id].rtr);
                freqs[id] = freq;
            }
            return freqs;
        },
        map_color: (state) => {
            let colors = Object.create(null);
            for (let i = 0; i < state.sec_data.length; i++) {
                let id = state.sec_data.keys[i];
                let color = (function() {
                    /*
                    basic formula 2*(1-|(0.5-x)|) gives a distance to the point 
                    on a circle in fraction of a semicircumference
                    x is radial coordinate of a given point in a fraction of a full circumference;
                    */
                    let r = state.sec_data[id].rtr / (state.params.period ? state.params.period : 1);
                    let RR = 1 - Math.abs(0.5 - ((r % 1 + 1) % 1)) * 2;
                    let GG = 1 - Math.abs(0.5 - (((r + 1 / 3) % 1 + 1) % 1)) * 2;
                    let BB = 1 - Math.abs(0.5 - (((r - 1 / 3) % 1 + 1) % 1)) * 2;

                    RR = Math.round(RR * 255).toString(16);
                    GG = Math.round(GG * 255).toString(16);
                    BB = Math.round(BB * 255).toString(16);

                    if (RR.length < 2) RR = '0' + RR;
                    if (GG.length < 2) GG = '0' + GG;
                    if (BB.length < 2) BB = '0' + BB;

                    return `#${RR}${GG}${BB}`;
                })();
                colors[id] = color;
            }
            return colors;
        },
        map_children: (state) => {
            let map = Object.create(null);
            let keys = state.sec_data.keys;
            for (let i = 0; i < state.sec_data.length; i++) {
                let id = keys[i];
                let children = (function() {
                    let c = [];
                    for (let y = 0; y < state.sec_data.length; y++) {
                        if (state.sec_data[keys[y]].parent == id) c.push(keys[y]);
                    }
                    return c;
                })();
                map[id] = children;
            }
            return map;
        },
        pool_names: (state) => {
            let pool = new Array(state.sec_data.length);
            for (let i = 0; i < pool.length; i++) {
                pool[i] = state.sec_data[state.sec_data.keys[i]].name;
            }
            return pool;
        },
        pool_codes: (state) => {
            let pool = new Array(state.sec_data.length);
            for (let i = 0; i < pool.length; i++) {
                pool[i] = state.sec_data[state.sec_data.keys[i]].code;
            }
            return pool;
        },
        get_chord_ratios: (state) => (chord) => {
            if (!Array.isArray(chord)) return null;
            if (chord.length == 1) return [];
            let ratios = new Array(chord.length-1);
            for (let i = 0; i < chord.length-1; i++){
                ratios[i] = state.s_relInfo[chord[0]][chord[i+1]].up;
            }
            /* eslint-disable no-console */
            console.log(ratios);
            return ratios;
        },
    }
}