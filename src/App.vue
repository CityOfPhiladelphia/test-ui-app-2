<template>
  <div class="app">
    <app-header
      :app-title="$config.app.title"
      :is-sticky="true"
    />

    <main
      class="main no-padding columns"
    >
      <div class="column">
        <input-form>
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
        </input-form>
      </div>

      <div class="column no-padding">
        <map-panel />
      </div>

    </main>

    <app-footer
      :is-sticky="true"
      :is-hidden-mobile="true"
    >
    </app-footer>

  </div>
</template>

<script>

import Vue from 'vue';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  AppHeader,
  AppFooter,
  InputForm,
  Textbox,
} from '@phila/phila-ui';

// import { ValidationObserver, withValidation, extend } from 'vee-validate';
import MapPanel from './components/MapPanel.vue';

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
    AppFooter,
    InputForm,
    Textbox,
    MapPanel,
  },
  data () {
    return {
      myValue: '',
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
  },
  mounted() {
    this.handleResize();
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

</style>
