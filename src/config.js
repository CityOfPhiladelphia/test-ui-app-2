import immigrant from './data-sources/immigrant';

const config = {
  app: {
    title: '@phila/phila-ui and @phila/vue-mapping',
  },
  router: {},
  geocoder: {
    url: function (input) {
      var inputEncoded = encodeURIComponent(input);
      return 'https://api.phila.gov/ais/v1/search/' + inputEncoded;
    },
    params: {
      gatekeeperKey: process.env.VUE_APP_GATEKEEPER_KEY,
      include_units: true,
    },
  },
  map: {
    containerClass: 'map-container',
  },
  dataSources: {
    immigrant,
  },
  locationInfo: {
    siteName: 'organization_name',
  },
};

export default config;
