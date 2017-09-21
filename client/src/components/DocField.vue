<template>
  <div class="doc-field">
  </div>
</template>

<script>
  // const interact = require('interact.js')

  export default {
    name: 'doc-field',
    props: ['docField'],
    data () {
      return {
        // showEditor: false,
        // previewImageSrc: '',
        // name: '',
        // docFields: [],
      }
    },
    watch: {
    },
    methods: {
    },
    mounted: function () {
    },
    components: {
    }
  }
</script>

<style lang="scss" scoped>
  @import '../style/_shared.scss';

  .doc-field {
    @extend .pnl;
    background-color: rgba($dark1, 0.15);
    border: 2px solid rgba($dark1, 0.5);
    color: $font-dark;
    font-family: Helvetica;
    font-size: 12pt;
    overflow: hidden;
    padding: 2pt;

    &.active {
      background-color: rgba($dark1, 0.15);
      border-color: rgba($dark1, 0.5);
      color: $font-dark;

      &.selected {
        background-color: rgba($theme-color, 0.15);
        border-color: rgba($theme-color, 0.5);
      }
    }
  }
</style>
