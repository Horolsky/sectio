/* eslint-disable no-console */
import { getLimitedRatioDict } from '@core/math-canonis';
//TODO safe naming for normalised maps
export default {
    get sessionReg() {
        let reg = []
        for (let prop in sessionStorage) {
            if (prop.match(/ratioDict-/)) reg.push(parseFloat(prop.replace('ratioDict-', '')));
        }
        return reg;
    },
    removeDict(map) {
        if (typeof map == 'object') {
            sessionStorage.removeItem('ratioDict-' + map.limit + '-' + map.range);
            localStorage.removeItem('ratioDict-' + map.limit + '-' + map.range);
        } else if (typeof map == 'string') {
            sessionStorage.removeItem(map);
            localStorage.removeItem(map);
        }
    },
    getDict(limit, range) {
        let map = JSON.parse(sessionStorage.getItem('ratioDict-' + limit + '-' + range));
        if (!map) {
            map = JSON.parse(localStorage.getItem('ratioDict-' + limit + '-' + range));
            if (!map) map = getLimitedRatioDict(limit, range);
            sessionStorage.setItem('ratioDict-' + limit + '-' + range, JSON.stringify(map));
        }
        return map;
    },
    storeDict(limit, range) {
        let map = JSON.parse(sessionStorage.getItem('ratioDict-' + limit + '-' + range));
        if (!map) {
            map = getLimitedRatioDict(limit, range);
            sessionStorage.setItem('ratioDict-' + map.limit + '-' + map.range, JSON.stringify(map));
        }
        localStorage.setItem('ratioDict-' + map.limit + '-' + map.range, JSON.stringify(map));
    }

}