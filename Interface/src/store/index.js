import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import QRCode from "qrcode";
import i18n from "../i18n";
import { generateSigningKeys, getKeys } from "../lib/crypto";
import { generateDNSFile } from "../lib/dns";
import { generateDeviceConfig, generateServerConfig } from "../lib/wireguard";
import {
  updateServerConfig as updateServerViaApi,
  updateDNSConfig as updateDNSConfigViaApi,
} from "../api";

import alerts from "./modules/alerts";
import mergeWith from "lodash/mergeWith";
import isArray from "lodash/isArray";

function merge(object1, object2) {
  function customizer(objValue, srcValue) {
    if (isArray(objValue)) {
      return srcValue;
    }
  }
  return mergeWith(object1, object2, customizer);
}

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

const version = "2.6.5";

const versionFromAppPlugin = (store) => {
  store.subscribe((mutation, state) => {
    if (
      state.version !== version ||
      (mutation.action === "setVersion" && mutation.payload !== version)
    ) {
      store.commit("setVersion", version);
    }
  });
};

Vue.use(Vuex);
const initialState = {
  version: version,
  keys: { public: undefined, private: undefined },
  server: {
    ip: { v4: "", v6: "" },
    port: undefined,
    config: "",
    subnet: { v4: "10.10.0", v6: "1010:1010:1010:1010:0000:0000:0000" },
    hostname: "",
    name: "wirtbot",
  },
  devices: [
    /* {ip: {v4, v6}, name, type, id}*/
  ],
  deviceTypes: ["Android", "Windows", "MacOS", "iOS", "Linux", "FreeBSD"],
  network: {
    dns: {
      name: "wirt.internal",
      config: "",
      ip: { v4: "1.1.1.1" },
      tlsName: "cloudflare-dns.com",
      tls: true,
      ignoredZones: ["fritz.box", "lan", "local", "home"],
      adblock: true,
      blockLists: [],
      blockHosts: [],
    },
    api: { host: `wirtbot.wirt.internal:3030` },
  },
  dashboard: {
    // Messages have to be defined in pages/Dashboard/messages.js
    messages: [],
    hiddenWidgets: [],
    firstUse: true,
  },
};

const store = new Vuex.Store({
  strict: true,
  modules: { alerts },
  state: initialState,
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
    updateServer(state, server) {
      state.server = merge({ ...state.server }, server);
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
      state.server = Object.assign(
        {},
        { ...state.server },
        {
          config: config,
        }
      );
    },
    updateDevices(state, devices) {
      for (let device of devices) {
        const indexOfDeviceInState = state.devices.findIndex(
          (deviceInState) => deviceInState.id === device.id
        );
        state.devices.splice(indexOfDeviceInState, 1, device);
      }
    },
    updateDNS(state, dns) {
      state.network.dns = merge({ ...state.network.dns }, dns);
    },
    updateAPI(state, api) {
      state.network.api = merge({ ...state.network.api }, api);
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
      // TODO: create a default state and simply load that in
      state.server = initialState.server;
    },
    resetDevices(state) {
      state.devices = initialState.devices;
    },
    resetDNS(state) {
      state.network.dns = initialState.network.dns;
    },
    setVersion(state, version) {
      state.version = version;
    },
  },
  actions: {
    async setKeys({ commit }, keys) {
      commit("setKeys", keys);
    },
    async generateSigningKeys({ commit }) {
      const keys = await generateSigningKeys();
      commit("setKeys", keys);
    },
    async disableFirstUse({ commit }) {
      commit("disableFirstUse");
    },
    async updateDNSName({ commit, dispatch }, name) {
      commit("updateDNS", { name });
      await dispatch("updateDNS");
    },
    async updateAPIHost({ commit }, host) {
      commit("updateAPI", { host });
    },
    async updateDNSIp({ commit, dispatch }, { v4, v6 }) {
      commit("updateDNS", { ip: { v4, v6 } });
      await dispatch("updateDNS");
    },
    async updateDNSIgnoredZones({ commit, dispatch }, ignoredZones) {
      commit("updateDNS", { ignoredZones });
      await dispatch("updateDNS");
    },
    async updateDNSTls({ commit, dispatch }, { tlsName, tls }) {
      commit("updateDNS", { tlsName, tls });
      if (tls == true && !tlsName) {
        return;
      }
      await dispatch("updateDNS");
    },
    async updateDNSAdblock({ commit, dispatch }, adblock) {
      commit("updateDNS", { adblock });
      await dispatch("updateDNS");
    },
    async updateDNSBlockLists({ commit, dispatch }, blockLists) {
      commit("updateDNS", { blockLists });
      await dispatch("updateDNS");
    },
    async updateDNSBlockHosts({ commit, dispatch }, blockHosts) {
      commit("updateDNS", { blockHosts });
      await dispatch("updateDNS");
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
      let keys = {};
      if (
        (!state.server.keys ||
          !state.server.keys.public ||
          !state.server.keys.private) &&
        (!server.keys || !server.keys.public || !server.keys.private)
      ) {
        keys = await getKeys();
        commit("updateServer", Object.assign({}, server, { keys }));
      } else {
        commit("updateServer", server);
      }
      await dispatch("updateServerConfig");
      await dispatch("updateDeviceConfigs");
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
      await dispatch("sendConfigUpdatesToAPI");
      await dispatch("updateDNS");
    },
    async updateDNS({ state, commit, dispatch }) {
      commit(
        "updateDNSConfig",
        generateDNSFile(state.server, state.devices, state.network)
      );
      await dispatch("sendDNSUpdatesToApi");
    },
    async sendDNSUpdatesToApi({ state, dispatch }) {
      if (!state.keys || !state.keys.public || !state.keys.private) {
        await dispatch("generateSigningKeys");
      }
      const success = await updateDNSConfigViaApi(
        state.network.dns.config,
        state.network.api.host
      );
      if (success) {
        dispatch("alerts/addSuccess", `${i18n.t("success.updateSuccessDNS")}`);
      } else {
        dispatch("alerts/addWarning", `${i18n.t("warnings.updateFailDNS")}`);
      }
    },
    async sendConfigUpdatesToAPI({ state, dispatch }) {
      if (!state.keys || !state.keys.public || !state.keys.private) {
        await dispatch("generateSigningKeys");
      }
      const success = await updateServerViaApi(
        state.server.config,
        state.network.api.host
      );
      if (success) {
        dispatch(
          "alerts/addSuccess",
          `${i18n.t("success.updateSuccessConfig")}`
        );
      } else {
        dispatch("alerts/addWarning", `${i18n.t("warnings.updateFailConfig")}`);
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
        await dispatch("updateServerConfig");
      } catch (error) {
        if (error.message === "No Server") {
          await dispatch(
            "alerts/addWarning",
            `${i18n.t("warnings.deviceAdd")} ${i18n.t("warnings.noServer")}`
          );
        } else {
          await dispatch(
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
      await dispatch("updateServerConfig", devices);
    },
    async removeDevice({ dispatch, commit }, { id }) {
      try {
        commit("removeDevice", id);
        await dispatch("alerts/addSuccess", i18n.t("success.deviceRemoved"));
        await dispatch("updateServerConfig");
      } catch (error) {
        await dispatch(
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
      commit("resetDevices");
      commit("resetServer");
      commit("resetDNS");

      commit("setKeys", newState.keys);
      await dispatch("updateServer", newState.server);
      newState.devices.forEach(async (device) => {
        await dispatch("addDevice", device);
      });
      await dispatch("updateDNSName", newState.network.dns.name);
      await dispatch("updateDNSTls", newState.network.dns);
      await dispatch("updateDNSIp", newState.network.dns.ip);
      await dispatch("updateDNSAdblock", newState.network.dns.adblock);
      await dispatch("updateDNSBlockLists", newState.network.dns.blockLists);
      await dispatch("updateDNSBlockHosts", newState.network.dns.blockHosts);
      await dispatch(
        "updateDNSIgnoredZones",
        newState.network.dns.ignoredZones
      );
    },
  },

  plugins: [
    createPersistedState({
      filter(stateChange) {
        if (stateChange.type.includes("alerts/")) {
          return false;
        } else {
          return true;
        }
      },
    }),
    versionFromAppPlugin,
  ],
});

export default store;
