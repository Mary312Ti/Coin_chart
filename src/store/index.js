import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    coin: null,
  },
  getters: {
    callCoin: state => {
        return state.coin;
    },
  },
  mutations: {
    dataCoin(state, getDataCoin) {
        state.coin = getDataCoin;
    },
  },
  actions: {
  },
  modules: {
  }
})
