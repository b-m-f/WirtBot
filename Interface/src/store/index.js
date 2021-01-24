import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import QRCode from "qrcode";
import i18n from "../i18n";
import { generateSigningKeys, getKeys } from "@wirtbot/crypto";
import { generateDNSFile, generateDeviceConfig, generateServerConfig } from "@wirtbot/config-generators";
import { updateServerConfig as updateServerViaApi, updateDNSConfig as updateDNSConfigViaApi } from "../api";


import alerts from "./modules/alerts";

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

const store = new Vuex.Store({
  modules: { alerts },
  state: {
    version: "1.5.7",
    keys: undefined,
    server: {
      ip: { v4: [undefined, undefined, undefined, undefined], v6: "" },
      port: undefined,
      keys: undefined,
      config: "",
      subnet: { v4: "10.10.0.", v6: "1010:1010:1010:1010:" },
      hostname: "",
    },
    devices: [
      /* {ip: {v4, v6}, name, type, id}*/
    ],
    deviceTypes: ["Android", "Windows", "MacOS", "iOS", "Linux", "FreeBSD"],
    websiteBeingViewedOnMobileDevice: undefined,
    network: {
      dns: {
        name: "wirt.internal", config: "", ip: { v4: [1, 1, 1, 1] },
        tlsName: "cloudflare-dns.com", tls: true
      }
    },
    dashboard: {
      // Messages have to be defined in pages/Dashboard/messages.js
      messages: [],
      hiddenWidgets: [],
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
    updateDNS(state, dns) {
      Object.keys(dns).forEach((key) => {
        if (dns[key] !== undefined && dns[key] !== null) {
          state.network.dns[key] = dns[key];
          state.network.dns[key] = dns[key]
        }
      });
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
    resetServer(state) {
      state.server = {
        ip: { v4: [undefined, undefined, undefined, undefined], v6: "" },
        port: undefined,
        keys: undefined,
        config: "",
        subnet: { v4: "10.10.0.", v6: "1010:1010:1010:1010:" },
        hostname: "",
      }
    },
    resetDevices(state) {
      state.devices = []
    },
    resetDNS(state) {
      state.network.dns = {
        name: "wirt.internal", config: "", ip: { v4: [1, 1, 1, 1] },
        tlsName: "cloudflare-dns.com", tls: true
      }
    }
  },
  actions: {
    async generateKeys({ commit }) {
      const keys = await generateSigningKeys();
      commit("setKeys", keys);
    },
    async disableFirstUse({ commit }) {
      commit("disableFirstUse");
    },
    async updateDNSName({ commit, dispatch }, name) {
      commit("updateDNS", { name });
      dispatch("updateDNS");
    },
    async updateDNSIp({ commit, dispatch }, { v4, v6 }) {
      commit("updateDNS", { ip: { v4, v6 } });
      dispatch("updateDNS");
    },
    async updateDNSTls({ commit, dispatch }, { tlsName, tls }) {
      commit("updateDNS", { tlsName, tls });
      if (tls == true && !tlsName) {
        return;
      }
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
      if (!state.server.keys && !server.keys) {
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
      let devices = await Promise.all(
        state.devices.map(async (device) => {
          try {
            return await addConfigToDevice(device, state.server);
          } catch (error) {
            console.error(error);
            return device;
          }
        })
      )
      // unfinished devices setups are excluded here
      devices = devices.filter(device => device.config);
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
    async updateDNS({ state, commit, dispatch }) {
      commit("updateDNSConfig", generateDNSFile(state.server, state.devices, state.network));
      let success = false;
      if (state.network.dns.name) {
        success = await updateDNSConfigViaApi(state.network.dns.config, `wirtbot.${state.network.dns.name}`);
      } else {
        success = await updateDNSConfigViaApi(state.network.dns.config, `${state.server.subnet.v4}1`);
      }
      if (success) {
        dispatch(
          "alerts/addSuccess",
          `${i18n.t("success.updateSuccessDNS")}`
        );

      } else {
        dispatch(
          "alerts/addWarning",
          `${i18n.t("warnings.updateFailDNS")}`
        );
      }
    },
    async sendConfigUpdatesToAPI({ state, dispatch }) {
      let success = false;
      if (state.network.dns.name) {
        success = await updateServerViaApi(state.server.config, `wirtbot.${state.network.dns.name}`);
      } else {
        success = await updateServerViaApi(state.server.config, `${state.server.subnet.v4}1`);
      }
      if (success) {
        dispatch(
          "alerts/addSuccess",
          `${i18n.t("success.updateSuccessConfig")}`
        );
      } else {
        dispatch(
          "alerts/addWarning",
          `${i18n.t("warnings.updateFailConfig")}`
        );
      }
    },
    async addDevice(
      { commit, dispatch, state },
      { id, name, ip, type, routed, additionalDNSServers, MTU, keys }
    ) {
      try {
        if (!keys) {
          keys = await getKeys();
        }
        const newDevice = await addConfigToDevice(
          { id, keys, name, ip, type, routed, additionalDNSServers, MTU },
          state.server
        );
        commit("addDevice", newDevice);
        dispatch("updateServerConfig");
      } catch (error) {
        if (error.message === "No Server") {
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
    async removeDevice({ dispatch, commit }, { id }) {
      try {
        commit("removeDevice", id);
        dispatch("alerts/addSuccess", i18n.t("success.deviceRemoved"));
        dispatch("updateServerConfig");
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
    async removeDevicesWithoutId({ commit }) {
      commit("removeDevicesWithoutId");
    },
    async replaceState({ dispatch, commit }, newState) {
      // Clean the complete state first
      commit("resetDevices")
      commit("resetServer")
      commit("resetDNS")

      commit("setKeys", newState.keys);
      await dispatch("updateServer", newState.server);
      newState.devices.forEach(async device => {
        await dispatch("addDevice", device);
      })
      await dispatch("updateDNSName", newState.network.dns.name);
      await dispatch("updateDNSTls", newState.network.dns);
      await dispatch("updateDNSIp", newState.network.dns.ip);
    }
  },

  plugins: [createPersistedState({
    filter(stateChange) {
      if (stateChange.type.includes("alerts/")) {
        return false;
      }
      else {
        return true;
      }
    }
  })],
});


export default store;
