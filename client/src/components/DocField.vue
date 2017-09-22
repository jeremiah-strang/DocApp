<template>
  <div ref="docFieldEl" :style="style" :class="docField.selected ? 'selected' : ''"
       v-on:click="onClick" class="doc-field">
    <span class="doc-field-text">{{ docField.text }}</span>&nbsp;
    <i v-on:click="$emit('delete-doc-field')" class="fa fa-trash"></i>
  </div>
</template>

<script>
  // import interact from 'interact.js'
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
        return `width:${parseInt(this.docField.width)}px;height:${parseInt(this.docField.height)}px;` +
               `top:${this.docField.y}px;left:${this.docField.x}px;`
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
    padding: 3px 3px 3px 3px;
    padding-right: 6px;
    position: absolute;
    z-index: 1;

    &.selected {
      @extend .shadowed;
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
      position: absolute;
      right: 3px;
      color: rgba($dark1, 0.5);
      cursor: pointer;
    }
  }
</style>
