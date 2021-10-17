import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        windowWidth: window.innerWidth,
    },
    getters: {
        isDesktop: state => state.windowWidth > 1024,
    },
    mutations: {
        setWindowWidth(state, width) {
            state.windowWidth = width;
        },
    },
    actions: {
        setWindowWidth({ commit }, width) {
            commit("setWindowWidth", width);
        },

    },
});