/* eslint-disable no-console */
import { createApp } from 'vue'
import App from './App.vue'
import store from './store/store'
import vuetify from './plugins/vuetify';
import sound from './plugins/sound';
import localStorage from './plugins/localStorage';
import './registerServiceWorker'
import MathCanonis from './core/math-canonis';
import installArrayFuncs from '@util/installed-utils-array';
import Notifications from 'vue-notification'
import GlobalMixin from "./global-mixins/default"

import RatioViewMode from '@components/global/RatioViewMode.vue'
import InputRatio from '@components/global/InputRatio.vue'
import InfoHint from '@components/global/InfoHint.vue'
import HintedButton from '@components/global/HintedButton.vue'

Math.Canonis = MathCanonis;
Object.freeze(Math.Canonis);
installArrayFuncs();


const Vue = createApp(App)
    .use(Notifications)
    .use(vuetify)
    .use(sound, {})
    .use(store, {})
    .use(localStorage, {})
    .mixin(GlobalMixin)
    .component('RatioViewMode', RatioViewMode)
    .component('InputRatio', InputRatio)
    .component('InfoHint', InfoHint)
    .component('HintedButton', HintedButton)

Vue.config.devtools = true
Vue.config.productionTip = false;

Vue.mount('#app')
