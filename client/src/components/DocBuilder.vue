<template>
  <div ref="docBuilder" class="doc-builder">
    <div ref="docBuilderSurface" class="doc-builder-surface">
      <form ref="uploadForm"
            v-on:submit="uploadFormSubmit"
            v-show="!showEditor"
            action="/api/useruploads/" method="POST" enctype="multipart/form-data">
        <input name="file" v-on:change="uploadFormSubmit" type="file"><br>
      </form>
      <img v-show="showEditor" class="doc-builder-img" :src="previewImageSrc"/>

      <div v-show="showEditor" class="toolbox-wrap">
        <div ref="toolbox" class="toolbox">
          <div class="toolbox-tool">Text Input</div>
          <div class="toolbox-tool">Number Input</div>
          <div class="toolbox-tool">Date Input</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const $ = require('jquery')
  const interact = require('interact.js')

  const getOffset = (el, subtractEl) => {
    el = el.getBoundingClientRect()
    let result = {
      left: el.left + window.scrollX,
      top: el.top + window.scrollY,
    }

    if (subtractEl) {
      subtractEl = getOffset(subtractEl)
      result.left -= subtractEl.left
      result.top -= subtractEl.top
    }
    return result
  }

  export default {
    name: 'doc-builder',
    data () {
      return {
        showEditor: false,
        previewImageSrc: '',
      }
    },
    watch: {
    },
    methods: {

      uploadFormSubmit: function (e) {
        e.preventDefault()

        $.ajax({
          url: '/api/useruploads/',
          type: 'POST',
          data: new FormData(this.$refs.uploadForm),
          cache: false,
          contentType: false,
          processData: false,
          success: (data) => {
            this.previewImageSrc = 'data:image/png;base64, ' + data
            this.showEditor = true
          }
        })
      },
    },
    mounted: function () {
      let draggingTool

      interact('.toolbox-tool')
        .draggable({
          inertia: false,
          restrict: {
            restriction: this.$refs.docBuilder,
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          },
          autoScroll: true,
          onmove: (event) => {
            if (draggingTool) {
              let x = (parseFloat(draggingTool.getAttribute('data-x')) || 0) + event.dx
              let y = (parseFloat(draggingTool.getAttribute('data-y')) || 0) + event.dy
              draggingTool.style.top = y + 'px'
              draggingTool.style.left = x + 'px'
              draggingTool.setAttribute('data-x', x)
              draggingTool.setAttribute('data-y', y)
            }
          },
          onend: (event) => {
            if (draggingTool) {
              if (draggingTool.classList.contains('active')) {
                // draggingTool.classList.add('selected')
              } else {
                this.$refs.docBuilder.removeChild(draggingTool)
              }
            }
          }
        })
        .on('dragstart', (event) => {
          let target = event.target
          if (!target.dragOrigin) {
            let targetOffset = getOffset(target, this.$refs.docBuilder)
            draggingTool = target.cloneNode(true)
            draggingTool.classList.add('dragging')
            draggingTool.style.position = 'absolute'
            draggingTool.style.top = targetOffset.top + 'px'
            draggingTool.style.left = targetOffset.left + 'px'
            draggingTool.style.width = target.getBoundingClientRect().width + 'px'
            draggingTool.dragOrigin = target
            this.$refs.docBuilder.appendChild(draggingTool)
            draggingTool.setAttribute('data-x', targetOffset.left)
            draggingTool.setAttribute('data-y', targetOffset.top)
            event.interaction.element = draggingTool
            event.interaction.draggingTool = false
          } else {
            draggingTool = target
          }
        })

      interact('.doc-builder-surface').dropzone({
        accept: '.toolbox-tool',
        overlap: 0.75,
        ondropactivate: function (event) {
        },
        ondragenter: function (event) {
          if (draggingTool) {
            draggingTool.classList.add('active')
          }
        },
        ondragleave: function (event) {
          if (draggingTool) {
            draggingTool.classList.remove('active')
          }
        },
        ondrop: function (event) {
        },
        ondropdeactivate: function (event) {
        }
      })
    },
    components: {
    }
  }
</script>

<style lang="scss" scoped>
  @import '../style/_shared.scss';

  .doc-builder {
    @extend .pnl;
    @extend .hw100;
    @extend .pad1;

    .doc-builder-surface {
      @extend .pnl;
      @extend .shadowed;
      background-color: #fff;
      border: 1px solid $gray3;
      display: inline-block;
      min-height: 1100px;
      min-width: 850px;

      form {
        display: inline-block;
        padding-top: 50px;
        text-align: center;
        width: 100%;
      }

      img.doc-builder-img {
        @extend .box;
        height: 1100px;
        width: 850px;
      }
    }

    .toolbox-wrap {
      @extend .shadowed;
      position: fixed;
      top: 9px;
      left: 914px;
      background-color: $dark1;
      width: 200px;
      border-radius: 8px;

      .toolbox {
        @extend .pnl;
        padding: 6px;
        width: 100%;
        height: 100%;
        overflow: visible;
      }
    }

    .toolbox-tool {
      @extend .pnl;
      background-color: $dark5;
      border-radius: 4px;
      border: 2px dashed $dark10;
      color: $font-light;
      // display: none;
      font-family: Helvetica;
      font-size: 12pt;
      padding: 2pt;
      margin-bottom: 4px;

      &:last-child {
        margin-bottom: 0;
      }

      &.active {
        background-color: rgba($theme-color, 0.15);
        border-color: rgba($theme-color, 0.5);
        color: $font-dark;

        &.selected {
          background-color: rgba($theme-red, 0.15);
          border-color: rgba($theme-red, 0.5);
        }
      }
    }
  }
</style>
