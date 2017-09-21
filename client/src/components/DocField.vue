<template>
  <div ref="docFieldEl" :style="style" :class="docField.selected ? 'selected' : ''"
    class="doc-field">{{ text }}</div>
</template>

<script>
  // const interact = require('interact.js')
  import interact from 'interact.js'

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
          `top: ${this.docField.y}px; left: ${this.docField.x}px;`
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
      interact(this.$refs.docFieldEl)
        .draggable({
          inertia: false,
          restrict: {
            restriction: 'parent',
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          },
          autoScroll: true,
          onmove: (event) => {
            if (this.$refs.docFieldEl) {
              let x = (parseFloat(this.$refs.docFieldEl.getAttribute('data-x')) || 0) + event.dx
              let y = (parseFloat(this.$refs.docFieldEl.getAttribute('data-y')) || 0) + event.dy
              // this.$refs.docFieldEl.style.top = y + 'px'
              // this.$refs.docFieldEl.style.left = x + 'px'
              this.$refs.docFieldEl.style.left = x + 'px'
              this.$refs.docFieldEl.style.top = y + 'px'
              this.$refs.docFieldEl.setAttribute('data-x', x)
              this.$refs.docFieldEl.setAttribute('data-y', y)
              this.docField.x = x
              this.docField.y = y
            }
          },
          onend: (event) => {
          }
        })
        .on('dragstart', (event) => {
          this.$refs.docFieldEl.setAttribute('data-x', this.docField.x)
          this.$refs.docFieldEl.setAttribute('data-y', this.docField.y)
        })
        .resizable({
          edges: { right: true },
        })
        .on('resizemove', (event) => {
          let target = event.target
          target.style.height = '' + event.rect.height + 'px'
          target.style.width = '' + event.rect.width + 'px'
          this.docField.height = event.rect.height
          this.docField.width = event.rect.width
        })
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
