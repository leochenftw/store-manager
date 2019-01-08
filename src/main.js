// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
// import NProgress from 'nprogress';
import _ from 'lodash';
import TweenMax from "gsap/TweenMax";

require('@/utils/utilities');
require('jquery.scrollto');
// require('lightbox2');
require("babel-polyfill"); // Enable promises on IE11 etc

Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue({});
axios.defaults.headers.common = {
    'X-Requested-With': 'XMLHttpRequest'
};
axios.defaults.withCredentials = true;
global._ = _;
global.TweenMax =   TweenMax;
// global.NProgress = NProgress;
global.axios = axios;
global.base_url = location.hostname == 'localhost' ? 'https://onestore.leochen.co.nz/' : 'https://www.one-stop.co.nz/';
global.endpoints = require('@/config/endpoints');
global.store_info   =   null;

axios.get(
    base_url + endpoints.store
).then((resp) => {
    $('html title').html('OneStore - ' + resp.data.title);
    store_info  =   resp.data;
    new Vue({
        el: '#app',
        router,
        components: {
            App
        },
        template: '<App/>'
    });
}).catch((error) => {

});
