<template>
  <div class="app">
    <app-header
      :app-title="$config.app.title"
      :is-sticky="true"
    >
      <mobile-nav slot="mobile-nav">
        <ul>
          <li>
            <a href="/home">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
        </ul>
      </mobile-nav>
    </app-header>

    <main
      class="main no-padding columns"
    >
      <div class="column overflows">

        <!-- <input-form>
          <textbox
            v-model="myValue"
            placeholder="Search an address"
            label="Search an address in Philadelphia"
          />
          <button
            slot="submit"
            class="is-cta button"
            @click.prevent="handleSubmit"
          >
            Submit
          </button>
        </input-form> -->



        <!-- <div
          v-for="item in currentData"
          :key="item.cartodb_id"
        >
          <expand-collapse
            :item="item"
          >
          </expand-collapse>
        </div> -->
        <locations-panel />

      </div>

      <div class="column no-padding">
        <map-panel />
      </div>

    </main>

    <app-footer
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
import {
  AppHeader,
  MobileNav,
  AppFooter,
  // InputForm,
  // Textbox,
} from '@phila/phila-ui';

// import { ValidationObserver, withValidation, extend } from 'vee-validate';
import MapPanel from './components/MapPanel.vue';
import LocationsPanel from './components/LocationsPanel.vue';
// import ExpandCollapse from './components/ExpandCollapse.vue';

// import { required } from 'vee-validate/dist/rules';
// extend('required', {
//   ...required,
//   message: 'This field is required',
// });

// const VeeTextbox = withValidation(Textbox);

export default {
  name: 'App',
  components: {
    AppHeader,
    MobileNav,
    AppFooter,
    // InputForm,
    // Textbox,
    MapPanel,
    LocationsPanel,
    // ExpandCollapse,
  },
  data () {
    return {
      myValue: '',
    };
  },
  computed: {
    currentData() {
      let value = {};
      if (this.$store.state.sources.immigrant && this.$store.state.sources.immigrant.data) {
        value = this.$store.state.sources.immigrant.data.rows;
      } else {
        value = {};
      }
      return value;
    },
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  mounted() {
    console.log('App.vue this.$config:', this.$config);
    this.handleResize();

    if (this.$config.dataSources) {
      console.log('App.vue mounted, there are dataSources');
      this.$controller.dataManager.fetchData();
    }

  },
  methods: {
    handleResize () {
      let header = document.querySelector('#app-header');
      let footer = document.querySelector('#app-footer');
      let main = document.querySelector('main');
      let headerOffsetHeight = header.offsetHeight || 0;
      let footerOffsetHeight = 0;
      if (footer !== null) {
        footerOffsetHeight = footer.offsetHeight;
      }
      let offsetHeight = headerOffsetHeight + footerOffsetHeight;
      main.style['height'] = `calc(100vh - ${offsetHeight}px)`;
      main.style['padding-bottom'] = '0px';
      main.style['margin-bottom'] = '0px';
      // console.log('App.vue handleResize, offsetHeight:', offsetHeight, 'headerOffsetHeight:', headerOffsetHeight, 'footerOffsetHeight:', footerOffsetHeight);

    },
    handleSubmit() {
      this.$controller.handleSearchFormSubmit(this.myValue);
    },
  },
};
</script>

<style lang="scss">
  @import "./assets/scss/main.scss";

  ::-webkit-scrollbar {
    display: none;
  }

  .no-padding {
    padding: 0px;
  }

  .overflows {
    overflow-y: scroll;
  }

</style>
