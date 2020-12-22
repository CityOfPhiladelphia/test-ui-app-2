import immigrant from './data-sources/immigrant';

const config = {
  app: {
    title: '@phila/phila-ui and @phila/vue-mapping',
    type: 'immigrant',
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
  mbStyle: {
    version: 8,
    sources: {
      pwd: {
        tiles: [
          'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap/MapServer/tile/{z}/{y}/{x}',
        ],
        type: 'raster',
        tileSize: 256,
      },
    },
    layers: [
      {
        id: 'pwd',
        type: 'raster',
        source: 'pwd',
      },
    ],
  },
};

export default config;
