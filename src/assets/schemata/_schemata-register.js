/* eslint-disable no-console */
import { deepMerge } from "../../utility/imported-utils-object";
// https://webpack.js.org/guides/dependency-management/#require-context
const schemata = require.context(
    // Look for files in the current directory
    '.',
    // Look in subdirectories
    true,
    // Only prefixed json files
    /_scheme.+\.json$/ //
)

export default function getRegister() {
    let reg = Object.create(null);
    schemata.keys().forEach((path) => {
        let schema = schemata(path);
        let pathTokens = path.split('/').slice(1).map(el => el.split('_')
            .map((kebab) => kebab.charAt(0).toUpperCase() + kebab.slice(1))
            .join(' '));
        let schemaName = pathTokens.splice(pathTokens.length - 1)[0]
            .replace(/\.\w+$/, '')
            .replace(/Scheme/, '');
        let record = {};
        let ref = record;
        for (let f = 0; f <= pathTokens.length; f++) {
            if (f == pathTokens.length) {
                ref[schemaName] = JSON.stringify(schema);
            } else {
                ref[pathTokens[f]] = {};
                if (f > 0 && ref.description == null) {
                    let dpath = path.split('/')
                    dpath.splice(f + 1);

                    let descr;
                    try {
                        descr = require(dpath.join('/') + '/description.json');
                    } catch (e) {
                        //
                    }
                    if (descr) ref.description = descr.text;
                }
                ref = ref[pathTokens[f]];
            }
        }
        deepMerge(reg, record);
    })


    return reg;
}