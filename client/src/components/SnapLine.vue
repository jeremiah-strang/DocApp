<template>
  <div ref='snapLine' :class="classes" :style="style" :title="title">
    <i :class="snapLine.isVertical ? 'fa fa-caret-down' : 'fa fa-caret-right'"></i>    
  </div>
</template>

<script>
  import interact from 'interact.js'

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
      classes: function () {
        let classes = 'snap-line ' + (this.snapLine.isVertical ? 'snap-line-x' : 'snap-line-y')
        if (this.snapLine.selected) {
          classes += ' selected'
        }
        return classes
      },
      style: function () {
        return (this.snapLine.isVertical ? 'left:' : 'top:') + this.snapLine.position + 'px;'
      },
      title: function () {
        return `${this.snapLine.position}`
      },
    },
    methods: {
    },
    created: function () {
    },
    mounted: function () {
      this.snapLine.interactable = interact(this.$refs.snapLine)
        .draggable({
          inertia: false,
          restrict: {
            restriction: 'parent',
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          },
          autoScroll: true,
          onmove: (event) => {
            // let target = event.target
            let pos = this.snapLine.position + (this.snapLine.isVertical ? event.dx : event.dy)
            this.snapLine.position = pos
          },
          onend: (event) => {
          }
        })
        .on('dragstart', (event) => {
        })
    },
  }
</script>

<style lang="scss" scoped>
  @import '../style/_shared.scss';

  .snap-line {
    border-color: rgba($dark1, 0.5);
    border-style: dashed;
    position: absolute;
    z-index: 2;
    font-size: 18px;

    &.selected {
      border-color: rgba($theme-color, 0.5);

      i.fa {
        color: $theme-color;
      }
    }

    i.fa {
      color: $dark3;
      cursor: move;
    }

    &.snap-line-y {
      border-width: 0 0 2px 0;
      height: 0;
      width: 100%;
      i.fa {
        position: absolute;
        top: -8px;
        left: -6.5px;
      }
    }

    &.snap-line-x {
      border-width: 0 2px 0 0;
      height: 100%;
      i.fa {
        position: absolute;
        top: -13px;
        left: -4px;
      }
    }
  }
  // .snap-line {
  //   border-color: rgba($dark1, 0.5);
  //   border-style: dashed;
  //   position: absolute;
  //   z-index: 2;

  //   &.selected {
  //     border-color: rgba($theme-color, 0.5);

  //     i.fa {
  //       color: $theme-color;
  //     }
  //   }

  //   i.fa {
  //     color: $dark3
  //   }

  //   &.snap-line-y {
  //     border-width: 0 0 2px 0;
  //     height: 0;
  //     width: 100%;
  //     i.fa {
  //       position: absolute;
  //       top: -6.5px;
  //       left: -5.5px;
  //     }
  //   }

  //   &.snap-line-x {
  //     border-width: 0 2px 0 0;
  //     height: 100%;
  //     i.fa {
  //       position: absolute;
  //       top: -11px;
  //       left: -3.5px;
  //     }
  //   }
  // }
</style>
