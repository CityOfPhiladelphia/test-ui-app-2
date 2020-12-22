import Vue from 'vue';
import Vuex from 'vuex';
import pvdStore from '@phila/vue-datafetch/src/store';
import pvmStore from '@phila/vue-mapping/src/store';
// import pvcStore from '@phila/vue-comps/src/store';
import mergeDeep from './util/merge-deep';

// when you load vuex from a script tag this seems to happen automatically
Vue.use(Vuex);

function createStore(config) {
  console.log('createStore is running, config:', config);
  const sources = pvdStore.createSources(config);
  const initialState = {
    sources,
    windowDimensions: {
      height: 0,
      width: 0,
    },
    fullScreen: {
      mapOnly: false,
      cycloOnly: false,
    },
    fullScreenMapEnabled: false,
    fullScreenImageryEnabled: false,
    map: {
      basemap: 'pwd',
      zoom: 14,
      latestSelectedResourceFromMap: null,
      popupCoords: null,
      selectedPopupLayer: null,
    },
    bufferList: null,
    currentData: [],
    selectedResources: [],
    latestSelectedResourceFromExpand: null,
    refineOpen: false,
    subsections: {},
    alertResponse: null,
    gtag: {
      category: 'unspecified-pinboard-app',
    },
  };
  const mb = {
    state: initialState,
    getters: {},
    mutations: {
      setCandidates(state, payload) {
        state.candidates = payload;
      },
      setWindowDimensions(state, payload) {
        state.windowDimensions = payload;
      },
      setMapOnly(state, payload) {
        state.fullScreen.mapOnly = payload;
      },
      setCycloOnly(state, payload) {
        state.fullScreen.CycloOnly = payload;
      },
      setFullScreenMapEnabled(state, payload) {
        // console.log('setFullScreenMapEnabled is running, payload:', payload);
        state.fullScreenMapEnabled = payload;
      },
      setFullScreenImageryEnabled(state, payload) {
        state.fullScreenImageryEnabled = payload;
      },

      setGtagCategory(state, payload) {
        state.gtag.category = payload;
      },
      setIsMobileOrTablet(state, payload) {
        state.isMobileOrTablet = payload;
      },
      setalertResponse(state, payload) {
        state.alertResponse = payload;
      },
      setSubsections(state, payload) {
        state.subsections = payload;
      },
      setRefineOpen(state, payload) {
        state.refineOpen = payload;
      },
      setBufferList(state, payload) {
        state.bufferList = payload;
      },
      setCurrentData(state, payload) {
        state.currentData = payload;
      },
      setSelectedResources(state, payload) {
        state.selectedResources = payload;
      },
      setLatestSelectedResourceFromExpand(state, payload) {
        state.latestSelectedResourceFromExpand = payload;
      },
      setLatestSelectedResourceFromMap(state, payload) {
        state.map.latestSelectedResourceFromMap = payload;
      },
      setPopupCoords(state, payload) {
        state.map.popupCoords = payload;
      },
      setSelectedPopupLayer(state, payload) {
        state.map.selectedPopupLayer = payload;
      },
    },
  };

  // let mergeStore = mergeDeep(pvcStore, pvdStore.store);
  let mergeStore = mergeDeep(pvdStore.store, pvmStore);
  mergeStore = mergeDeep(mergeStore, mb);

  return new Vuex.Store({
    state: mergeStore.state,
    getters: mergeStore.getters,
    mutations: mergeStore.mutations,
  });
}

export default createStore;
