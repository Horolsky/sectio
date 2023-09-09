/* eslint-disable no-console */
import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
import vuetify from './plugins/vuetify';
import sound from './plugins/sound';
import localStorageManager from './plugins/LocalStorageManager';
import MathCanonis from './core/math-canonis';
Math.Canonis = MathCanonis;
Object.freeze(Math.Canonis);
import installArrayFuncs from './utility/installed-utils-array';
installArrayFuncs();





import './components/global/register'
import './registerServiceWorker'
import Notifications from 'vue-notification'
Vue.use(Notifications);

Vue.config.devtools = true
Vue.config.productionTip = false;


import GlobalMixin from "./global-mixins/_global-mixins"
Vue.mixin(GlobalMixin)
new Vue({
    //myOption: 'hello!',
    vuetify,
    sound,
    localStorageManager,
    store,
    render: h => h(App),
    beforeCreate() {
        this.$store.dispatch("UPDATE_REG");
    },
    created() {
        /*window.onload = () => {
        };*/
    }
}).$mount('#app');