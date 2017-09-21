<template>
  <div :style="style" :class="docField.selected ? 'selected' : ''" class="doc-field">
    {{ text }}
  </div>
</template>

<script>
  // const interact = require('interact.js')

  export default {
    name: 'doc-field',
    props: ['docField'],
    data () {
      return {
        name: '',
        // type: '',
        // text: '',
      }
    },
    watch: {
    },
    computed: {
      style: function () {
        return `width: ${this.docField.width}; height: ${this.docField.height}; ` +
          `top: ${this.docField.y}; left: ${this.docField.x};`
      },

      text: function () {
        let text
        switch (this.docField.type) {
          case 'text':
            text = 'Example text'
            break
          case 'number':
            text = '123.45'
            break
          case 'date':
            text = '1/1/2017'
            break
          case 'phone':
            text = '555-555-1234'
            break
          case 'drawing':
            text = 'Signature'
            break
          default:
            text = ''
            break
        }
        return text
      },
    },
    methods: {
    },
    created: function () {
      // if (this.docField) {
      //   this.style =
      // }
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
    border-radius: 4px;
    border: 2px solid rgba($dark1, 0.5);
    color: $font-dark;
    font-family: Helvetica;
    font-size: 12pt;
    overflow: hidden;
    padding: 2pt;
    position: absolute;
    z-index: 1;

    &.selected {
      background-color: rgba($theme-color, 0.15);
      border-color: rgba($theme-color, 0.5);
    }
  }
</style>
