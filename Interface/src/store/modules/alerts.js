import takeRight from "lodash/takeRight";

export default {
  namespaced: true,
  state: { alerts: [] },
  mutations: {
    add(state, alert) {
      if (state.alerts.length >= 5) {
        state.alerts = [...takeRight(state.alerts, 5), alert];
      } else {
        state.alerts = [...state.alerts, alert];
      }
    },
    remove(state, id) {
      state.alerts = state.alerts.filter(alert => {
        return alert.id !== id;
      });
    }
  },
  actions: {
    add({ commit }, { message, type }) {
      const id = new Date().getTime();
      commit("add", { message, type, id });
      window.setTimeout(() => {
        commit("remove", id);
      }, 2000);
    },
    addInfo({ dispatch }, message) {
      dispatch("add", { type: "info", message });
    },
    addWarning({ dispatch }, message) {
      dispatch("add", { type: "warning", message });
    },
    addSuccess({ dispatch }, message) {
      dispatch("add", { type: "success", message });
    }
  },
  getters: {
    alerts: state => {
      return state.alerts;
    }
  }
};
