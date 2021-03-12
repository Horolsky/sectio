/* eslint-disable no-console */
import dictCache from './_cache-ratioDicts'
import { binFloatingSearch } from '../../../utility/math-canonis';
const precision = 10 ** -12;
export function findPair(pairs, pair) {
    let index = -1
    for (let i = 0; i < pairs.length; i += 2) {
        if (pairs[i] == pair[0] && pairs[i + 1] == pair[1]) {
            index = i;
            break;
        }
    }
    return index;
}
export function synchronisePairs(record, inversion) {

    let o_inv = inversion.pairs.slice();
    if (record.pairs.equals(o_inv.slice().reverse())) return true;

    for (let i = 0; i < record.pairs.length; i += 2) {
        let pair = [record.pairs[i + 1], record.pairs[i]];
        let exist = findPair(inversion.pairs, pair);
        if (exist < 0) inversion.pairs = inversion.pairs.concat(pair);
    }

    for (let i = 0; i < o_inv.length; i += 2) {
        let pair = [o_inv[i + 1], o_inv[i]];
        let exist = findPair(record.pairs, pair);
        if (exist < 0) record.pairs = record.pairs.concat(pair);
    }
}
export function buildMaps(data, period) {
    let relations = new Object(null);
    let intervals = []; //[{pairs:[], euler:[]||num }]    

    for (let a = 0; a < data.length; a++) {
        let idA = data.keys[a];
        relations[idA] = new Object(null);
        for (let b = 0; b < data.length; b++) {
            let idB = data.keys[b],
                recto, inverso;
            if (idA == idB) {
                recto = 0, inverso = period ? -period : -recto;
            } else {
                recto = data[idB].rtr - data[idA].rtr,
                    inverso = period ? recto + (period * -Math.sign(recto)) : -recto;
            }
            relations[idA][idB] = [recto, inverso];

            let proper = data.findIndex(el => Math.abs(el.rtp) % (period ? period : Infinity) == Math.abs(recto) || Math.abs(el.rtp) % (period ? period : Infinity) == Math.abs(inverso)) >= 0;

            if (Math.abs(recto) > Math.abs(inverso)) {
                recto = inverso + (inverso = recto, 0); //swap
            }
            //in interval recto must be smaller than inverso
            //searching for interval record
            let i_record; // {recto: abs, inverso: abs, pairs: (recto), ref = min/max}

            for (let i = 0; i < intervals.length; i++) {
                let sample = intervals[i].recto[0];
                if (isNaN(sample)) sample = intervals[i].recto;
                if (Math.abs(sample - Math.abs(recto)) < precision) {
                    i_record = intervals[i];
                    break;
                }
            }
            let i_pair = recto > inverso ? [idA, idB] : [idB, idA];
            //
            /*
            CORRELATION BETWEEN RATIOS AND PAIRS:
            updwards (default):
                recto: pairs[first to last]
                inverso: pairs[last to first]
            downwards (negat ratio):
                recto: pairs[last to first]
                inverso: pairs[first to last]
            */

            if (!i_record) {
                i_record = {
                    recto: proper ? Math.abs(recto) : [Math.abs(recto)],
                    inverso: proper ? Math.abs(inverso) : [Math.abs(inverso)],
                    pairs: i_pair,
                };
                intervals.push(i_record);
            } else {
                if (proper) {
                    i_record.recto = Math.abs(recto), i_record.inverso = Math.abs(inverso);
                } else {
                    if (Array.isArray(i_record.recto)) {
                        i_record.recto.push(Math.abs(recto));
                        i_record.inverso.push(Math.abs(inverso));
                    }
                }
                //i_pair = recto > inverso ? i_pair : i_pair.reverse();
                if (findPair(i_record.pairs, i_pair) < 0) i_record.pairs = i_record.pairs.concat(i_pair);
            }
        }
    }
    //Set harmonic average for proper ratio of indirect rels
    let uncalc = intervals.filter(element =>
        Array.isArray(element.recto)
    );
    for (let i = 0; i < uncalc.length; i++) {
        let harmSum_r = 0;
        let harmSum_i = 0;
        for (let y = 0; y < uncalc[i].recto.length; y++) {
            harmSum_r = harmSum_r + (1 / uncalc[i].recto[y]);
            harmSum_i = harmSum_i + (1 / uncalc[i].inverso[y]);
        }
        uncalc[i].recto = uncalc[i].recto.length / harmSum_r; // harmonic average             
        uncalc[i].inverso = uncalc[i].inverso.length / harmSum_i;
    }
    return { relations, intervals };
}
export function buildRatioDict(limit, range) {
    if (limit != undefined) {
        let dict = Object.create(null);
        Object.assign(dict, dictCache.getDict(limit, range));
        dict.approximate = function(ratio) {
            let integer = Math.floor(ratio);
            let r = ratio % 1;
            if (Math.abs(r) < precision) return [2 ** integer, 1];
            let negat = ratio < 0;
            let rs = Object.getOwnPropertyNames(dict).filter(el => !isNaN(parseFloat(el)));
            let approximation = binFloatingSearch(rs, Math.abs(r));
            let result = dict[approximation].slice();
            result = negat ? result.reverse() : result;
            if (integer > 0) {
                result[0] = result[0] * (2 ** integer);
                result = Math.Canonis.simplifyRatio(result);
            }
            return result;
        }
        dict.store = function() { dictCache.storeDict(dict.limit, dict.range) }
        dict.delete = function() { dictCache.removeDict('ratioDict-' + dict.limit + '-' + dict.range) }
        return dict;
    } else return null;
}
export function buildApproximationsMap(intvs, limit, range, approximate) {
    let map = new Array(intvs.length);
    for (let i = 0; i < intvs.length; i++) {

        let euler_r = intvs[i].recto,
            euler_i = intvs[i].inverso,
            appr_r, appr_i, temperament_r, temperament_i;

        if (limit != undefined && approximate != undefined) {
            appr_r = approximate(euler_r);
            appr_i = approximate(euler_i);
        } else {
            appr_r = Math.Canonis.unlimFractionAppr(2 ** euler_r, range);
            appr_i = Math.Canonis.unlimFractionAppr(2 ** euler_i, range);
        }
        if (appr_i.length != 2) console.error({ appr_r, appr_i, euler_r, euler_i });
        temperament_r = Math.abs(euler_r) - Math.abs(Math.log2(appr_r[0] / appr_r[1]));
        temperament_i = Math.abs(euler_i) - Math.abs(Math.log2(appr_i[0] / appr_i[1]));

        if (Math.abs(temperament_r) < precision) temperament_r = 0;
        if (Math.abs(temperament_i) < precision) temperament_i = 0;
        map[i] = {
            recto: {
                euler: euler_r,
                approximation: appr_r,
                temperament: temperament_r
            },
            inverso: {
                euler: euler_i,
                approximation: appr_i,
                temperament: temperament_i
            },
            pairs: intvs[i].pairs
        };

    }
    return map;
}
export function findApproximation(map, period, orig) {
    let record = Object.create(null);
    let find = false;
    let val = Math.abs(orig);
    let is_recto = period ? period / 2 > val : false;
    let typo;
    for (let i = 0; i < map.length; i++) {
        if (is_recto) {
            if (Math.abs(val - map[i].recto.euler) < (precision)) {
                find = true, typo = map[i];
                break;
            }
        } else {
            if (Math.abs(val - map[i].inverso.euler) < (precision)) {
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
}
export function buildRelInfoMap(keys, relations, approximations, period) {
    let map = new Object(null);
    for (let a = 0; a < keys.length; a++) {
        let idA = keys[a];
        map[idA] = new Object(null);
        for (let b = 0; b < keys.length; b++) {
            let idB = keys[b];
            map[idA][idB] = findApproximation(approximations, period, relations[idA][idB][0]);
        }
    }
    return map;
}
export function getScale(data, pitches, period, baseFreq, diapason = { bottom: 80, top: 2000 }) {
    let base = new Array(pitches.length);
    let full = [];
    //for base
    let precision = 0.000000000000001; // for binary arithmetic deviation
    //getting rtp margin values for full scale     
    let lowerLimit = Math.log2(diapason.bottom / baseFreq);
    let upperLimit = Math.log2(diapason.top / baseFreq);

    //base scale population
    for (let i = 0; i < pitches.length; i++) {
        let id = pitches[i];
        base[i] = {
            rtr: data[id].rtr,
            id: id,
            //equivalents: [],
            code: data[id].code
        };
    }

    //filtering from unisons
    if (period) {
        for (let i = base.length - 1; i > 0; i--) {
            let equi = base[i];
            let holder = base.find(el => Math.abs(equi.rtr - el.rtr) % (period ? period : Infinity) < precision && el.id != equi.id);
            if (holder != null) {
                base.splice(i, 1);
            }
        }
    }
    //full scale    
    if (period) {
        for (let i = 0; i < base.length; i++) {

            let descendingRTR = base[i].rtr;
            while (descendingRTR > lowerLimit) {
                full.push({
                    base: base[i],
                    rtr: descendingRTR,
                    freq: Math.round(parseFloat(2 ** descendingRTR * baseFreq * 100)) / 100
                });
                descendingRTR = descendingRTR - period;
            }

            let ascendingRTR = base[i].rtr + period;
            while (ascendingRTR < upperLimit) {
                full.push({
                    base: base[i],
                    rtr: ascendingRTR,
                    freq: Math.round(parseFloat(2 ** ascendingRTR * baseFreq * 100)) / 100
                });
                ascendingRTR = ascendingRTR + period;
            }

        }
    } else {
        for (let i = 0; i < base.length; i++) {
            full.push({
                base: base[i],
                rtr: base[i].rtr,
                freq: Math.round(parseFloat(2 ** base[i].rtr * baseFreq * 100)) / 100
            });
        }
    }
    full.sort(function(a, b) {
        return a.rtr - b.rtr;
    });

    return { base, full };
}
export default {
    findPair,
    synchronisePairs,
    buildMaps,
    buildRatioDict,
    buildApproximationsMap,
    findApproximation,
    buildRelInfoMap,
    getScale,
}