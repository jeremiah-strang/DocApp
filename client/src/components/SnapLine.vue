<template>
  <div ref='snapLine' :class="classes" :style="style" :title="title">
    <i :class="snapLine.isVertical ? 'fa fa-caret-down' : 'fa fa-caret-right'"></i>    
  </div>
</template>

<script>
  import interact from 'interact.js'

  export default {
    name: 'snap-line',
    props: ['snapLine', 'scrollWrap', 'onLineMoved'],
    data () {
      return {
      }
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
            let oldPos = this.snapLine.position
            let pos
            if (this.snapLine.isVertical) {
              pos = this.snapLine.position + event.dx
              if (this.scrollWrap) {
                pos += this.scrollWrap.scrollLeft
              }
              pos = Math.min(850, pos)
            } else {
              pos = this.snapLine.position + event.dy
              if (this.scrollWrap) {
                pos += this.scrollWrap.scrollTop
              }
              pos = Math.min(1100, pos)
            }
            pos = Math.max(0, pos)
            this.snapLine.position = pos
            if (typeof this.onLineMoved === 'function') {
              this.onLineMoved(this.snapLine, oldPos)
            }
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
      @extend .shadowed;
      border-color: rgba($theme-color, 0.5);

      i.fa {
        color: $theme-color;
      }
    }

    i.fa {
      color: $dark3;
    }

    &.snap-line-y {
      border-width: 0 0 2px 0;
      cursor: ns-resize;
      height: 0;
      width: 100%;
      i.fa {
        left: -6.5px;
        position: absolute;
        top: -8px;
      }
    }

    &.snap-line-x {
      border-width: 0 2px 0 0;
      cursor: ew-resize;
      height: 100%;
      i.fa {
        left: -4px;
        position: absolute;
        top: -13px;
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
