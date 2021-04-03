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
      state.media = { ...state.media, [media.name]: media };
    },

    addMedias(state, medias) {
      const data = { ...state.media };
      medias.forEach((m) => {
        data[m.name] = m;
      });
      state.media = medias;
    },

    setSite(state, site) {
      state.site = site;
    },
  },

  actions: {
    addMedia({ commit }, { media }) {
      commit('addMedia', media);
    },

    editMedia({ commit, getters }, { media, name }) {
      commit(
        'addMedias',
        getters.media.map((m) => {
          if (media.name === m.name) {
            return { ...m, name: `${name}.mp3` };
          }

          return m;
        }),
      );
    },

    removeMedia({ commit, getters }, { media }) {
      commit(
        'addMedias',
        getters.media.filter((m) => m.name !== media),
      );
    },

    setSite({ commit }, { site }) {
      commit('setSite', site);
    },
  },
});

export default store;
