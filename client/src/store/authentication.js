import HTTP from '../http';
import authPivot from './authPivot';
import router from '../router';

export default {
  namespaced: true,
  state: {
    token: null,
    refreshToken: null,
    loginError: null,
    user: {},
    email_new: null,
  },
  actions: {
    login({ commit, dispatch }, { email, password }) {
      commit('setLoginError', null);
      return HTTP().post('v1/auth/login', { email, password })
        .then(({ data }) => {
          commit('setToken', {
            token: data.token,
            refreshToken: data.refreshToken,
          });
          dispatch('me', true);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            commit('setLoginError', 'Usuário e/ou senha incorretos');
          } else {
            commit('setLoginError', 'Ocorreu um erro ao tentar logar');
          }
        });
    },
    updateUser({ dispatch, state }, { name, surname, password }) {
      return HTTP().patch('v1/auth/update', { name, surname, password })
        .then(() => {
          if (password) dispatch('login', { email: state.user.email, password });
          else dispatch('me', true);
        });
    },
    register({ state }, { institution_id }) {
      if (!state.email_new) return false;
      return HTTP().post('v1/auth/register', {
        email: state.email_new, password: '123456', institution_id,
      });
    },
    refreshToken({ state, commit }, { callback, callbackError }) {
      commit('setLoginError', null);
      return HTTP().post('v1/auth/refresh', {
        refresh_token: state.refreshToken,
      })
        .then(({ data }) => {
          commit('setToken', {
            token: data.token,
            refreshToken: data.refreshToken,
          });
          if (callback) callback();
        })
        .catch((error) => {
          if (error.response.status === 401) {
            commit('setLoginError', 'Usuário e/ou senha incorretos');
          } else {
            commit('setLoginError', 'Ocorreu um erro ao tentar logar');
          }
          if (callbackError) callbackError();
        });
    },
    me({ commit }, goToRoot = false) {
      return HTTP().get('v1/auth/me')
        .then(({ data }) => {
          commit('setUser', data);
          router.push('/').catch(() => {});
        })
        .catch(() => {
          commit('setUser', {}, false);
          if (goToRoot) router.push('/login').catch(() => {});
        });
    },
    logout({ commit }) {
      return HTTP().post('v1/auth/logout')
        .then(() => {
          commit('setUser', {}, false);
          commit('setToken', { token: null, refreshToken: null });
          router.push('/login').catch(() => {});
        });
    },
    configPivot({ commit, state }) {
      authPivot.state = new Proxy({}, {
        get: (target, key) => state[key],
        set: (target, key, value) => {
          commit('setPivot', { key, value });
          return true;
        },
      });
    },
  },
  getters: {
    isLoggedIn(state) {
      return !!state.refreshToken;
    },
    getUser(state) {
      // tableComposition = null impede o usuário de alterar/criar composições
      // if (!state.user.tableQuote) state.user.tableQuote = 'orç. PRC';
      // if (!state.user.tableComposition) state.user.tableComposition = 'comp. PRC';
      if (!state.user.prefix) state.user.prefix = '';
      if (!state.user.institutions) state.user.institutions = [];
      return state.user;
    },
  },
  mutations: {
    setLoginError(state, error) {
      state.loginError = error;
    },
    setUser(state, user, logged = true) {
      state.user = user;
      state.user.logged = logged;
    },
    setToken(state, { token, refreshToken }) {
      state.token = token;
      state.refreshToken = refreshToken;
    },
    setPivot(state, { key, value }) {
      state[key] = value;
    },
    setEmail_new(state, value) {
      state.email_new = value;
    },
  },
};
