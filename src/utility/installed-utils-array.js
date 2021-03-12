/* eslint-disable no-console */

export default function install() {

    if (Array.prototype.equals)
        console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");

    Array.prototype.equals = function (array) {
        // if the other array is a falsy value, return
        if (!array)
            return false;

        // compare lengths - can save a lot of time 
        if (this.length != array.length)
            return false;

        for (var i = 0, l = this.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equals(array[i]))
                    return false;
            }
            else if (this[i] != array[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    }
    Object.defineProperty(Array.prototype, "equals", { enumerable: false });


    if (Array.prototype.includesArray)
        console.warn("Overriding existing Array.prototype.includesArray. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");

    Array.prototype.includesArray = function (array) {
        if (!array)
            return false;
        if (this.length < 1)
            return false;

        for (var i = 0, l = this.length; i < l; i++) {
            if (this[i] instanceof Array) {
                if (this[i].equals(array))
                    return true;
            }
        }
        return false;
    }
    Object.defineProperty(Array.prototype, "includesArray", { enumerable: false });

    if (Array.prototype.getUniques)
        console.warn("Overriding existing Array.prototype.getUniques. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");

    Array.prototype.getUniques = function () {
        var seen = {};
        var out = [];
        var j = 0;
        for (var i = 0; i < this.length; i++) {
            var item = this[i];
            if (seen[item] !== 1) {
                seen[item] = 1;
                out[j++] = item;
            }
        }
        return out;
    }
    Object.defineProperty(Array.prototype, "getUniques", { enumerable: false });
}