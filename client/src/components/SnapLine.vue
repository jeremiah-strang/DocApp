<template>
  <div :class="snapLine.isVertical ? 'snap-line snap-line-x' : 'snap-line snap-line-y'"
       :style="style">
    <i :class="snapLine.isVertical ? 'fa fa-caret-down' : 'fa fa-caret-right'"></i>    
  </div>
</template>

<script>
  export default {
    name: 'snap-line',
    props: ['snapLine'],
    data () {
      return {
      }
    },
    watch: {
    },
    computed: {
      style: function () {
        return (this.snapLine.isVertical ? 'left:' : 'top:') + this.snapLine.position + 'px;'
      },
    },
    methods: {
    },
    created: function () {
    },
    mounted: function () {
    },
  }
</script>

<style lang="scss" scoped>
  @import '../style/_shared.scss';


  .snap-line {
    border-color: rgba($theme-color, 0.5);
    border-style: dashed;
    position: absolute;
    z-index: 2;

    i.fa {
      color: $theme-color;
    }

    &.snap-line-y {
      border-width: 0 0 2px 0;
      height: 0;
      width: 100%;
      i.fa {
        position: absolute;
        top: -6.5px;
        left: -5.5px;
      }
    }

    &.snap-line-x {
      border-width: 0 2px 0 0;
      height: 100%;
      i.fa {
        position: absolute;
        top: -11px;
        left: -3.5px;
      }
    }
  }
</style>
