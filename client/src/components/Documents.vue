<template>
  <div class="documents">

    <div class="doc-builder-wrap">
      <form ref="uploadForm"
            v-on:submit="uploadFormSubmit"
            v-show="!previewImageSrc"
            action="/api/useruploads/" method="POST" enctype="multipart/form-data">
        <input name="file" v-on:change="uploadFormSubmit" type="file"><br>
      </form>
      <img v-show="previewImageSrc" class="doc-builder" :src="previewImageSrc"/>

      <div id="test-pos1" class="test-pos">&nbsp;</div>
      <div id="test-pos2" class="test-pos">&nbsp;</div>
      <div id="test-pos3" class="test-pos">&nbsp;</div>
      <div id="test-pos4" class="test-pos">&nbsp;</div>
      <div id="test-pos5" class="test-pos">&nbsp;</div>
      <div id="test-pos6" class="test-pos">&nbsp;</div>
      <div id="test-pos7" class="test-pos">&nbsp;</div>
      <div id="test-pos8" class="test-pos">&nbsp;</div>
      <div id="test-pos9" class="test-pos">&nbsp;</div>

      <div class="toolbox-wrap">
        <div class="toolbox">
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

  export default {
    name: 'documents',
    data () {
      return {
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
          }
        })
      },
    },
    mounted: function () {
      interact('.toolbox-tool')
        .draggable({
          inertia: true,
          restrict: {
            restriction: 'doc-builder-wrap',
            endOnly: false,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          },
          autoScroll: true,
          onmove: dragMoveListener,
          onend: function (event) {
            // let textEl = event.target.querySelector('p')

            // textEl && (textEl.textContent = 'moved a distance of ' +
            //   (Math.sqrt(event.dx * event.dx + event.dy * event.dy) | 0) + 'px')
          }
        })

      function dragMoveListener (event) {
        let target = event.target
        let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
        let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy
        target.style.webkitTransform = 'translate(' + x + 'px, ' + y + 'px)'
        target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
      }

      window.dragMoveListener = dragMoveListener

      interact('.doc-builder-wrap').dropzone({
        accept: '.toolbox-tool',
        overlap: 0.75,
        ondropactivate: function (event) {
        },
        ondragenter: function (event) {
          event.relatedTarget.classList.add('active')
        },
        ondragleave: function (event) {
          event.relatedTarget.classList.remove('active')
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

  .documents {
    @extend .pnl;
    @extend .hw100;
    @extend .pad1;

    .doc-builder-wrap {
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

      img.doc-builder {
        @extend .box;
        height: 1100px;
        width: 850px;
      }

      .test-pos {
        background-color: rgba(10, 20, 250, 0.1);
        border-radius: 4px;
        border: 2px dashed rgba(10, 20, 250, 0.4);
        // display: none;
        font-family: Helvetica;
        font-size: 12pt;
        padding: 2pt;
        position: absolute;

        &#test-pos1,
        &#test-pos2,
        &#test-pos3,
        &#test-pos4 {
          left: 61px;
          width: 385px;
        }

        &#test-pos5,
        &#test-pos6,
        &#test-pos7 {
          left: 302px;
          width: 83px;
        }

        &#test-pos8,
        &#test-pos9 {
          left: 459px;
          width: 322px;
        }

        &#test-pos1 {
          top: 176px;
        }

        &#test-pos2 {
          top: 212px;
        }

        &#test-pos3 {
          top: 248px;
        }

        &#test-pos4 {
          top: 284px;
        }

        &#test-pos5 {
          top: 762px;
        }

        &#test-pos6 {
          top: 788px;
        }

        &#test-pos7 {
          top: 814px;
        }

        &#test-pos8 {
          top: 248px;
        }

        &#test-pos9 {
          top: 284px;
        }
      }
    }

    .toolbox-wrap {
      @extend .shadowed;
      position: fixed;
      top: 9px;
      left: 914px;
      background-color: $dark1;
      width: 250px;
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
      color: #fff;
      // display: none;
      font-family: Helvetica;
      font-size: 12pt;
      padding: 2pt;

      &:not(:last-child) {
        margin-bottom: 4px;
      }

      &.active {
        background-color: rgba(10, 20, 250, 0.1);
        border: 2px dashed rgba(10, 20, 250, 0.4);
      }
    }
  }
</style>
