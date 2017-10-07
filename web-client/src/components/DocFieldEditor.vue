<template>
  <div v-show="selectedDocField.isSelected" class="doc-field-editor">
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
        <select v-model="selectedDocField.numberFormat" v-on:change="onChangeFormat"
                class="number-format-select">
          <option :value="NumberFormat.none">None</option>
          <option :value="NumberFormat.comma">Comma</option>
          <option :value="NumberFormat.currency">Currency</option>
        </select>
      </div>

      <div v-if="selectedDocField.type === 'date'" class="input-wrap">
        <h4>Date Format</h4>
        <select v-model="selectedDocField.dateFormat" v-on:change="onChangeFormat">
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
        <select v-model="selectedDocField.fontFamily" v-on:change="onChangeFont" 
                class="font-select float-left">
          <option :value="FontOption.helvetica">Helvetica</option>
          <option :value="FontOption.courier">Courier</option>
          <option :value="FontOption.times">Times</option>
        </select>
        <select v-model="selectedDocField.fontSize" v-on:change="onChangeFont"
                class="font-size-select float-left">
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
</template>

<script>
  import NumberFormat from '../models/NumberFormat'
  import DateFormat from '../models/DateFormat'
  import FontOption from '../models/FontOption'
  import DocFieldType from '../models/DocFieldType'
  
  export default {
    props: ['selectedDocField', 'dragRestriction', 'onFormatChanged', 'onFontChanged'],
    name: 'doc-builder',
    data () {
      return {
        DateFormat,
        NumberFormat,
        FontOption,
        DocFieldType,
      }
    },
    components: {
    },
    computed: {
    },
    watch: {
    },
    methods: {

      /*
       * Selected number or date format changed
       */
      onChangeFormat: function () {
        if (this.onFormatChanged) {
          this.onFormatChanged()
        }
      },

      /*
       * Selected doc field font changed
       */
      onChangeFont: function () {
        if (this.onFontChanged) {
          this.onFontChanged()
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../style/_shared.scss';

  .doc-field-editor {
    @extend .toolbox-wrap;
    left: 912px;
    top: 319px;
    width: 200px;

    .input-wrap input[type=text] {
      width: 100%;
    }
    
    .number-format-select,
    .input-wrap input[type=number] {
      width: 100px;
    }
    
    .font-select {
      width: 120px;
    }

    .font-size-select {
      width: 60px;
      margin-left: 4px;
    }

    .checkbox-wrap {
      padding-top: 8px;
    }
  }
</style>
