<template>
  <div id="app">
    <app-header
      :app-title="$config.app.title"
    />

    <div class="main-content">

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

    <map-panel />

  </div>
</template>

<script>

import 'mapbox-gl/dist/mapbox-gl.css';
import {
  AppHeader,
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
    InputForm,
    Textbox,
    MapPanel,
  },
  data () {
    return {
      myValue: '',
    };
  },
  methods: {
    handleSubmit() {
      this.$controller.handleSearchFormSubmit(this.myValue);
    },
  },
};
</script>

<style lang="scss">
  @import "./assets/scss/main.scss";

  .main-content {
    margin-top: 80px;
  }

</style>
