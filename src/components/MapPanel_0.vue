<template>
  <!-- <div
    id="map-panel"
  > -->
  <!-- class='map-panel-class' -->

    <MglMap
      :map-style.sync="mbStyle"
      :zoom="18"
      :center="mapCenter"
    >

      <MglRasterLayer
        v-for="(basemapSource, key) in basemapSources"
        v-if="activeBasemap === key"
        :key="key"
        :source-id="activeBasemap"
        :layer-id="activeBasemap"
        :layer="basemapSource.layer"
        :source="basemapSource.source"
      />

      <MglRasterLayer
        v-for="(basemapLabelSource, key) in basemapLabelSources"
        v-if="tiledLayers.includes(key)"
        :key="key"
        :source-id="key"
        :layer-id="key"
        :layer="basemapLabelSource.layer"
        :source="basemapLabelSource.source"
      />
    </MglMap>
  <!-- </div> -->

</template>

<script>

import 'mapbox-gl/dist/mapbox-gl.css';

export default {
  name: 'MapPanel',
  components: {
    MglMap: () => import(/* webpackChunkName: "pvm_MglMap" */'@phila/vue-mapping/src/mapbox/map/GlMap.vue'),
    MglRasterLayer: () => import(/* webpackChunkName: "pvm_MglRasterLayer" */'@phila/vue-mapping/src/mapbox/layer/RasterLayer.vue'),
  },
  data() {
    const data = {
      mapCenter: [ -75.163471, 39.953338 ],
      activeBasemap: 'pwd',
      tiledLayers: [ 'cityBasemapLabels' ],
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
    return data;
  },
  computed: {
    basemapSources() {
      return {
        pwd: {
          source: {
            tiles: [
              'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap/MapServer/tile/{z}/{y}/{x}',
              // '//tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap_Labels/MapServer/tile/{z}/{y}/{x}'
            ],
            type: 'raster',
            tileSize: 256,
          },
          layer: {
            id: 'pwd',
            type: 'raster',
          },
        },
        imagery2019: {
          source: {
            tiles: [
              'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityImagery_2019_3in/MapServer/tile/{z}/{y}/{x}',
              // '//tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap_Labels/MapServer/tile/{z}/{y}/{x}'
            ],
            type: 'raster',
            tileSize: 256,
          },
          layer: {
            id: 'imagery2019',
            type: 'raster',
          },
        },
      };
    },
    basemapLabelSources() {
      return {
        cityBasemapLabels: {
          source: {
            tiles: [ 'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap_Labels/MapServer/tile/{z}/{y}/{x}' ],
            type: 'raster',
            tileSize: 256,
          },
          layer: {
            id: 'cityBasemapLabels',
            type: 'raster',
          },
        },
        imageryBasemapLabels: {
          source: {
            tiles: [ 'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityImagery_Labels/MapServer/tile/{z}/{y}/{x}' ],
            type: 'raster',
            tileSize: 256,
          },
          layer: {
            id: 'imageryBasemapLabels',
            type: 'raster',
          },
        },
      };
    },
    geocodeCoordinates() {
      let value;
      if (this.$store.state.geocode.data) {
        value = this.$store.state.geocode.data.geometry.coordinates;
      } else {
        value = null;
      }
      return value;
    },
  },
  watch: {
    geocodeCoordinates(nextGeocodeCoordinates) {
      this.mapCenter = nextGeocodeCoordinates;
    },
  },
};
</script>

<style lang="scss">
  @import "../assets/scss/main.scss";

  .map-panel-class {
    // position: relative;
    min-height: 300px;
    height: 100%;
    width: 100%;
  }

</style>
