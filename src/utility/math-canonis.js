/* eslint-disable no-console */
export const comma = Math.log2(1.0125);
export const primes = [undefined, 2, 3, 5, 7, 11, 13, 17];//, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const commaticFactors = 100;//[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 27, 28, 30, 32, 33, 35, 36, 40, 42, 44, 45, 48, 49, 50, 54, 55, 56, 60, 63, 64, 66, 70, 72, 75, 77, 80, 81, 84, 88, 90, 96, 98, 99];
const defaultFactors = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];


export const largestPrimeFactor = (x) => {
    if (x === 1 || x === 2) {
        return x;
    }
    //even optimisation
    while (x % 2 === 0) {
        x /= 2;
    }
    if (x === 1) {
        return 2;
    }

    let max = 0;
    for (let i = 3; i <= x; i += 2) {
        while (x % i === 0) {
            x /= i;
            max = Math.max(i, max);
        }
    }

    if (x > 2) {
        max = Math.max(x, max);
    }

    return max;
};
export const greatestCommonFactor = (pair) => !pair[1] ? pair[0] : greatestCommonFactor([pair[1], pair[0] % pair[1]]);
export const simplifyRatio = (ratio) => {
    let gcf = (pair) => !pair[1] ? pair[0] : gcf([pair[1], pair[0] % pair[1]]);
    let factor = Math.abs(gcf(ratio));

    return [ratio[0] / factor, ratio[1] / factor];
};

export const isPrime = (num) => {
    if (num === 0 || num === 1) {
        return false;
    }
    for (var i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return true;
};
export const getPrimes = (range, start = 2) => {
    var arr = [];
    if (start % 2 === 0) {
        if (start == 2) arr.push(2);
        start += 1;
    }

    let _isPrime = (num) => {
        if (num === 0 || num === 1) {
            return false;
        }
        for (var i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) {
                return false;
            }
        }
        return true;
    };

    for (var i = start; i <= range; i += 2) {
        if (_isPrime(i)) {
            arr.push(i);
        }
    }
    return arr;
};
export const binFloatingSearch = (arr, val) => {
    let start = 0;
    let end = arr.length - 1;

    while (end - start > 1) {
        let mid = start + Math.floor((end - start) / 2);
        val > arr[mid] ? start = mid : end = mid;
    }
    return Math.abs(val - arr[start]) < Math.abs(val - arr[end]) ? arr[start] : arr[end];
}
export const getMixedFraction = (fraction) => {
    if (isNaN(fraction[0] / fraction[1])) return null;
    let sign = Math.sign(fraction[0] / fraction[1]);
    let integer = Math.floor(Math.abs(fraction[0] / fraction[1]));
    let dividend = Math.abs(fraction[0] % fraction[1]);
    let divisor = Math.abs(fraction[1]);
    return { sign, integer, dividend, divisor };
}
export const unlimFractionAppr = (value, range, precision = 10 ** -15) => {
    let absValue = Math.abs(value);
    let sign = Math.sign(value);
    let fraction = absValue < 1 ? absValue : 1 / absValue;
    //precision
    if (Math.abs(Math.round(fraction) - fraction) <= precision) {
        return [(Math.round(fraction)) * sign, 1];
    }

    let t_dividend = Math.round(fraction);
    let t_divisor = 1;
    let memorised = [1, 1];
    let deviation = 1 - fraction;
    for (let i = 2; i < range; i++) {
        t_dividend = Math.round(fraction * i);
        t_divisor = i;
        let t_fraction = t_dividend / t_divisor;
        let t_deviation = Math.abs(t_fraction - fraction);
        if (t_deviation < deviation) {
            memorised = [t_dividend, t_divisor];
            deviation = t_deviation;
            if (deviation < precision) break;
        }
    }
    memorised = absValue < 1 ? memorised : memorised.reverse();
    memorised[0] = memorised[0] * sign;
    return memorised;
}
export const getLimitedCombos = (amplitudes) => {
    /*    
    returns a array of all possible combos of integers >= 0 in a given amplitudes
    (array of max integer amplitude for each position in combo)

    intended for prime-exponential numeral system
    e.g. [7,2,1,0,3] -> 2^3 * 3^2 * 5^1 * 7^0 * 11^3

    to include negat combos use this func with 1 for each position in args;
    to get array of 0 and 1 and map it with signs.map(row => row.map(el => el > 0 ? 1 : -1));
    then multiply both arrays
    */
    amplitudes = amplitudes.map(el => el = el + 1).reverse();

    //max number of expos
    let max = 1;
    for (let a = 0; a < amplitudes.length; a++) {
        max = max * amplitudes[a];
    }
    let expos = new Array(max);
    let weights = [1];
    for (let a = 1; a < amplitudes.length; a++) {
        weights.push(amplitudes.slice(0, a).reduce((a, b) => a * b, 1));
    }
    weights.reverse(); //for RtL positions growth 

    //iterating on rows
    for (let row = 0; row < max; row++) {
        let record = [];
        //iterating on positions
        for (let pos = 0; pos < weights.length; pos++) {
            let sum = 0;
            for (let rc = 0; rc < record.length; rc++) {
                sum = sum + record[rc] * weights[rc];
            }

            let position = Math.floor((row - sum) / weights[pos]);
            record.push(position);
        }
        expos[row] = record;
    }
    return expos;
}

export const getLimitedRatioDict = (limit, range) => {
    if (limit > 17) limit = 17;
    if (limit < 2) limit = 2;
    let limIndex = primes.findIndex(el => el > limit);
    if (limIndex < 0) limIndex = primes.length;
    let limPrimes = primes.slice(1, limIndex);
    /*
    max ranges:
    3 - 10M
    5 - M
    7 - 0.6M
    11 - 20K
    13 - 5K
    17 - 1K
    */
    switch (limPrimes[limPrimes.length - 1]) {
        case 2:
            if (range > 10000000) range = 10000000
            break;
        case 3:
            if (range > 10000000) range = 10000000
            break;
        case 5:
            if (range > 1000000) range = 1000000
            break;
        case 7:
            if (range > 600000) range = 600000
            break;
        case 11:
            if (range > 20000) range = 20000
            break;
        case 13:
            if (range > 5000) range = 5000
            break;
        case 17:
            if (range > 1000) range = 1000
            break;
    }
    let signs = getLimitedCombos(limPrimes.slice().fill(1)).map(row => row.map(el => el > 0 ? 1 : -1));
    let amplitudes = new Array(limPrimes.length);
    for (let p = 0; p < limPrimes.length; p++) {
        amplitudes[p] = Math.floor(Math.log(range) / Math.log(limPrimes[p]));
    }
    let combos = getLimitedCombos(amplitudes);
    let rDict = [];//Object.create(null);
    let size = 0;
    for (let row = 0; row < combos.length; row++) {
        for (let shape = 0; shape < signs.length; shape++) {
            let expos = new Array(limPrimes.length);
            let ratio = 1;
            let dividend = 1;
            let divisor = 1;
            for (let pos = 0; pos < limPrimes.length; pos++) {
                expos[pos] = combos[row][pos] != 0 ? combos[row][pos] * signs[shape][pos] : 0;
                expos[pos] > 0
                    ? dividend = dividend * (limPrimes[pos] ** expos[pos])
                    : divisor = divisor * (limPrimes[pos] ** -expos[pos]);
                ratio = ratio * (limPrimes[pos] ** expos[pos]);
            }
            // only values between 0 and 1 (search inversions with 1/n)
            if (dividend <= range && divisor < dividend && Math.log2(ratio) < 1) {
                rDict.push([Math.log2(ratio), [dividend, divisor]]);
                size++;
            }
        }
    }
    rDict = rDict.sort((a, b) => a[0] - b[0]);
    let sortedDict = new Array(rDict.length);
    for (let i = 0; i < rDict.length; i++) {
        sortedDict[rDict[i][0]] = rDict[i][1];
    }

    return Object.freeze({ limit, range, size, ...sortedDict });
}

export default {
    comma,
    get primes() {
        return primes.slice(0);
    },
    get commaticFactors() {
        //return commaticFactors.slice(0);
        return commaticFactors;
    },
    get defaultFactors() {
        return defaultFactors.slice(0);
    },
    largestPrimeFactor,
    isPrime,
    getPrimes,
    getMixedFraction,
    greatestCommonFactor,
    unlimFractionAppr,
    getLimitedCombos,
    getLimitedRatioDict,
    binFloatingSearch,
    simplifyRatio
}
