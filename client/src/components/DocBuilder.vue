<template>
  <div ref="docBuilder" class="doc-builder">
    <div class="settings-wrap">
      <div class="panel-wrapper">
        <label class="settings-label float-left">Document Name</label>
        <input v-model="name" type="text">
      </div>
      <div class="panel-wrapper">
        <label class="settings-label float-left">Template File</label>
        <form ref="uploadForm" v-on:submit="uploadFormSubmit" class="float-left"
              action="/api/useruploads/" method="POST" enctype="multipart/form-data">
          <input name="file" v-on:change="uploadFormSubmit" type="file"><br>
        </form>
      </div>
    </div>
    <div ref="docBuilderSurface" class="doc-builder-surface">

      <doc-field v-for="(item, index) in docFields" :doc-field="item" :key="item.uuid"></doc-field>

      <img v-show="showEditor" class="doc-builder-img" :src="previewImageSrc"/>

      <div class="toolbox-wrap">
        <div class="toolbox-hdr">Toolbox</div>
        <div ref="toolbox" class="toolbox">
          <div class="toolbox-tool" data-field-type="text">Text</div>
          <div class="toolbox-tool" data-field-type="number">Number</div>
          <div class="toolbox-tool" data-field-type="date">Date</div>
          <div class="toolbox-tool" data-field-type="phone">Phone</div>
          <div class="toolbox-tool" data-field-type="drawing">Signature/Drawing</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const $ = require('jquery')
  import uuidv4 from 'uuid/v4'
  import interact from 'interact.js'
  import DocField from '@/components/DocField'

  export default {
    name: 'doc-builder',
    data () {
      return {
        showEditor: false,
        previewImageSrc: '',
        name: '',
        docFields: [],
      }
    },
    watch: {
    },
    methods: {

      /*
       * Converts the selected PDF template file to .png and renders it on the design surface
       */
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

      /*
       * Converts the selected PDF template file to .png and renders it on the design surface
       */
      addDocField: function (toolboxTool) {
        this.docFields.forEach(df => { df.selected = false })
        let toolPos = getPositioning(toolboxTool, this.$refs.docBuilderSurface)
        let docField = {
          uuid: uuidv4(),
          type: toolboxTool.getAttribute('data-field-type'),
          x: toolPos.left,
          y: toolPos.top,
          height: toolboxTool.style.height,
          width: toolboxTool.style.width,
          text: toolboxTool.innerHTML,
          selected: true,
        }
        this.docFields.push(docField)
      },
    },
    mounted: function () {
      let draggingTool

      // set up ability to drag toolbox tools onto the doc builder surface
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
            this.addDocField(draggingTool)
            this.$refs.docBuilder.removeChild(draggingTool)
            // if (draggingTool) {
            //   draggingTool.classList.remove('dragging')
            //   if (draggingTool.classList.contains('active')) {
            //     draggingTool.classList.add('selected')
            //     // interact(draggingTool)
            //   } else {
            //     this.$refs.docBuilder.removeChild(draggingTool)
            //   }
            // }
          }
        })
        .on('dragstart', (event) => {
          let target = event.target
          if (!target.dragOrigin) {
            let targetOffset = getPositioning(target, this.$refs.docBuilder)
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
            for (let tool of document.querySelectorAll('.selected')) {
              tool.classList.remove('selected')
            }
          } else {
            draggingTool = target
          }
        })
        .resizable({
          edges: { right: true },
        })
        .on('resizemove', (event) => {
          let target = event.target
          target.style.height = '' + parseInt(event.rect.height) + 'px'
          target.style.width = '' + parseInt(event.rect.width) + 'px'
        })

      // make the doc builder surface a dropzone
      interact('.doc-builder-surface').dropzone({
        accept: '.toolbox-tool',
        overlap: 0.75,
        ondropactivate: function (event) {
        },
        ondragenter: function (event) {
          if (draggingTool) {
            draggingTool.classList.add('active')
            draggingTool.classList.add('selected')
          }
        },
        ondragleave: function (event) {
          if (draggingTool) {
            draggingTool.classList.remove('active')
            draggingTool.classList.remove('selected')
          }
        },
        ondrop: function (event) {
        },
        ondropdeactivate: function (event) {
        }
      })

      // make the toolbox draggable
      interact('.toolbox-hdr')
        .draggable({
          inertia: true,
          restrict: {
            restriction: this.$refs.docBuilder,
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          },
          autoScroll: true,
          onmove: (event) => {
            let target = event.target.parentNode
            let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
            let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
            target.style.webkitTransform = target.style.transform =
              'translate(' + x + 'px, ' + y + 'px)'
            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)
          },
        })
    },
    components: {
      DocField
    }
  }

  /**
   * Gets the left and top offsets of an element, optionally subtracting a second element's offsets
   */
  const getPositioning = (el, subtractEl) => {
    el = el.getBoundingClientRect()
    let result = {
      left: el.left + window.scrollX,
      top: el.top + window.scrollY,
      width: el.width,
      height: el.height,
    }

    if (subtractEl) {
      subtractEl = getPositioning(subtractEl)
      result.left -= subtractEl.left
      result.top -= subtractEl.top
    }
    return result
  }
</script>

<style lang="scss" scoped>
  @import '../style/_shared.scss';

  .doc-builder {
    @extend .pnl;
    @extend .hw100;
    @extend .pad1;

    .settings-wrap {
      @extend .pnl;
      // @extend .w100;
      @extend .pad1;
      @extend .shadowed;
      background-color: $dark1;
      color: $font-light;
      margin-bottom: 9px;
      width: 1062px;

      .settings-label {
        width: 124px;
      }
    }

    .doc-builder-surface {
      @extend .pnl;
      @extend .shadowed;
      background-color: #fff;
      border: 1px solid $gray3;
      display: inline-block;
      min-height: 1100px;
      min-width: 850px;

      img.doc-builder-img {
        @extend .box;
        height: 1100px;
        width: 850px;
      }
    }

    .toolbox-wrap {
      @extend .shadowed;
      background-color: $dark1;
      border-radius: 8px;
      left: 914px;
      position: fixed;
      top: 80px;
      width: 200px;

      .toolbox-hdr {
        @extend .pnl;
        border-bottom: 1px solid $dark10;
        color: $font-light;
        padding: 6px;
        width: 100%;
      }

      .toolbox {
        @extend .pnl;
        height: 100%;
        overflow: visible;
        padding: 6px;
        width: 100%;
      }
    }

    .toolbox-tool {
      @extend .pnl;
      background-color: $dark5;
      border-radius: 4px;
      border: 2px solid $dark5;
      color: $font-light;
      font-family: Helvetica;
      font-size: 12pt;
      margin-bottom: 4px;
      overflow: hidden;
      padding: 2pt;

      &:last-child {
        margin-bottom: 0;
      }

      &.dragging {
        border-style: dashed;
      }

      &.active {
        background-color: rgba($dark1, 0.15);
        border-color: rgba($dark1, 0.5);
        color: $font-dark;

        &:not(.dragging) {
          border-color: transparent;
        }

        &.selected {
          background-color: rgba($theme-color, 0.15);
          border-color: rgba($theme-color, 0.5);
        }
      }
    }
  }
</style>
