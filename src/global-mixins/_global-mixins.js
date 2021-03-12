/* eslint-disable no-console */
import { deepMerge } from "../utility/imported-utils-object";

import DialogWatcher from "./DialogWatcher";
import UiGetters from "./UiGetters";
export default deepMerge({}, DialogWatcher, UiGetters);