import Vue from 'vue';
import Vuex, { createLogger } from 'vuex';
import VuexWebExtensions from 'vuex-webextensions';

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [createLogger(), VuexWebExtensions()],

  state: {
    media: {},
    site: null,
  },

  getters: {
    media: (state) => Object.values(state.media),
    site: (state) => state.site,
  },

  mutations: {
    addMedia(state, media) {
      state.media = { ...state.media, [media.url]: media };
    },

    addMedias(state, medias) {
      const data = {};
      medias.forEach((m) => {
        data[m.url] = m;
      });
      state.media = data;
    },

    setSite(state, site) {
      state.site = site;
    },
  },

  actions: {
    addMedia({ commit }, { media }) {
      commit('addMedia', media);
    },

    editMedia({ commit }, { media, name }) {
      commit('addMedia', { ...media, name });
    },

    removeMedia({ commit, getters }, { media }) {
      commit(
        'addMedias',
        getters.media.filter((m) => m.url !== media),
      );
    },

    setSite({ commit }, { site }) {
      commit('setSite', site);
    },
  },
});

export default store;
