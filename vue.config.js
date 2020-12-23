module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "~@phila/phila-ui/src/assets/styles/scss/functions.scss";
          @import "~@phila/phila-ui/src/assets/styles/scss/colors.scss";
        `,
      },
    },
  },

  transpileDependencies: [
    // can be string or regex
    '@phila/phila-ui',
    '@phila/vue-mapping',
    '@phila/vue-datafetch',
  ],

  lintOnSave: false
};
