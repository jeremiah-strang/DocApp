<template>
  <div ref="docBuilder"
       v-on:keyup.up="moveDocFieldUp"
       v-on:keyup.down="moveDocFieldDown"
       v-on:keyup.left="moveDocFieldLeft"
       v-on:keyup.right="moveDocFieldRight"
       class="doc-builder">
    <div class="settings-wrap">
      <div class="panel-wrapper" style="margin-bottom: 4px;">
        <label class="settings-label float-left">Doc Template Name
          <span v-show="!name" class="red">*</span>
        </label>
        <input v-model="name" type="text" class="doc-name-input">
      </div>

      <div class="panel-wrapper">
        <label class="settings-label float-left">Template File</label>
        <form ref="uploadForm" v-on:submit="uploadFormSubmit" class="float-left"
              action="/api/useruploads/" method="POST" enctype="multipart/form-data">
          <input ref="fileUploadInput" name="file" v-on:change="uploadFormSubmit" type="file"><br>
        </form>
      </div>

      <div class="settings-btn-wrap">
        <button v-show="!mobileEditorOpen" v-on:click="toggleMobileEditorOpen(true)" 
                class="btn btn-default"><i class="fa fa-mobile"></i>&nbsp;Mobile Preview</button>

        <button v-on:click="saveDocument" :disabled="!canSave"
                class="btn btn-primary float-right">Save <i class="fa fa-save"></i></button>
      </div>
    </div>

    <div class="surface-toolbar">
      <div class="use-snap-chk-wrap checkbox-wrap">
        <input v-model="enableSnap" id="use-snap-chk" type="checkbox">
        <label for="use-snap-chk">Use Snap Lines</label>
      </div>
      
      <div class="page-nav-wrap">
        <button v-on:click="prevPage" :disabled="selectedPage.pageNo < 2" class="btn btn-plain">
          <i class="fa fa-arrow-left"></i>
        </button>
        <span>Page {{ selectedPage.pageNo }} of {{ pdfDoc.numPages }}</span>
        <button v-on:click="nextPage" :disabled="selectedPage.pageNo === pdfDoc.numPages" class="btn btn-plain">
          <i class="fa fa-arrow-right"></i>
        </button>
      </div>
    </div>

    <div ref="docBuilderSurface" class="doc-builder-surface">

      <snap-line v-show="enableSnap" v-for="item in snapLinesX" :key="item.uuid"
                 :snap-line="item" :scroll-wrap="$refs.docBuilderSurface"
                 :on-line-moved="onSnapLineMoved"></snap-line>

      <snap-line v-show="enableSnap" v-for="item in snapLinesY" :key="item.uuid"
                 :snap-line="item" :scroll-wrap="$refs.docBuilderSurface"
                 :on-line-moved="onSnapLineMoved"></snap-line>

      <doc-field-component v-for="(item, index) in selectedPage.docFields" :doc-field="item"
                 :key="item.uuid" :on-select="onSelectDocField" :id="'_' + item.uuid" 
                 v-on:delete-doc-field="onDeleteDocField(item, index)">
      </doc-field-component>

      <canvas ref="docBuilderCanvas" v-show="showEditor" class="doc-builder-img"
              height="1100" width="850"></canvas>

      <div class="toolbox-tool-wrap toolbox-wrap">
        <div class="toolbox-hdr">
          <i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i>
          Toolbox
        </div>
        <div ref="toolbox" class="toolbox">
          <div class="toolbox-tool" data-field-type="text">Text</div>
          <div class="toolbox-tool" data-field-type="number">Number</div>
          <div class="toolbox-tool" data-field-type="date">Date</div>
          <div class="toolbox-tool" data-field-type="phone">Phone Number</div>
          <div class="toolbox-tool" data-field-type="drawing">Signature/Drawing</div>
          <div style="width: 100%; clear: both; margin-bottom: 4px;"></div>
          <div class="toolbox-tool float-left" data-field-type="check">
            <i class="fa fa-check"></i>
          </div>
          <div class="toolbox-tool float-left" data-field-type="checkx">
            <i class="fa fa-close"></i>
          </div>
          <div class="toolbox-tool float-left" data-field-type="checksq">
            <i class="fa fa-square"></i>
          </div>
          <h4 class="float-left">&nbsp;Checkbox</h4>
        </div>
      </div>

      <div v-show="selectedDocField.isSelected" class="field-editor-wrap toolbox-wrap">
        <div class="toolbox-hdr">
          <i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i>
          Field Properties</div>
        <div class="toolbox">

          <div class="input-wrap">
            <h4>Field Name</h4>
            <input v-model="selectedDocField.name" v-on:focus="$event.target.select()" type="text"
                   ref="selectedDocFieldName">
          </div>

          <div class="input-wrap">
            <div class="checkbox-wrap">
              <input v-model="selectedDocField.isRequired" id="is-required-chk" type="checkbox">
              <label for="is-required-chk">Required?</label>
            </div>
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

          <div v-if="['text', 'number', 'phone', 'date'].indexOf(selectedDocField.type) > -1"
            class="input-wrap">
            <h4>Font</h4>
            <select v-model="selectedDocField.fontFamily" v-on:change="onFontChanged" 
                    style="width: 110px;" class="float-left">
              <option :value="FontOption.helvetica">Helvetica</option>
              <option :value="FontOption.courier">Courier</option>
              <option :value="FontOption.times">Times</option>
            </select>
            <select v-model="selectedDocField.fontSize" v-on:change="onFontChanged"
                    style="width: 60px; margin-left: 4px;" class="float-left">
              <option :value="8">8pt</option>
              <option :value="9">9pt</option>
              <option :value="10">10pt</option>
              <option :value="11">11pt</option>
              <option :value="12">12pt</option>
              <option :value="13">13pt</option>
              <option :value="14">14pt</option>
              <option :value="15">15pt</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <mobile-app-editor v-if="mobileEditorOpen" :all-doc-fields="allDocFields" 
                       :close-editor="closeMobileEditor" :name="name">           
    </mobile-app-editor>
  </div>
</template>

<script>
  const $ = require('jquery')
  import uuidv4 from 'uuid/v4'
  import interact from 'interact.js'
  import utils from '../utils/utils'
  import NumberFormat from '../models/NumberFormat'
  import DateFormat from '../models/DateFormat'
  import FontOption from '../models/FontOption'
  import DocField from '../models/DocField'
  import DocFieldType from '../models/DocFieldType'
  import pdfjs from 'pdfjs-dist'
  import DocFieldComponent from '@/components/DocField'
  import MobileAppEditor from '@/components/MobileAppEditor'
  import SnapLine from '@/components/SnapLine'

  pdfjs.PDFJS.workerSrc = './static/pdf.worker.js'

  const snapRangeX = 12
  const snapRangeY = 10
  
  export default {
    name: 'doc-builder',
    data () {
      return {
        mobileEditorOpen: false,
        showEditor: false,
        enableSnap: true,
        previewImageSrc: '',
        name: 'Doc template 1',
        allDocFields: [],
        pages: [
          {
            pageNo: 1,
            docFields: [],
          }
        ],
        pdfDoc: {
          numPages: 1,
        },
        selectedPage: {
          pageNo: 1,
          docFields: [],
        },
        selectedDocField: {
          name: '',
          isSelected: false,
        },
        snapLinesX: [],
        snapLinesY: [],
        sharedDocFieldProps: {
          text: getDefaultSharedProps(),
          number: getDefaultSharedProps(),
          date: getDefaultSharedProps(),
          phone: getDefaultSharedProps(),
          drawing: getDefaultSharedProps(),
          check: getDefaultSharedProps('check'),
          checkx: getDefaultSharedProps('checkx'),
          checksq: getDefaultSharedProps('checksq'),
        },
        toolInteractable: null,
        dropzoneInteractable: null,
        toolboxInteractable: null,
        DateFormat,
        NumberFormat,
        FontOption,
        DocFieldType,
      }
    },
    components: {
      DocFieldComponent,
      SnapLine,
      MobileAppEditor,
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
            this.pdfDoc = pdfDoc
            let pageCt = pdfDoc.numPages
            this.pages = []
            for (let pNo = 1; pNo <= pageCt; pNo++) {
              this.pages.push({
                pageNo: pNo,
                docFields: [],
              })
            }
            if (this.pages.length > 0) {
              let docFields = this.selectedPage.docFields
              this.selectPage(this.pages[0])
              this.selectedPage.docFields = docFields
            } else {
              this.pages.push(this.selectedPage)
            }
            // pdfDoc.getPage(1).then((page) => {
            //   let canvas = this.$refs.docBuilderCanvas
            //   let scale = canvas.width / page.getViewport(1).width
            //   let viewport = page.getViewport(scale)
            //   canvas.height = viewport.height

            //   let renderContext = {
            //     canvasContext: canvas.getContext('2d'),
            //     viewport: viewport
            //   }
            //   page.render(renderContext).then(() => {
            //     $(canvas).show()
            //   })
            // })
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
       * Selects the previous page
       */
      prevPage: function () {
        if (this.selectedPage.pageNo > 1) {
          this.selectPage(this.selectedPage.pageNo - 2)
        }
      },

      /*
       * Selects the next page
       */
      nextPage: function () {
        if (this.selectedPage.pageNo <= this.pages.length) {
          this.selectPage(this.selectedPage.pageNo)
        }
      },

      /*
       * Selects a page
       */
      selectPage: function (selectedPage) {
        if (typeof selectedPage === 'number' && this.pages.length > selectedPage) {
          this.selectedPage = this.pages[selectedPage]
        } else {
          this.selectedPage = selectedPage
        }
        if (this.pdfDoc) {
          this.pdfDoc.getPage(this.selectedPage.pageNo).then((page) => {
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
        }
      },

      /*
       * Converts a toolbox tool element to a doc field component and adds it to the document
       */
      addDocField: function (toolboxTool) {
        let toolPos = utils.getPositioning(toolboxTool, this.$refs.docBuilderSurface, this.$refs.docBuilderSurface)
        let type = toolboxTool.getAttribute('data-field-type')
        let sharedProps = this.sharedDocFieldProps[type]
        sharedProps.count++

        let docField = new DocField({
          type: type,
          height: toolboxTool.offsetHeight,
          isSelected: true,
          isRequired: true,
          onSelect: this.onSelect,
          ...this.getSnapLines(toolPos.left, toolPos.top),
        }, sharedProps)

        this.onSelectDocField(docField)
        this.selectedPage.docFields.push(docField)
        this.allDocFields.push(docField)

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
              let x = docField.x + event.dx
              let y = docField.y + event.dy
              target.style.left = x + 'px'
              target.style.top = y + 'px'
              docField.x = x
              docField.y = y
              this.checkSnapLines(x, y)
            },
            onend: (event) => {
              let target = event.target
              let snap = this.getSnapLines(docField.x, docField.y)
              target.style.left = snap.x + 'px'
              target.style.top = snap.y + 'px'
              docField.x = snap.x
              docField.y = snap.y
              docField.snapLineX = snap.snapLineX
              docField.snapLineY = snap.snapLineY
            }
          })
          .on('dragstart', (event) => {
            this.snapLinesX.forEach(sn => {
              sn.isSelected = false
            })

            this.snapLinesY.forEach(sn => {
              sn.isSelected = false
            })
            if (typeof this.onSelect === 'function') {
              this.onSelect(docField)
            }
          })
          .resizable({
            edges: { right: true },
          })
          .on('resizemove', (event) => {
            let target = event.target
            if (typeof this.onSelect === 'function') {
              this.onSelect(docField)
            }
            target.style.height = event.rect.height + 'px'
            target.style.width = event.rect.width + 'px'
            docField.height = event.rect.height
            docField.width = event.rect.width

            let type = docField.type
            this.sharedDocFieldProps[type].height = docField.height
            this.sharedDocFieldProps[type].width = docField.width
          })

        // console.log(JSON.stringify(this.allDocFields.map(df => {
        //   return df.getCleanedJson()
        // }), null, '  '))
      },

      /*
       * Checks snap lines
       */
      getSnapLines: function (left, top) {
        let xy
        let snapX = this.snapLinesX.find(line => { return Math.abs(line.position - left) <= snapRangeX })
        let snapY = this.snapLinesY.find(line => { return Math.abs(line.position - top) <= snapRangeY })

        if (!snapX) {
          snapX = {
            isSelected: true,
            uuid: uuidv4(),
            isVertical: true,
            position: left,
          }
          this.snapLinesX.push(snapX)
        }

        if (!snapY) {
          snapY = {
            uuid: uuidv4(),
            isSelected: true,
            isVertical: false,
            position: top,
          }
          this.snapLinesY.push(snapY)
        }

        if (this.enableSnap) {
          xy = {
            snapLineX: snapX,
            snapLineY: snapY,
            x: snapX ? snapX.position : left,
            y: snapY ? snapY.position : top,
          }
        } else {
          xy = {
            snapLineX: this.snapLinesX.find(sn => { return sn.position === left }), // snapX,
            snapLineY: this.snapLinesY.find(sn => { return sn.position === top }), // snapY,
            x: left,
            y: top,
          }
        }

        return xy
      },

      /*
       *
       */
      checkSnapLines: function (x, y) {
        this.snapLinesX.forEach(sn => {
          sn.isSelected = false
        })

        this.snapLinesY.forEach(sn => {
          sn.isSelected = false
        })

        let snapX = this.snapLinesX.find(sn => { return Math.abs(sn.position - x) <= snapRangeX })
        let snapY = this.snapLinesY.find(sn => { return Math.abs(sn.position - y) <= snapRangeY })
        if (snapX) {
          snapX.isSelected = true
        }
        if (snapY) {
          snapY.isSelected = true
        }
      },

      /*
       *
       */
      onSnapLineMoved: function (snapLine, oldPos) {
        if (snapLine.isVertical) {
          this.selectedPage.docFields.forEach(df => {
            if ((snapLine.position >= df.x && oldPos <= df.x) ||
                (snapLine.position <= df.x && oldPos >= df.x)) {
              df.x = snapLine.position
            }
            // if (Math.abs(snapLine.position - df.x) <= snapRangeX) {
            //   df.x = snapLine.position
            // }
          })
        } else {
          this.selectedPage.docFields.forEach(df => {
            if ((snapLine.position >= df.y && oldPos <= df.y) ||
                (snapLine.position <= df.y && oldPos >= df.y)) {
              df.y = snapLine.position
            }
            // if (Math.abs(snapLine.position - df.y) <= snapRangeY) {
            //   df.y = snapLine.position
            // }
          })
        }
      },

      /*
       * Selected number or date format changed
       */
      onFormatChanged: function () {
        this.selectedDocField.updateText()
        let sharedProps = this.sharedDocFieldProps[this.selectedDocField.type]
        if (this.selectedDocField.type === 'number') {
          sharedProps.numberFormat = this.selectedDocField.numberFormat
        } else if (this.selectedDocField.type === 'date') {
          sharedProps.dateFormat = this.selectedDocField.dateFormat
        }
      },

      /*
       * Selected doc field font changed
       */
      onFontChanged: function () {
        for (let type of ['text', 'number', 'phone', 'date']) {
          let sharedProps = this.sharedDocFieldProps[type]
          sharedProps.fontFamily = this.selectedDocField.fontFamily
          sharedProps.fontSize = this.selectedDocField.fontSize
        }
      },

      /*
       * Updates the current doc field selection and loads its properties
       */
      onSelectDocField: function (docField) {
        this.snapLinesX.forEach(sn => {
          sn.isSelected = false
        })

        this.snapLinesY.forEach(sn => {
          sn.isSelected = false
        })

        this.selectedPage.docFields.forEach(df => {
          df.isSelected = df.uuid === docField.uuid
        })

        this.selectedDocField = docField || {
          name: '',
          isSelected: false,
        }

        if (this.selectedDocField.snapLineX) {
          this.selectedDocField.snapLineX.isSelected = true
        }

        if (this.selectedDocField.snapLineY) {
          this.selectedDocField.snapLineY.isSelected = true
        }

        this.$nextTick(() => this.$refs.selectedDocFieldName.select())
      },

      /*
       * Deletes a doc field at the given index
       */
      onDeleteDocField: function (docField, index) {
        this.selectedPage.docFields.splice(index, 1)
        this.allDocFields = this.allDocFields.filter(df => {
          return df.uuid !== docField.uuid
        })
        if (this.selectedDocField.uuid === docField.uuid) {
          this.selectedDocField.isSelected = false
          this.selectedDocField = {
            name: '',
            isSelected: false,
          }
        }
      },

      /*
       * Moves the selected doc field up 1 pixel
       */
      moveDocFieldUp: function () {
        this.selectedDocField.moveY(-1, this.snapLinesY)
      },

      /*
       * Moves the selected doc field down 1 pixel
       */
      moveDocFieldDown: function () {
        this.selectedDocField.moveY(1, this.snapLinesY)
      },

      /*
       * Moves the selected doc field left 1 pixel
       */
      moveDocFieldLeft: function () {
        this.selectedDocField.moveX(-1, this.snapLinesX)
      },

      /*
       * Moves the selected doc field right 1 pixel
       */
      moveDocFieldRight: function () {
        this.selectedDocField.moveX(1, this.snapLinesX)
      },

      /*
       *
       */
      toggleMobileEditorOpen: function (isOpen) {
        if (typeof isOpen === 'boolean') {
          this.mobileEditorOpen = isOpen
        } else {
          this.mobileEditorOpen = !this.mobileEditorOpen
        }
      },

      /*
       *
       */
      closeMobileEditor: function () {
        this.toggleMobileEditorOpen(false)
      },
    },

    /**
     * Set up draggable elements when the component is mounted
     */
    mounted: function () {
      let surfaceOffset = utils.getPositioning(
        this.$refs.docBuilder, this.$refs.docBuilder, this.$refs.docBuilderSurface)

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
              this.checkSnapLines(x - Math.abs(surfaceOffset.left), y - Math.abs(surfaceOffset.top))
            }
          },
          onend: (event) => {
            this.addDocField(draggingTool)
            this.$refs.docBuilder.removeChild(draggingTool)
          }
        })
        .on('dragstart', (event) => {
          this.snapLinesX.forEach(sn => {
            sn.isSelected = false
          })

          this.snapLinesY.forEach(sn => {
            sn.isSelected = false
          })

          let target = event.target
          if (!target.dragOrigin) {
            draggingTool = target.cloneNode(true)
            let targetOffset = utils.getPositioning(target, this.$refs.docBuilder, this.$refs.docBuilder)
            let fieldType = draggingTool.getAttribute('data-field-type')
            draggingTool.classList.add('dragging')
            draggingTool.style.position = 'absolute'
            draggingTool.style.top = targetOffset.top + 'px'
            draggingTool.style.left = targetOffset.left + 'px'
            draggingTool.style.width = target.getBoundingClientRect().width + 'px'
            draggingTool.dragOrigin = target

            if (fieldType !== 'check' && fieldType !== 'checkx' && fieldType !== 'checksq') {
              draggingTool.innerHTML = utils.getDefaultDocFieldText({
                type: fieldType,
                ...getDefaultSharedProps()
              })
            } else {
              let icon = document.createElement('i')
              let iconClass
              switch (fieldType) {
                case 'check':
                  iconClass = 'fa-check'
                  break
                case 'checkx':
                  iconClass = 'fa-close'
                  break
                case 'checksq':
                  iconClass = 'fa-square'
                  break
              }
              icon.classList.add('fa', iconClass)
              draggingTool.innerHTML = ''
              draggingTool.appendChild(icon)
            }

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

      // make the doc builder surface a dropzone
      this.dropzoneInteractable = interact(this.$refs.docBuilderSurface).dropzone({
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
      this.selectedPage.docFields.map(docField => { return docField.interactable }).forEach(interactable => {
        utils.unsetInteractable(interactable)
      })
      // this.snapLinesX.map(snapLine => { return snapLine.interactable }).forEach(interactable => {
      //   utils.unsetInteractable(interactable)
      // })
      // this.snapLinesY.map(snapLine => { return snapLine.interactable }).forEach(interactable => {
      //   utils.unsetInteractable(interactable)
      // })

      utils.unsetInteractable(this.toolInteractable)
      utils.unsetInteractable(this.dropzoneInteractable)
      utils.unsetInteractable(this.toolboxInteractable)
    },
  }

  /**
   *
   */
  const getDefaultSharedProps = (type) => {
    let width
    switch (type) {
      case 'check':
      case 'checkx':
      case 'checksq':
        width = 44
        break
      default:
        width = 188
        break
    }
    return {
      count: 0,
      width: width,
      height: 0,
      fontFamily: FontOption.helvetica,
      fontSize: 12,
      isRequired: true,
      numberFormat: NumberFormat.none,
      dateFormat: DateFormat.MMddyyyySlash,
    }
  }
</script>

<style lang="scss" scoped>
  @import '../style/_shared.scss';

  .doc-builder {
    @extend .hw100;
    @extend .pad1;
    @extend .pnl;
    @extend .prevent-highlight;
    z-index: 4;
    min-width: 1237px;
    min-height: 1225px;

    .doc-name-input {
      width: 250px;
    }

    .settings-wrap {
      @extend .pad1;
      @extend .pnl;
      @extend .shadowed;
      background-color: $dark1;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      color: $font-light;
      margin-bottom: 9px;
      width: 1062px;

      .settings-label {
        width: 150px;
      }

      .settings-btn-wrap {
        @extend .pad1;
        bottom: 0;
        position: absolute;
        right: 0;

        button:not(:last-child) {
          margin-right: 4px;
        }
      }
    }

    .surface-toolbar {
      @extend .pnl;
      background-color: $gray2;
      border-color: $gray6;
      border-style: solid;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      border-width: 1px 1px 0 1px;
      color: $font-dark;
      // left: 212px;
      overflow: hidden;
      padding: 6px 8px;
      width: 852px;

      button.btn.btn-plain {
        padding: 0 2px;

        i {
          font-size: 14px;
        }
      }

      .use-snap-chk-wrap {
        display: inline-block;
        float: left;
      }

      .page-nav-wrap {
        @extend .pnl;
        display: inline-block;
        float: right;

        button.btn.btn-plain {
          padding: 0 2px;
          border-radius: 4px;

          i {
            font-size: 14px;
          }
        }
      }
    }

    .doc-builder-surface {
      @extend .pnl;
      @extend .shadowed;
      background-color: #fff;
      border: 1px solid $gray6;
      display: inline-block;
      // left: 212px;
      min-height: 1102px;
      min-width: 852px;
      overflow: visible;

      .doc-builder-img {
        @extend .box;
        // height: 1100px;
        // width: 850px;
      }
    }

    .toolbox-wrap {
      @extend .shadowed;
      background-color: $dark1;
      border-radius: 8px;
      border: 1px solid $dark10;
      position: fixed;
      z-index: 3;

      .toolbox-hdr {
        @extend .pnl;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        color: $font-light;
        padding: 6px;
        width: 100%;

        i.fa.fa-ellipsis-v {
          color: rgba(255, 255, 255, 0.2);
          margin-right: 1px;
        }

        .toolbox-hdr-btn-wrap {
          position: absolute;
          right: 2px;
          top: 4px;

          .btn {
            color: $font-light;

            &:hover {
              background-color: rgba($font-light, .2);
            }

            &.btn-plain {
              padding: 2px 4px;
            }

            i.fa.fa-window-minimize,
            i.fa.fa-window-maximize {
              font-size: 11px;
            }
          }
        }
      }

      &.minimized {
        .toolbox-hdr {
          border-radius: 8px;
        }
      }

      .toolbox {
        @extend .pnl;
        border-top: 1px solid $dark10;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        color: $font-light;
        height: 100%;
        overflow: visible;
        padding: 6px;
        width: 100%;

        input, select, option {
          @extend .box;
        }

        >input[type=text] {
          width: 100%;
        }

        >input[type=number], >select, >select >option {
          width: 120px;
        }
      }
    }

    .field-editor-wrap {
      left: 912px;
      top: 319px;
      width: 200px;
    }

    .toolbox-tool-wrap {
      left: 912px;
      top: 81px;
      width: 200px;
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
      z-index: 3;

      &[data-field-type=check],
      &[data-field-type=checkx],
      &[data-field-type=checksq] {
        width: auto;
        display: inline-block;
        margin-right: 4px;
      }

      &[data-field-type=checkx],
      &[data-field-type=checksq] {
        padding: 3px 5px;
      }
      &[data-field-type=checksq] {
        padding: 5px 7px;
        font-size: 12px;
      }

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
