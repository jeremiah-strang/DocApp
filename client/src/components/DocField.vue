<template>
  <div ref="docFieldEl" :style="style" :class="docField.selected ? 'selected' : ''"
    v-on:click="onClick" class="doc-field">
    <span class="doc-field-text">{{ docField.text }}</span>&nbsp;
    <i v-on:click="$emit('delete-doc-field')" class="fa fa-trash"></i>
  </div>
</template>

<script>
  import interact from 'interact.js'
  // import Vue from 'vue'
  // import Vuex from 'vuex'
  // Vue.use(Vuex)

  export default {
    name: 'doc-field',
    props: ['docField', 'onSelect'],
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
    },
    methods: {
      onClick: function () {
        if (typeof this.onSelect === 'function') {
          this.onSelect(this.docField)
        }
      },
    },
    created: function () {
      // if (this.docField) {
      //   this.style =
      // }
    },
    mounted: function () {
      // make the field draggable and resizable
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
          if (typeof this.onSelect === 'function') {
            this.onSelect(this.docField)
          }
        })
        .resizable({
          edges: { right: true },
        })
        .on('resizemove', (event) => {
          let target = event.target
          target.style.height = event.rect.height + 'px'
          target.style.width = event.rect.width + 'px'
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
    padding-right: 6px;
    position: absolute;
    z-index: 1;

    &.selected {
      background-color: rgba($theme-color, 0.15);
      border-color: rgba($theme-color, 0.5);

      .fa.fa-trash {
        color: rgba($theme-color, 0.5);
      }
    }

    .doc-field-text {
      @extend .pnl;
      width: 100%;
    }

    .fa.fa-trash {
      @extend.float-right;
      color: rgba($dark1, 0.5);
      cursor: pointer;
    }
  }
</style>
