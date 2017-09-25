<template>
  <div ref="docFieldEl" :style="style" :class="docField.selected ? 'selected' : ''"
       v-on:click="onClick" class="doc-field" :data-field-type="docField.type"
       :title="title">
    <i v-if="docField.type === 'check'" class="fa fa-check"></i>
    <i v-if="docField.type === 'checkx'" class="fa fa-close"></i>
    <i v-if="docField.type === 'checksq'" class="fa fa-square"></i>
    <span v-else class="doc-field-text">{{ docField.text }}</span>&nbsp;
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
        return `width:${parseInt(this.docField.width)}px;height:${parseInt(this.docField.height)}` +
          `px;top:${this.docField.y}px;left:${this.docField.x}px;font-family:` +
          `${this.docField.fontFamily};font-size:${this.docField.fontSize}pt;`
      },
      title: function () {
        return `${this.docField.name} (${this.docField.x}, ${this.docField.y})`
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
    border: 2px solid rgba($dark1, 0.10);
    color: $font-dark;
    font-family: Helvetica;
    font-size: 12pt;
    overflow: hidden;
    padding: 3px 3px 3px 3px;
    padding-right: 6px;
    position: absolute;
    z-index: 1;

    &[data-field-type=check],
    &[data-field-type=checkx],
    &[data-field-type=checksq] {
      border-color: transparent;
    }
    
    &:hover {
      @extend .shadowed;
      background-color: rgba($dark1, 0.60);
      color: $font-light;

      .fa.fa-trash {
        color: $font-light;
      }
    }

    &.selected {
      @extend .shadowed;
      background-color: rgba($theme-color, 0.15);
      border-color: rgba($theme-color, 0.15);

      &[data-field-type=check],
      &[data-field-type=checkx],
      &[data-field-type=checksq] {
        border-color: transparent;
      }

      .fa.fa-trash {
        color: rgba($theme-color, 0.5);
      }
    
      &:hover {
        @extend .shadowed;
        background-color: rgba($theme-color, 0.70);
        color: $font-light;

        .fa.fa-trash {
          color: $font-light;
        }
      }
    }
    // &.selected {
    //   @extend .shadowed;
    //   background-color: $theme-color;
    //   color: $font-light;

    //   &[data-field-type=check],
    //   &[data-field-type=checkx],
    //   &[data-field-type=checksq] {
    //     border-color: transparent;
    //   }

    //   .fa.fa-trash {
    //     color: $font-light;
    //   }
    // }

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

    .fa.fa-square {
      font-size: 12px;
    }
  }
</style>
