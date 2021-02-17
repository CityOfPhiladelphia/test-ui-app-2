<template>
  <div class="app">
    <app-header
      :app-title="$config.app.title"
      :is-sticky="true"
    >
    <!-- :branding-image="brandingImage"
    :branding-link="brandingLink" -->
      <!-- <mobile-nav slot="mobile-nav">
        <ul>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
        </ul>
      </mobile-nav> -->
      <input-form slot="textbox-form">
        <div class="columns">
          <textbox
            v-model="myValue"
            class="column is-10"
            placeholder="Search an address"
            label="Search an address in Philadelphia"
          />
          <button
            slot="submit"
            class="button is-dark is-large"
            @click.prevent="handleSubmit"
          >
            Submit
          </button>
        </div>
      </input-form>
    </app-header>

    <main
      class="no-padding main-container"
    >
      <div
        v-if="refineEnabled"
        :class="refinePanelClass"
      >
        <refine-panel />
      </div>
      <div
        v-show="!isMobile || isMobile && !refineOpen"
        class="locations-and-map-panels-holder columns"
      >
        <div
          v-show="locationsPanelVisible"
          class="locations-panel-holder column"
        >
          <locations-panel />
          <!-- LOCATIONS PANEL HOLDER -->
        </div>

        <div
          v-show="mapPanelVisible"
          class="map-panel-holder column"
        >
          <map-panel />
          <!-- MAP PANEL HOLDER -->
        </div>

      </div>

      <div
        v-show="toggleButtonVisible"
        class="toggle-button"
        @click="toggleMap"
      >
        TOGGLE
      </div>
<!--
      <div
        id="column-div"
        class="columns is-mobile"
      >

        <div
          v-show="isTablet || isDesktop || !isMapVisible"
          class="column overflows"
        >
          <locations-panel />
        </div>

        <div
          v-show="isTablet || isDesktop || isMapVisible"
          class="column no-padding"
        >
          <map-panel />
        </div>

      </div> -->

    </main>

    <app-footer
      id="app-footer"
      :is-sticky="true"
      :is-hidden-mobile="true"
    >
      <ul>
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/terms-and-conditions">Terms & Conditions</a>
        </li>
      </ul>
    </app-footer>

  </div>
</template>
<script>

import 'mapbox-gl/dist/mapbox-gl.css';
import Vue from 'vue';

import {
  AppHeader,
  MobileNav,
  AppFooter,
  InputForm,
  Textbox,
} from '@phila/phila-ui';

import { point } from '@turf/helpers';
import buffer from '@turf/buffer';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

// import AlertBanner from './components/AlertBanner.vue';
// import i18nBanner from './components/i18nBanner.vue';
// import PhilaModal from './components/PhilaModal.vue';
import RefinePanel from './components/RefinePanel.vue';
// import AppHeader from './components/AppHeader';
import LocationsPanel from './components/LocationsPanel.vue';
import MapPanel from './components/MapPanel.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    MobileNav,
    AppFooter,
    InputForm,
    Textbox,
    // AlertBanner,
    // i18nBanner,
    // PhilaModal,
    RefinePanel,
    LocationsPanel,
    MapPanel,
    // CyclomediaWidget: () => import(/* webpackChunkName: "mbmb_pvm_CyclomediaWidget" */'@phila/vue-mapping/src/cyclomedia/Widget.vue'),
  },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      // isMapVisible: false,
      // isModalOpen: false,
      // isAlertModalOpen: false,
      // isLarge: true,
      // buffer: null,
      // buttonText: 'Toggle to map',
      // appLink: '/',
      myValue: '',
      brandingImage: {
        src: require('@/assets/logo.png'),
        alt: "City of Philadelphia Office of Immigrant Affairs logo",
        width: "200px",
      },
      brandingLink: {
        href: 'https://www.phila.gov/',
        target: '_blank',
      },
      dropdownOptions: {
        address: {
          text: 'Address',
          data: null,
        },
        keyword: {
          text: 'Keyword',
          data: null,
        },
      },
      // i18nEnabled: true,
      refineEnabled: true,
      isMapVisible: false,
      buttonText: 'Toggle to map',
    };
  },
  computed: {
    feedbackLink() {
      let value;
      if (this.$config.footer && this.$config.footer.feedback && this.$config.footer.feedback.link) {
        value = this.$config.footer.feedback.link;
      }
      return value;
    },
    mapType() {
      return this.$store.state.map.type;
    },
    alertResponse() {
      return this.$store.state.alertResponse || null;
    },
    shouldShowHeaderAlert() {
      let value = false;
      if (this.$config.alerts && this.$config.alerts.header) {
        value = this.$config.alerts.header.enabled(this.$store.state);
      }
      return value;
    },
    alertModalHeader() {
      let value = '';
      if (this.$config.alerts && this.$config.alerts.modal && this.$config.alerts.modal.header) {
        value = this.$config.alerts.modal.header;
      }
      return value;
    },
    alertModalBody() {
      let value = '';
      if (this.$config.alerts && this.$config.alerts.modal && this.$config.alerts.modal.body) {
        value = this.$config.alerts.modal.body;
      }
      return value;
    },
    i18nEnabled() {
      let value;
      if (this.$config.i18n && this.$config.i18n.enabled) {
        value = true;
      } else {
        value = false;
      }
      return value;
    },
    geocodeStatus() {
      return this.$store.state.geocode.status;
    },
    geocodeResult() {
      return this.$store.state.geocode.data || {};
    },
    geocodeGeom() {
      return this.geocodeResult.geometry;
    },
    bufferList() {
      return this.$store.state.bufferList;
    },
    selectedKeywords() {
      return this.$store.state.selectedKeywords;
    },
    selectedServices() {
      return this.$store.state.selectedServices;
    },
    dataStatus() {
      let value;
      if (this.$store.state.sources[this.$appType]) {
        value = this.$store.state.sources[this.$appType].status;
      }
      return value;
    },
    database() {
      let database = this.$store.state.sources[this.$appType].data.rows || this.$store.state.sources[this.$appType].data.features || this.$store.state.sources[this.$appType].data;
      // console.log('computed database is running, database:', database);

      for (let [ key, value ] of Object.entries(database)) {

        if (this.$config.hiddenRefine) {
          for (let field in this.$config.hiddenRefine) {
            let getter = this.$config.hiddenRefine[field];
            let val = getter(value);
            if (val === false) {
              delete database[key];
            }
          }
        }

        for (let [ rowKey, rowValue ] of Object.entries(value)) {
          if ( rowKey == 'hide_on_finder' && rowValue == true ){
            //console.log('deleted entry', database[key])
            delete database[key];
          }
        }

      }
      //filter empty values from deleted database
      let finalDB = database.filter(_ => true);
      return finalDB;
    },
    shouldLoadCyclomediaWidget() {
      return this.$config.cyclomedia && this.$config.cyclomedia.enabled && !this.isMobileOrTablet;
    },
    cyclomediaActive() {
      return this.$store.state.cyclomedia.active;
    },
    cycloLatlng() {
      if (this.$store.state.cyclomedia.orientation.xyz !== null) {
        const xyz = this.$store.state.cyclomedia.orientation.xyz;
        return [ xyz[1], xyz[0] ];
      }
      const center = this.$config.map.center;
      return center;

    },
    cycloRotationAngle() {
      return this.$store.state.cyclomedia.orientation.yaw * (180/3.14159265359);
    },
    cycloHFov() {
      return this.$store.state.cyclomedia.orientation.hFov;
    },
    selectedResources() {
      return this.$store.state.selectedResources;
    },
    sourcesWatched() {
      let sources = Object.keys(this.$store.state.sources);
      const index = sources.indexOf('compiled');
      let sourcesWatched = [];
      if (index > -1) {
        sources.splice(index, 1);


        for (let source of sources) {
          sourcesWatched.push(this.$store.state.sources[source].data);
        }
      } else {
        sourcesWatched = null;
      }
      return sourcesWatched;
    },

    layoutDescription() {
      let value;
      if (this.isMobile && !this.refineEnabled) {
        value = 'mobileNoRefine';
      } else if (this.isMobile && this.refineEnabled && this.refineOpen) {
        value = 'mobileRefineOpen';
      } else if (this.isMobile && this.refineEnabled && !this.refineOpen) {
        value = 'mobileRefineClosed';
      } else if (!this.refineEnabled) {
        value = 'nonMobileNoRefine';
      } else {
        value = 'nonMobileRefine';
      }
      return value;
    },
    refinePanelClass() {
      let value;
      if (this.refineOpen) {
        value = 'refine-panel-holder-open';
      } else {
        value = 'refine-panel-holder';
      }
      return value;
    },
    locationsPanelVisible() {
      return !this.isMobile || this.layoutDescription !== 'mobileRefineOpen' && !this.isMapVisible;
    },
    mapPanelVisible() {
      return !this.isMobile || this.layoutDescription !== 'mobileRefineOpen' && this.isMapVisible;
    },
    toggleButtonVisible() {
      return this.isMobile && this.layoutDescription !== 'mobileRefineOpen';
    },
    refineOpen() {
      return this.$store.state.refineOpen;
    },
  },
  watch: {
    isMobile(nextIsMobile) {
      if (nextIsMobile) {
        console.log('is mobile');
        this.handleResize();
      }
    },
    isTablet(nextIsTablet) {
      if (nextIsTablet) {
        console.log('is tablet');
        this.handleResize();
      }
    },
    isDesktop(nextIsDesktop) {
      if (nextIsDesktop) {
        console.log('is desktop');
        this.handleResize();
      }
    },
    isWideScreen(nextIsWidescreen) {
      if (nextIsWidescreen) {
        console.log('is widescreen');
        this.handleResize();
      }
    },
    sourcesWatched(nextSourcesWatched) {
      console.log('watch sourcesWatched, nextSourcesWatched:', nextSourcesWatched);
      if (!nextSourcesWatched.includes(null)) {
        this.setUpData(nextSourcesWatched);
      }
    },
    geocodeStatus(nextGeocodeStatus) {
      if (nextGeocodeStatus === 'success') {
        this.runBuffer();
      } else if (nextGeocodeStatus === null) {
        this.$data.buffer = null;
      }
    },
    buffer() {
      this.filterPoints();
    },
    selectedServices() {
      if (this.$store.state.sources[this.$appType].data) {
        this.filterPoints();
      }
    },
    selectedKeywords() {
      if (this.$store.state.sources[this.$appType].data) {
        this.filterPoints();
      }
    },
    dataStatus(nextDataStatus) {
      if (nextDataStatus === 'success') {
        this.filterPoints();
      }
    },
  },
  created() {
    if (this.$config.map) {
      if (this.$config.map.shouldInitialize === false) {
        this.$store.commit('setShouldInitializeMap', false);
      }
      if (this.$config.map.type) {
        this.$store.commit('setMapType', this.$config.map.type);
      }
    }
    // window.addEventListener('resize', this.handleResize);
  },
  mounted() {
    console.log('in App.vue mounted, this.$store.state:', this.$store.state, 'this.$config:', this.$config, 'window.location.href:', window.location.href);
    // this.track();

    if (this.$config.appLink) {
      this.appLink = this.$config.appLink;
    } else {
      this.appLink = '.';
    }
    if (this.$config.dataSources) {
      this.$controller.dataManager.fetchData();
    }
    // this.setUpData(this.$store.state.sources);

    if (!this.i18nEnabled) {
      this.$data.buttonText = this.$data.isMapVisible ? 'Toggle to resource list' : 'Toggle to map';
    } else {
      this.$data.buttonText = this.$data.isMapVisible ? 'app.viewList' : 'app.viewMap';
    }

    if (this.$config.alerts && this.$config.alerts.modal && this.$config.alerts.modal.enabled) {
      this.isAlertModalOpen = true;
    }

    if (this.$config.comboSearch) {
      if (this.$config.comboSearch.dropdown) { //&& this.$config.comboSearch.dropdown.length === 1) {
        this.$store.commit('setSearchType', this.$config.comboSearch.dropdown[0]);
      }
    }

    if (this.$config.gtag && this.$config.gtag.category) {
      this.$store.commit('setGtagCategory', this.$config.gtag.category);
    }

    // this.handleResize();
  },


  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    // handleResize () {
    //   console.log('handleResize is starting');
    //   //wait for dom to finish updating
    //   let isMobile = this.isMobile;
    //   Vue.nextTick(function () {
    //     let header = document.querySelector('#app-header');
    //     let footer = document.querySelector('#app-footer');
    //     let switchButton = document.querySelector('#switch-button');
    //     let main = document.querySelector('main');
    //     let refineDiv = document.querySelector('#refine-div');
    //     let columnDiv = document.querySelector('#column-div');
    //     let refineDivOffsetHeight = refineDiv.offsetHeight || 0;
    //     let headerOffsetHeight = header.offsetHeight || 0;
    //     let headerClientHeight = header.clientHeight || 0;
    //     let headerInnerHeight = header.clientHeight || 0;
    //     let footerOffsetHeight = 0;
    //     if (footer !== null) {
    //       footerOffsetHeight = footer.offsetHeight;
    //     }
    //     let switchButtonOffsetHeight = switchButton.offsetHeight;
    //     let offsetHeight;
    //     if (isMobile) {
    //       let offsetHeight = headerOffsetHeight  + switchButtonOffsetHeight + refineDivOffsetHeight;
    //       console.log('handleResize isMobile, offsetHeight:', offsetHeight, 'headerClientHeight:', headerClientHeight, 'headerOffsetHeight:', headerOffsetHeight, 'footerOffsetHeight:', footerOffsetHeight, 'switchButtonOffsetHeight:', switchButtonOffsetHeight);
    //     } else {
    //       let offsetHeight = headerOffsetHeight + footerOffsetHeight;
    //       let offsetHeight2 = headerOffsetHeight + refineDivOffsetHeight;
    //       console.log('handleResize is NOT mobile, refineDiv:', refineDiv, 'refineDivOffsetHeight:', refineDivOffsetHeight, 'offsetHeight2:', offsetHeight2, 'offsetHeight:', offsetHeight, 'headerClientHeight:', headerClientHeight, 'headerOffsetHeight:', headerOffsetHeight, 'footerOffsetHeight:', footerOffsetHeight, 'switchButtonOffsetHeight:', switchButtonOffsetHeight);
    //       main.style['height'] = `calc(100vh - ${offsetHeight}px)`;
    //       main.style['padding-bottom'] = '0px';
    //       main.style['margin-bottom'] = '0px';
    //       refineDiv.style['top'] = headerOffsetHeight + 'px';
    //       columnDiv.style['margin-top'] = offsetHeight2 + 'px';
    //       columnDiv.style['height'] = `calc(100vh - ${offsetHeight2}px)`;
    //     }
    //     // console.log('App.vue handleResize, offsetHeight:', offsetHeight, 'headerOffsetHeight:', headerOffsetHeight, 'footerOffsetHeight:', footerOffsetHeight);
    //     console.log('end of handleResize');
    //   });
    //
    // },

    handleResize () {
      console.log('handleResize is starting');
      //wait for dom to finish updating
      let isMobile = this.isMobile;
      Vue.nextTick(function () {
        let header = document.querySelector('#app-header');
        let footer = document.querySelector('#app-footer');
        let main = document.querySelector('main');
        let refine = document.querySelector('.refine-panel-holder');
        let locations = document.querySelector('.locations-and-map-panels-holder');
        let headerOffsetHeight = header.offsetHeight || 0;
        let footerOffsetHeight = 0;
        if (footer !== null) {
          footerOffsetHeight = footer.offsetHeight;
        }
        let refineOffsetHeight = 0;
        if (refine !== null) {
          refineOffsetHeight = refine.offsetHeight;
          // refineOffsetHeight = refine.height;
        }
        // let offsetHeight;
        if (isMobile) {
          let offsetHeight = headerOffsetHeight;
          console.log('handleResize isMobile, header:', header, 'offsetHeight:', offsetHeight, 'headerOffsetHeight:', headerOffsetHeight, 'footerOffsetHeight:', footerOffsetHeight);
          // main.style['min-height'] = `calc(100vh - ${headerOffsetHeight}px)`;
          main.style['height'] = `calc(100vh - ${headerOffsetHeight}px)`;
          locations.style['height'] = `calc(100vh - ${headerOffsetHeight}px)`;
        } else {
          let offsetHeight = headerOffsetHeight + footerOffsetHeight;
          // let offsetHeight = headerOffsetHeight + refineOffsetHeight + footerOffsetHeight;
          console.log('handleResize is NOT mobile, offsetHeight:', offsetHeight, 'headerOffsetHeight:', headerOffsetHeight, 'refineOffsetHeight:', refineOffsetHeight, 'footerOffsetHeight:', footerOffsetHeight);
          // main.style['min-height'] = `calc(100vh - ${offsetHeight}px)`;
          main.style['height'] = `calc(100vh - ${offsetHeight}px)`;
          locations.style['height'] = `calc(100vh - ${offsetHeight}px)`;
        }
      });
    },

    handleSubmit() {
      this.$controller.handleSearchFormSubmit(this.myValue);
    },
    // track () {
    //   console.log('track is running');
    //   this.$gtag.pageview({
    //     page_path: '/',
    //   });
    //
    //   this.$gtag.event('page view', {
    //     'event_category': 'rf-voting',
    //     'event_label': 'page-view-label',
    //     // 'value': 'page-view',
    //   })
    // },
    setUpData(theSources) {
      console.log('Pinboard App.vue setUpData is running, theSources:', theSources);
      let compiled = {
        key: 'compiled',
        data: [],
        status: 'success',
      };
      if (theSources.length > 1) {
        console.log('this.$store.state.sources:', this.$store.state.sources);
        for (let source of theSources) {
          // console.log('source:', source, 'this.$store.state.sources[source].data:', this.$store.state.sources[source].data);
          for (let point of source.features) {
            // console.log('point:', point);

            // Object.assign(point, point.attributes);
            // point.attributes = undefined;
            compiled.data.push(point);
          }
        }
        // console.log('compiled:', compiled);
        this.$store.commit('setSourceData', compiled);
        this.$store.commit('setSourceStatus', compiled);
      }
      console.log('end of setUpData, this.$store.state.sources:', this.$store.state.sources);
    },
    runBuffer() {
      let searchDistance = 1;
      if (this.$config.comboSearch.searchDistance) {
        searchDistance = this.$config.comboSearch.searchDistance;
      }
      console.log('runBuffer is running, searchDistance:', searchDistance);
      const geocodePoint = point(this.geocodeGeom.coordinates);
      const pointBuffer = buffer(geocodePoint, searchDistance, { units: 'miles' });
      this.$data.buffer = pointBuffer;
    },
    filterPoints() {
      // console.log('App.vue filterPoints is running, this.database:', this.database);
      const filteredRows = [];

      for (const row of this.database) {
        // console.log('row:', row);
        let booleanServices;
        const { selectedServices } = this.$store.state;
        // console.log('row.services_offered:', row.services_offered);

        if (this.$config.refine && this.$config.refine.type && [ 'multipleFields', 'multipleFieldGroups' ].includes(this.$config.refine.type)) {
          let booleanConditions = [];

          if (selectedServices.length === 0) {
            booleanConditions.push(true);
          } else {

            // if refine.type = multipleFields
            if (this.$config.refine.type === 'multipleFields') {
              for (let field in this.$config.refine.multipleFields) {
                if (selectedServices.includes(field)) {

                  let getter = this.$config.refine.multipleFields[field];
                  let val = getter(row);
                  booleanConditions.push(val);
                }
              }
            } else {
              // if refine.type = multipleFieldsGroups
              for (let group in this.$config.refine.multipleFieldGroups) {
                for (let field in this.$config.refine.multipleFieldGroups[group]) {
                  // console.log('field:', field, "this.$config.refine.multipleFieldGroups[group][field]['unique_key']:", this.$config.refine.multipleFieldGroups[group][field]['unique_key']);
                  let unique_key = this.$config.refine.multipleFieldGroups[group][field]['unique_key'];
                  if (selectedServices.includes(unique_key)) {
                    let getter = this.$config.refine.multipleFieldGroups[group][field]['value'];
                    let val = getter(row);
                    booleanConditions.push(val);
                  }
                }
              }
            }

          }
          if (!booleanConditions.includes(false)) {
            // console.log('booleanConditions includes true:', booleanConditions);
            booleanServices = true;
          }

        // if refine.type = categoryField_value
        } else if (this.$config.refine && this.$config.refine.type === 'categoryField_value') {
          if (selectedServices.length === 0) {
            booleanServices = true;
          } else {
            let value = this.$config.refine.value(row);
            // console.log('in App.vue, filterPoints computed, value:', value);
            booleanServices = selectedServices.includes(value);
          }

        } else {
          // the original default version, or refine.type = 'categoryField_array'
          let servicesSplit;
          if (this.$config.refine) {
            servicesSplit = this.$config.refine.value(row);
          } else if (row.services_offered) {
            servicesSplit = row.services_offered;
          }

          if (selectedServices.length === 0) {
            booleanServices = true;
          } else {
            const servicesFiltered = servicesSplit.filter(f => selectedServices.includes(f));
            // console.log('servicesFiltered:', servicesFiltered, 'selectedServices:', selectedServices);
            // booleanServices = servicesFiltered.length > 0;
            booleanServices = servicesFiltered.length == selectedServices.length;
          }
        }

        let booleanBuffer = false;
        if (!this.$data.buffer) {
          // console.log('!this.$data.buffer');
          booleanBuffer = true;
        } else if (row.latlng) {
          if (typeof row.latlng[0] === 'number' && row.latlng[0] !== null) {
            const rowPoint = point([ row.latlng[1], row.latlng[0] ]);
            if (booleanPointInPolygon(rowPoint, this.$data.buffer)) {
              booleanBuffer = true;
            }
          }
        }

        let booleanKeywords = true;
        // console.log('this.selectedKeywords:', this.selectedKeywords, 'this.selectedKeywords.length:', this.selectedKeywords.length);
        if (this.selectedKeywords.length > 0) {
          booleanKeywords = false;
          let description = [];
          if (Array.isArray(row.tags)) {
            description = row.tags;
          } else if (row.tags) {
            description = row.tags.split(', ');
          } else if (this.$config.tags && this.$config.tags.type == 'fieldValues') {
            for (let tag of this.$config.tags.tags) {
              // console.log('tag:', tag, 'tag.field:', tag.field, 'row.attributes[tag.field]:', row.attributes[tag.field]);
              if (tag.type == 'boolean' && row.attributes[tag.field] == 'Yes') {
                description.push(tag.value);
              } else if (tag.type == 'value' && row.attributes[tag.field] !== null && row.attributes[tag.field] != ' ') {
                description.push(row.attributes[tag.field].charAt(0) + row.attributes[tag.field].substring(1).toLowerCase());
              }
            }
          }
          // console.log('still going, row.tags:', row.tags, 'description:', description);
          let lowerCaseDescription = [];
          for (let tag of description) {
            lowerCaseDescription.push(tag.toLowerCase());
          }
          const keywordsFiltered = this.selectedKeywords.filter(function(f) {
            // console.log('filter, f:', f, 'f.toLowerCase():', f.toLowerCase(), 'lowerCaseDescription:', lowerCaseDescription, 'lowerCaseDescription.includes(f.toLowerCase()):', lowerCaseDescription.includes(f.toLowerCase()));
            return lowerCaseDescription.includes(f.toLowerCase());
          });
          // console.log('description:', description, 'lowerCaseDescription:', lowerCaseDescription, 'keywordsFiltered:', keywordsFiltered);
          if (keywordsFiltered.length > 0) {
            booleanKeywords = true;
          }
        }

        if (booleanServices && booleanBuffer && booleanKeywords) {
          filteredRows.push(row);
        }
      }

      this.$store.commit('setCurrentData', filteredRows);
    },
    toggleMap() {
      this.$data.isMapVisible = !this.$data.isMapVisible;
      console.log('toggleMap is running, this.$data.isMapVisible:', this.$data.isMapVisible);
      if (this.$data.isMapVisible === true) {
        console.log('toggleMap is running, this.$data.isMapVisible === true');
        // console.log('setTimeout function is running');
        // if (this.mapType === 'leaflet') {
        //   this.$store.state.map.map.invalidateSize();
        // } else if (this.mapType === 'mapbox') {
        let themap = this.$store.map;
        setTimeout(function() {
          console.log('mapbox running map resize now');
          themap.resize();
          console.log('mapbox ran map resize');
        }, 250);
      }
      //   }
      // }
      // if (!this.i18nEnabled) {
      //   this.$data.buttonText = this.$data.isMapVisible ? 'Toggle to resource list' : 'Toggle to map';
      // } else {
      //   this.$data.buttonText = this.$data.isMapVisible ? 'app.viewList' : 'app.viewMap';
      // }
    },
    toggleModal() {
      this.isModalOpen = !this.isModalOpen;
      this.toggleBodyClass('no-scroll');
    },
    showModal() {
      this.isModalOpen = true;
      this.toggleBodyClass('no-scroll');
    },
    closeModal() {
      this.isModalOpen = false;
      this.isAlertModalOpen = false;
      this.toggleBodyClass('no-scroll');
    },
    toggleBodyClass(className) {
      const el = document.body;
      return this.isOpen ? el.classList.add(className) : el.classList.remove(className);
    },
  },
};
</script>

<style lang="scss">
@import "./assets/scss/main.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #000000;
}

.container {
  grid-gap: 1px;
}

.no-padding {
  padding: 0px !important;
}

.main-container {
  display: flex;
  display: -ms-flexbox;
  flex-direction: column;
  // background-color: red;
}

.locations-and-map-panels-holder {
  flex-grow: 1;
  display: flex;
  display: -ms-flexbox;
  flex-direction: row;
  margin: 0px !important;
  // background-color: yellow;
}

.i18n-panel-holder {
  background-color: white;
}

.refine-panel-holder {
  background-color: #f0f0f0;
}

.refine-panel-holder-open {
  flex-grow: 1;
  background-color: #f0f0f0;
}

.locations-panel-holder {
  overflow-y: scroll;
  padding: 0px;
  // background-color: #88d8b0;
}

.map-panel-holder {
  padding: 0px;
  // background-color: #ff6f69;
}

.toggle-button {
  background-color: #d2d2d2;
}

::-webkit-scrollbar {
  display: none;
}

</style>
