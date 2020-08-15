import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import QRCode from "qrcode";
import i18n from "../i18n";
import { getKeys } from "../lib/wireguard";
import { generateSigningKeys } from "../lib/cryptography";
import { generateDNSFile } from "../lib/dns";
import { updateServerConfig as updateServerViaApi, updateDNSConfig as updateDNSConfigViaApi } from "../api";

import { generateDeviceConfig, generateServerConfig } from "../lib/wireguard";

import alerts from "./modules/alerts";
// import hosts from "./modules/hosts";
// import networks from "./modules/networks";

async function addConfigToDevice(newDevice, server) {
  const config = generateDeviceConfig(newDevice, server);
  if (newDevice.type === "Android" || newDevice.type === "iOS") {
    const qr = await QRCode.toDataURL(config);

    return Object.assign({}, newDevice, {
      config,
      qr,
    });
  }
  return Object.assign({}, newDevice, {
    config,
    qr: undefined,
  });
}

Vue.use(Vuex);

// TODO: add typescript for the store
// One server can have multiple WG configs,
// Devices always belong to one network and only have 1 config attached to them
// Rename to sth else since it also does changes like generating the configs and doesnt just store
const store = new Vuex.Store({
  modules: { alerts },
  state: {
    version: 1.1,
    keys: undefined,
    server: {
      ip: { v4: [undefined, undefined, undefined, undefined], v6: "" },
      port: undefined,
      keys: undefined,
      config: "",
      subnet: { v4: "10.10.0.", v6: "1010:1010:1010:1010:" },
      connected: false,
      hostname: "",
    },
    devices: [
      /* {ip: {v4, v6}, name, type, id}*/
    ],
    deviceTypes: ["Android", "Windows", "MacOS", "iOS", "Linux", "FreeBSD"],
    websiteBeingViewedOnMobileDevice: undefined,
    network: {
      dns: { name: "wirt.internal", config: "" }
    },
    dashboard: {
      // Messages have to be defined in pages/Dashboard/messages.js
      messages: [],
      widgets: [],
      firstUse: true,
    },
  },
  mutations: {
    disableFirstUse(state) {
      state.dashboard.firstUse = false;
    },
    resetToFirstUse(state) {
      state.firstUse = true;
    },
    setKeys(state, keys) {
      state.keys = keys;
    },
    setMobileView(state) {
      state.websiteBeingViewedOnMobileDevice = true;
    },
    setNotMobileView(state) {
      state.websiteBeingViewedOnMobileDevice = false;
    },
    updateServer(state, server) {
      Object.keys(server).forEach((key) => {
        if (server[key] !== undefined && server[key] !== null) {
          state.server[key] = server[key];
        }
      });
    },
    removeDevicesWithoutId(state) {
      state.devices = state.devices.filter((device) => device.id);
    },
    removeDevice(state, id) {
      state.devices = state.devices.filter((device) => device.id !== id);
    },
    addDevice(state, device) {
      state.devices = [...state.devices, device];
    },
    updateServerConfig(state, config) {
      state.server = Object.assign({}, state.server, {
        config: config,
      });
    },
    updateDevices(state, devices) {
      state.devices = devices;
    },
    updateDNSName(state, name) {
      state.network.dns.name = name;
    },
    updateDNSConfig(state, config) {
      state.network.dns.config = config;
    },
    updateDashboard(state, { messages, widgets }) {
      if (messages) {
        state.dashboard.messages = messages;
      }
      if (widgets) {
        state.dashboard.widgets = widgets;
      }
    },
  },
  actions: {
    async generateKeys({ commit }) {
      const keys = await generateSigningKeys();

      if (
        process.env.NODE_ENV === "development" &&
        process.env.VUE_APP_DEVELOPMENT_PUBLIC_KEY &&
        process.env.VUE_APP_DEVELOPMENT_PRIVATE_KEY
      ) {
        keys.public_key = process.env.VUE_APP_DEVELOPMENT_PUBLIC_KEY;
        keys.private_key = process.env.VUE_APP_DEVELOPMENT_PRIVATE_KEY;
      }
      commit("setKeys", keys);
    },
    async disableFirstUse({ commit }) {
      commit("disableFirstUse");
    },
    async updateDNSName({ commit, dispatch }, name) {
      // TODO: some kind of check that the DNS name is correct
      commit("updateDNSName", name);
      dispatch("updateDNS");
    },
    async addDashboardMessage({ state, commit }, message) {
      commit("updateDashboard", {
        messages: [...state.dashboard.messages, message],
      });
    },
    async removeDashboardMessage({ state, commit }, message) {
      const messagesWithoutMessage = state.dashboard.messages.filter((msg) => {
        return msg.title !== message.title;
      });
      commit("updateDashboard", { messages: messagesWithoutMessage });
    },
    async addDashboardWidget({ state, commit }, widget) {
      commit("updateDashboard", {
        widgets: [...state.dashboard.widgets, widget],
      });
    },
    async removeDashboardWidget({ state, commit }, widget) {
      const widgetsWithoutWidget = state.dashboard.widgets.filter((wgt) => {
        return wgt !== widget;
      });
      commit("updateDashboard", { widgets: widgetsWithoutWidget });
    },
    async updateServer({ state, commit, dispatch }, server) {
      if (!state.server.keys) {
        server.keys = await getKeys();
      }
      commit("updateServer", server);
      await dispatch("updateServerConfig");
      // only rebuild device configs if necessary parts of the server config changed
      if (
        server.ip ||
        server.port ||
        server.keys ||
        server.hostname ||
        server.hostname === "" ||
        server.subnet
      ) {
        await dispatch("updateDeviceConfigs");
      }
    },
    async updateDeviceConfigs({ commit, state }) {
      const devices = await Promise.all(
        state.devices.map(async (device) => {
          return await addConfigToDevice(device, state.server);
        })
      );
      commit("updateDevices", devices);
    },
    async updateServerConfig({ commit, state, dispatch }) {
      const config = generateServerConfig(
        state.server,
        state.devices.filter((device) => device.ip && device.keys)
      );
      commit("updateServerConfig", config);
      // Since the server config gets updated with every device change, this is a place to trigger remote updates 
      // on the WirtBot
      dispatch("sendConfigUpdatesToAPI");
      dispatch("updateDNS");
    },
    async updateDNS({ state, commit }) {
      commit("updateDNSConfig", generateDNSFile(state.server, state.devices, state.network));
      if (state.server.connected) {
        if (state.server.hostname) {
          updateDNSConfigViaApi(state.network.dns.config, state.server.hostname);
        } else {
          // In most cases this will throw CORS errors, since HTTPS is enforced
          updateDNSConfigViaApi(state.network.dns.config, state.server.ip.v4.join(""));
        }
      }
    },
    async sendConfigUpdatesToAPI({ state }) {
      if (state.server.connected) {
        if (state.server.hostname) {
          updateServerViaApi(state.server.config, state.server.hostname);
        } else {
          // In most cases this will throw CORS errors, since HTTPS is enforced
          updateServerViaApi(state.server.config, state.server.ip.v4.join(""));
        }
      }
    },
    async addDevice(
      { commit, dispatch, state },
      { id, name, ip, type, routed }
    ) {
      try {
        const keys = await getKeys();
        const newDevice = await addConfigToDevice(
          { id, keys, name, ip, type, routed },
          state.server
        );
        commit("addDevice", newDevice);
        dispatch("updateServerConfig");
      } catch (error) {
        if (error.message === "noServer") {
          dispatch(
            "alerts/addWarning",
            `${i18n.t("warnings.deviceAdd")} ${i18n.t("warnings.noServer")}`
          );
        } else {
          dispatch(
            "alerts/addWarning",
            `${i18n.t("warnings.deviceAdd")} ${i18n.t(
              "warnings.documentation"
            )}`
          );
          console.error(error);
        }
      }
    },
    async updateDevice({ state, commit, dispatch }, newDevice) {
      const devices = await Promise.all(
        state.devices.map(async (device) => {
          if (device.id === newDevice.id) {
            // This is so heavily guarded as to make sure that
            // the server is already set up
            // and the device form completed.
            // Otherwise this would execute while editing the device form
            if (
              newDevice.type &&
              newDevice.ip &&
              newDevice.keys &&
              state.server.port &&
              state.server.keys
            ) {
              return await addConfigToDevice(newDevice, state.server);
            }
            return newDevice;
          }
          return device;
        })
      );
      commit("updateDevices", devices);
      dispatch("updateServerConfig", devices);
    },
    removeDevice({ dispatch, commit }, { id }) {
      try {
        commit("removeDevice", id);
        dispatch("alerts/addSuccess", i18n.t("success.deviceRemoved"));
      } catch (error) {
        dispatch(
          "alerts/addWarning",
          `${i18n.t("warnings.deviceRemove")} ${i18n.t(
            "warnings.documentation"
          )}`
        );
        console.error(error);
      }
    },
    removeDevicesWithoutId({ commit }) {
      commit("removeDevicesWithoutId");
    },
  },

  plugins: [createPersistedState({})],
});


export default store;
