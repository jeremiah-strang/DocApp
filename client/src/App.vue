<template>
  <div id="app">
    <div class="dsr-toolbar-wrap pnl w100 pad1">
      <div class="btn-wrap pin-top-r">
        <button id="dsr-save" class="btn">Help</button>
        <a href="/" id="dsr-cancel" class="btn btn-red">Cancel</a>
        <button id="dsr-save" class="btn btn-green" disabled>Done</button>
      </div>
      <table class="input-table-lg">
        <tbody>
          <tr>
            <td>Document Name</td>
            <td><input type="text" id="dsr-inp-name"></td>
          </tr>
          <form v-on:submit="postFile" enctype="multipart/form-data">
            <tr>
              <td>Template</td>
              <td>
                  <input type="file" name="dsr-inp-template" id="dsr-inp-template" />
              </td>
              <td>
                <input type="submit" value="Load">
              </td>
            </tr>
          </form>
        </tbody>
      </table>
    </div>
    <div class="dsr-body-wrap pnl w100">
      <div class="dsr-body-left pnl">
        <div class="dsr-globals-wrap box">
          <div class="hdr">Input Font Settings</div>
          <div class="content">
            <table class="input-table">
              <tbody>
                <tr>
                  <td>Font</td>
                  <td>
                    <select id="dsr-inp-font-family">
                      <option value="Courier">Courier</option>
                      <option value="Courier-Oblique">Courier-Oblique</option>
                      <option value="Courier-Bold">Courier-Bold</option>
                      <option value="Courier-BoldOblique">Courier-BoldOblique</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Font Size</td>
                  <td>
                    <select id="dsr-inp-font-size" class="w100">
                      <option value="8pt">8pt</option>
                      <option value="8.5pt">8.5pt</option>
                      <option value="9pt">9pt</option>
                      <option value="9.5pt">9.5pt</option>
                      <option value="10pt">10pt</option>
                      <option value="10.5pt">10.5pt</option>
                      <option value="11pt">11pt</option>
                      <option value="11.5pt">11.5pt</option>
                      <option value="12pt">12pt</option>
                      <option value="12.5pt">12.5pt</option>
                      <option value="13pt">13pt</option>
                      <option value="13.5pt">13.5pt</option>
                      <option value="14pt">14pt</option>
                      <option value="14.5pt">14.5pt</option>
                      <option value="15pt">15pt</option>
                      <option value="15.5pt">15.5pt</option>
                      <option value="16pt">16pt</option>
                      <option value="16.5pt">16.5pt</option>
                      <option value="17pt">17pt</option>
                      <option value="17.5pt">17.5pt</option>
                      <option value="18pt">18pt</option>
                      <option value="18.5pt">18.5pt</option>
                      <option value="19pt">19pt</option>
                      <option value="19.5pt">19.5pt</option>
                      <option value="20pt">20pt</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="dsr-props-wrap box">
          <div class="hdr">Input Properties</div>
          <div id="dsr-props-wrap" class="content">
            <p class="w100 text-center">(no input selected)</p>
          </div>
        </div>
        <div class="dsr-surface-outerwrap">
          <div class="dsr-surface-wrap">
            <div class="dsr-toolbox box">
              <div class="hdr draggable">Toolbox</div>
              <div class="content">
                <h5 class="w100">Text</h5>
                <div class="toolbox-tool-wrap pnl">
                  <div id="longtext-tool-static" class="toolbox-tool-static toolbox-longtext-tool w100"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const $ = require('jquery')

export default {
  name: 'app',
  methods: {
    postFile: function (e) {
      e.preventDefault()
      let data = new FormData($(e.target)[0])

      $.ajax({
        url: '/api/home/test',
        type: 'POST',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        success: (data) => {
          console.log(JSON.stringify(data, null, '  '))
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import 'styles/global.scss';

</style>
