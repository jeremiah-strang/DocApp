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
          <input ref="fileUploadInput" name="file" v-on:change="uploadFormSubmit" type="file"><br>
        </form>
      </div>

      <div class="settings-btn-wrap">
        <button v-on:click="saveDocument" :disabled="!canSave"
                class="btn btn-primary float-right">Save <i class="fa fa-save"></i></button>
      </div>
    </div>

    <div class="surface-toolbar">
      <div class="checkbox-wrap">
        <input v-model="enableSnap" id="show-snap-lines-chk" type="checkbox">
        <label for="show-snap-lines-chk">Use Snap Lines</label>
      </div>
    </div>
    <div ref="docBuilderSurface" class="doc-builder-surface">

      <div v-show="enableSnap" v-for="item in snapLinesY" :style="'top:' + item + 'px'" 
           class="snap-line-y">
        <i class="fa fa-caret-right"></i>       
      </div>
      <div v-show="enableSnap" v-for="item in snapLinesX" :style="'left:' + item + 'px'"
           class="snap-line-x">
        <i class="fa fa-caret-down"></i>    
      </div>

      <doc-field v-for="(item, index) in docFields" :doc-field="item" :key="item.uuid"
                 :on-select="onSelectDocField" :id="'_' + item.uuid" 
                 v-on:delete-doc-field="onDeleteDocField(item, index)">
      </doc-field>

      <canvas ref="docBuilderCanvas" v-show="showEditor" class="doc-builder-img"
              height="1100" width="850"></canvas>

      <div class="toolbox-tool-wrap toolbox-wrap">
        <div class="toolbox-hdr">Toolbox</div>
        <div ref="toolbox" class="toolbox">
          <div class="toolbox-tool" data-field-type="text">Text</div>
          <div class="toolbox-tool" data-field-type="number">Number</div>
          <div class="toolbox-tool" data-field-type="date">Date</div>
          <div class="toolbox-tool" data-field-type="phone">Phone Number</div>
          <div class="toolbox-tool" data-field-type="drawing">Signature/Drawing</div>
        </div>
      </div>

      <div v-show="selectedDocField.selected" class="field-editor-wrap toolbox-wrap">
        <div class="toolbox-hdr">Field Properties</div>
        <div class="toolbox">

          <div class="input-wrap">
            <h4>Field Name</h4>
            <input v-model="selectedDocField.name" v-on:focus="$event.target.select()" type="text"
                   ref="selectedDocFieldName">
          </div>

          <div v-if="['text', 'number', 'date'].indexOf(selectedDocField.type) > -1" class="input-wrap">
            <h4>Default Value</h4>
            <input v-model="selectedDocField.defaultVal" v-on:focus="$event.target.select()"
                   v-if="selectedDocField.type === 'number'" type="number">
            <input v-model="selectedDocField.defaultVal" v-on:focus="$event.target.select()"
                   v-else type="text">
          </div>

          <div v-if="selectedDocField.type === 'number'" class="input-wrap">
            <h4>Number Format</h4>
            <select v-model="selectedDocField.numberFormat" v-on:change="onFormatChanged">
              <option :value="NumberFormat.none">None</option>
              <option :value="NumberFormat.comma">Comma</option>
              <option :value="NumberFormat.currency">Currency</option>
            </select>
          </div>

          <div v-if="selectedDocField.type === 'date'" class="input-wrap">
            <h4>Date Format</h4>
            <select v-model="selectedDocField.dateFormat" v-on:change="onFormatChanged">
              <option :value="DateFormat.MMddyyyySlash">MM/dd/yyyy</option>
              <option :value="DateFormat.MMddyyyyDash">MM-dd-yyyy</option>
              <option :value="DateFormat.yyyyMMddSlash">yyyy/MM/dd</option>
              <option :value="DateFormat.yyyyMMddDash">yyyy-MM-dd</option>
              <option :value="DateFormat.yyyyMMdd">yyyyMMdd</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const $ = require('jquery')
  import uuidv4 from 'uuid/v4'
  import interact from 'interact.js'
  import numeral from 'numeral'
  import XDate from 'xdate'
  import utils from '../utils/utils'
  import NumberFormat from '../utils/NumberFormat'
  import DateFormat from '../utils/DateFormat'
  import pdfjs from 'pdfjs-dist'
  import DocField from '@/components/DocField'

  pdfjs.PDFJS.workerSrc = './static/pdf.worker.js'

  const snapRangeX = 12
  const snapRangeY = 10
  
  export default {
    name: 'doc-builder',
    data () {
      return {
        showEditor: false,
        enableSnap: true,
        previewImageSrc: '',
        name: '',
        docFields: [],
        snapLinesX: [50, 800],
        snapLinesY: [50, 1050],
        selectedDocField: {
          name: '',
          selected: false,
        },
        sharedDocFieldProps: {
          text: getDefaultSharedProps(),
          number: getDefaultSharedProps(),
          date: getDefaultSharedProps(),
          phone: getDefaultSharedProps(),
          drawing: getDefaultSharedProps(),
        },
        toolInteractable: null,
        dropzoneInteractable: null,
        toolboxInteractable: null,
        DateFormat,
        NumberFormat,
      }
    },
    computed: {
      canSave: function () {
        return false
      },
    },
    watch: {
    },
    methods: {

      /*
       * Saves the document
       */
      saveDocument: function () {
      },

      /*
       * Converts the selected PDF template file to .png and renders it on the design surface
       */
      uploadFormSubmit: function (e) {
        e.preventDefault()
        let fileInput = $(this.$refs.fileUploadInput)
        let fileType = this.$refs.fileUploadInput.files[0].type
        if (fileType === 'application/pdf') {
          // let pdfUrl = URL.createObjectURL(fileInput.get(0).files[0])

          pdfjs.getDocument({ url: URL.createObjectURL(fileInput.get(0).files[0]) })
          .then((pdfDoc) => {
            // let pageCt = pdfDoc.numPages
            pdfDoc.getPage(1).then((page) => {
              let canvas = this.$refs.docBuilderCanvas
              let scale = canvas.width / page.getViewport(1).width
              let viewport = page.getViewport(scale)
              canvas.height = viewport.height

              let renderContext = {
                canvasContext: canvas.getContext('2d'),
                viewport: viewport
              }
              page.render(renderContext).then(() => {
                $(canvas).show()
              })
            })
          }).catch(err => {
            console.error(err)
          })
        }
        // $.ajax({
        //   url: '/api/useruploads/',
        //   type: 'POST',
        //   data: new FormData(this.$refs.uploadForm),
        //   cache: false,
        //   contentType: false,
        //   processData: false,
        //   success: (data) => {
        //     this.previewImageSrc = 'data:image/png;base64, ' + data
        //     this.showEditor = true
        //   }
        // })
      },

      /*
       * Converts a toolbox tool element to a doc field component and adds it to the document
       */
      addDocField: function (toolboxTool) {
        let toolPos = utils.getPositioning(toolboxTool, this.$refs.docBuilderSurface)
        let type = toolboxTool.getAttribute('data-field-type')
        this.sharedDocFieldProps[type].count
        let name = type.substring(0, 1).toUpperCase() + type.substring(1, type.length) + ' Field ' +
          (++this.sharedDocFieldProps[type].count)

        let docField = {
          name: name,
          uuid: uuidv4(),
          type: type,
          x: utils.getSnapLine(toolPos.left, this.snapLinesX, snapRangeX, this.enableSnap),
          y: utils.getSnapLine(toolPos.top, this.snapLinesY, snapRangeY, this.enableSnap),
          height: toolboxTool.style.height,
          width: this.sharedDocFieldProps[type].width,
          selected: true,
        }

        docField.numberFormat = this.sharedDocFieldProps[type].numberFormat
        docField.dateFormat = this.sharedDocFieldProps[type].dateFormat
        docField.text = getDefaultFieldText(docField)

        this.onSelectDocField(docField)
        this.docFields.push(docField)

        docField.interactable = interact('#_' + docField.uuid)
          .draggable({
            inertia: false,
            restrict: {
              restriction: 'parent',
              endOnly: true,
              elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },
            autoScroll: true,
            onmove: (event) => {
              let target = event.target
              let x = this.selectedDocField.x + event.dx
              let y = this.selectedDocField.y + event.dy
              target.style.left = x + 'px'
              target.style.top = y + 'px'
              this.selectedDocField.x = x
              this.selectedDocField.y = y
            },
            onend: (event) => {
              let target = event.target
              let x = this.selectedDocField.x
              let y = this.selectedDocField.y
              x = utils.getSnapLine(x, this.snapLinesX, snapRangeX)
              y = utils.getSnapLine(y, this.snapLinesY, snapRangeY)
              target.style.left = x + 'px'
              target.style.top = y + 'px'
              this.selectedDocField.x = x
              this.selectedDocField.y = y
            }
          })
          .on('dragstart', (event) => {
            if (typeof this.onSelect === 'function') {
              this.onSelect(this.selectedDocField)
            }
          })
          .resizable({
            edges: { right: true },
          })
          .on('resizemove', (event) => {
            let target = event.target
            if (typeof this.onSelect === 'function') {
              this.onSelect(this.selectedDocField)
            }
            target.style.height = event.rect.height + 'px'
            target.style.width = event.rect.width + 'px'
            this.selectedDocField.height = event.rect.height
            this.selectedDocField.width = event.rect.width

            let type = this.selectedDocField.type
            this.sharedDocFieldProps[type].height = this.selectedDocField.height
            this.sharedDocFieldProps[type].width = this.selectedDocField.width
          })
      },

      /*
       * Selected number or date format changed
       */
      onFormatChanged: function () {
        this.selectedDocField.text = getDefaultFieldText(this.selectedDocField)
        let sharedProps = this.sharedDocFieldProps[this.selectedDocField.type]
        if (this.selectedDocField.type === 'number') {
          sharedProps.numberFormat = this.selectedDocField.numberFormat
        } else if (this.selectedDocField.type === 'date') {
          sharedProps.dateFormat = this.selectedDocField.dateFormat
        }
      },

      /*
       * Updates the current doc field selection and loads its properties
       */
      onSelectDocField: function (docField) {
        this.docFields.forEach(df => {
          df.selected = df.uuid === docField.uuid
        })
        this.selectedDocField = docField || {
          name: '',
          selected: false,
        }

        this.$nextTick(() => this.$refs.selectedDocFieldName.select())
      },

      /*
       * Deletes a doc field at the given index
       */
      onDeleteDocField: function (docField, index) {
        this.docFields.splice(index, 1)
        if (this.selectedDocField.uuid === docField.uuid) {
          this.selectedDocField.selected = false
          this.selectedDocField = {
            name: '',
            selected: false,
          }
        }
      },
    },

    /**
     * Set up draggable elements when the component is mounted
     */
    mounted: function () {
      // set up ability to drag toolbox tools onto the doc builder surface
      let draggingTool
      this.toolInteractable = interact('.toolbox-tool')
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
          }
        })
        .on('dragstart', (event) => {
          let target = event.target
          if (!target.dragOrigin) {
            let targetOffset = utils.getPositioning(target, this.$refs.docBuilder)
            draggingTool = target.cloneNode(true)
            draggingTool.classList.add('dragging')
            draggingTool.style.position = 'absolute'
            draggingTool.style.top = targetOffset.top + 'px'
            draggingTool.style.left = targetOffset.left + 'px'
            draggingTool.style.width = target.getBoundingClientRect().width + 'px'
            draggingTool.dragOrigin = target
            draggingTool.innerHTML = getDefaultFieldText({
              type: draggingTool.getAttribute('data-field-type'),
              ...getDefaultSharedProps()
            })
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
      this.dropzoneInteractable = interact('.doc-builder-surface').dropzone({
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
      this.toolboxInteractable = interact('.toolbox-hdr')
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

    /**
     * Unset draggable elements before the component is destroyed
     */
    beforeDestroy: function () {
      this.docFields.map(docField => { return docField.interactable }).forEach(interactable => {
        utils.unsetInteractable(interactable)
      })

      utils.unsetInteractable(this.toolInteractable)
      utils.unsetInteractable(this.dropzoneInteractable)
      utils.unsetInteractable(this.toolboxInteractable)
    },
    components: {
      DocField
    }
  }

  /**
   *
   */
  const getDefaultSharedProps = () => {
    return {
      count: 0,
      width: 188,
      height: 0,
      font: 'Helvetica',
      fontSize: 12,
      numberFormat: NumberFormat.none,
      dateFormat: DateFormat.MMddyyyySlash,
    }
  }

  /**
   *
   */
  const getDefaultFieldText = (docField) => {
    switch (docField.type) {
      case 'text':
        return 'Example text'
      case 'number':
        let num = 12345.67
        return docField.numberFormat ? numeral(num).format(docField.numberFormat) : num
      case 'date':
        // let exampleDate = new XDate(2017, 0, 1)
        let dateStr = (new XDate(2017, 0, 1)).toString(docField.dateFormat)
        return dateStr
      case 'phone':
        return '555-555-1234'
      case 'drawing':
        return 'Signature/Drawing'
    }
    return ''
  }
</script>

<style lang="scss" scoped>
  @import '../style/_shared.scss';

  .doc-builder {
    @extend .pnl;
    @extend .hw100;
    @extend .pad1;
    @extend .prevent-highlight;

    .surface-toolbar {
      @extend .pnl;
      background-color: $gray2;
      border-color: $gray6;
      border-style: solid;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      border-width: 1px 1px 0 1px;
      color: $font-dark;
      overflow: hidden;
      padding: 6px 6px;
      width: 852px;
    }

    .settings-wrap {
      @extend .pnl;
      @extend .pad1;
      @extend .shadowed;
      background-color: $dark1;
      border-top-right-radius: 8px;
      border-top-left-radius: 8px;
      color: $font-light;
      margin-bottom: 9px;
      width: 1062px;

      .settings-label {
        width: 124px;
      }

      .settings-btn-wrap {
        @extend .pad1;
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }

    .doc-builder-surface {
      @extend .pnl;
      @extend .shadowed;
      background-color: #fff;
      border: 1px solid $gray6;
      display: inline-block;
      min-height: 1102px;
      min-width: 852px;
        overflow: visible;

      .doc-builder-img {
        @extend .box;
        // height: 1100px;
        // width: 850px;
      }

      .snap-line-y,
      .snap-line-x {
        border-color: rgba($theme-color, 0.5);
        border-style: dashed;
        position: absolute;
        z-index: 2;

        i.fa {
          color: $theme-color;
        }
      }
      .snap-line-y {
        border-width: 0 0 2px 0;
        height: 0;
        width: 100%;
        i.fa {
          position: absolute;
          top: -6.5px;
          left: -5.5px;
        }
      }
      .snap-line-x {
        border-width: 0 2px 0 0;
        height: 100%;
        i.fa {
          position: absolute;
          top: -11px;
          left: -3.5px;
        }
      }
    }

    .toolbox-wrap {
      @extend .shadowed;
      background-color: $dark1;
      border-radius: 8px;
      left: 914px;
      position: fixed;
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
        color: $font-light;
        height: 100%;
        overflow: visible;
        padding: 6px;
        width: 100%;

        input, select, option {
          @extend .box;
        }

        input[type=text] {
          width: 100%;
        }

        input[type=number], select, option {
          width: 120px;
        }
      }
    }

    .field-editor-wrap {
      top: 285px;
    }

    .toolbox-tool-wrap {
      top: 77px;
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
      padding: 3px;

      &:last-child {
        margin-bottom: 0;
      }

      &.dragging {
        @extend .shadowed;
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
