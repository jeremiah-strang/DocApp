<template>
  <div class="mobile-app-editor" :style="style">
    <div class="toolbox-hdr">
      <i class="fa fa-ellipsis-v"></i><i class="fa fa-ellipsis-v"></i>
      Mobile App Preview
      <div class="toolbox-hdr-btn-wrap">

        <button v-on:click="toggleMobileEditorMaximized" class="btn btn-plain">
          <i v-show="mobileEditorMaximized" class="fa fa-window-minimize"></i>
          <i v-show="!mobileEditorMaximized" class="fa fa-window-maximize"></i>
        </button>

        <button v-on:click="closeEditor" class="btn btn-plain">
          <i class="fa fa-close"></i>
        </button>
      </div>
    </div>
    <div v-show="mobileEditorMaximized" class="toolbox">
      <img src="static/iphone_outline_gray_sm.png" />
      <div class="mobile-app-surface-wrap">
        <div class="mobile-app-surface">
          <h3>{{ name }}</h3>
          <div v-for="(item, index) in allDocFields" class="mobile-app-input-wrap">
            <div v-if="['check', 'checkx', 'checksq'].indexOf(item.type) === -1"
                 class="mobile-app-input-label">{{ item.name }}</div>
            <input v-if="item.type === DocFieldType.text" type="text" class="w100" disabled>
            <textarea v-if="item.type === DocFieldType.signature" rows="2" class="w100" disabled>
            </textarea>
            <input v-if="item.type === DocFieldType.number" type="number" class="w100" disabled>
            <input v-if="item.type === DocFieldType.phone" type="text" placeholder="   -   -    "
                   disabled>
            <input v-if="item.type === DocFieldType.date" type="text" :placeholder="item.text"
                   disabled>
            <i v-if="item.type === DocFieldType.date" class="fa fa-calendar"></i>
            <div v-if="['check', 'checkx', 'checksq'].indexOf(item.type) > -1"
                 class="checkbox-wrap">
              <label :for="'mobile-app-input-chk' + item.uuid">{{ item.name }}</label>
              <input id="'mobile-app-input-chk' + item.uuid"  type="checkbox">
            </div>
          </div>

          <div class="mobile-app-bottom">
            <h4>Name for this document</h4>
            <input type="text" class="w100" disabled>
            <div class="mobile-app-btn"><i class="fa fa-save"></i>&nbsp;Save this document</div>
            <div class="mobile-app-btn"><i class="fa fa-envelope-o"></i>&nbsp;Save &amp; email this document</div>
          </div>
        </div>
      </div>

      <div class="mobile-app-btns">
        <i class="fa fa-home"></i>
        <i class="fa fa-list"></i>
        <i class="fa fa-cog"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import DocFieldType from '../models/DocFieldType'

  export default {
    name: 'mobile-app-editor',
    props: ['allDocFields', 'closeEditor', 'name'],
    data () {
      return {
        mobileEditorMaximized: true,
        DocFieldType,
      }
    },
    watch: {
    },
    computed: {
      style: function () {
        return `left: 270px; top: 41px;`
      },
    },
    methods: {

      /*
       *
       */
      toggleMobileEditorMaximized: function () {
        this.mobileEditorMaximized = !this.mobileEditorMaximized
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../style/_shared.scss';

  .mobile-app-editor {
    @extend .toolbox-wrap;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2);
    background-color: #fff;
    background-color: $gray3;
    border-color: $gray6;
    position: absolute;

    .toolbox-hdr {
      background-color: $gray2;
      border-color: $gray6;
      color: $font-dark;
      min-width: 324px;

      i.fa.fa-ellipsis-v {
        color: rgba(0, 0, 0, 0.2);
      }

      .toolbox-hdr-btn-wrap {
        .btn {
          color: $font-dark;
        }
      }
    }

    .toolbox {
      background-color: transparent;
      padding-bottom: 3px;

      .mobile-app-surface-wrap {
        background-color: #fff;
        height: 455px;
        left: 24px;
        overflow-y: auto;
        position: absolute;
        top: 58px;
        width: 277px;

        .mobile-app-surface {
          @extend .pnl;
          @extend .w100;
          background-color: $gray3;
          color: $font-dark;
          cursor: default;
          min-height: 456px;

          > h3:first-child {
            padding: 4px;
          }

          .mobile-app-input-wrap {
            @extend .pnl;
            @extend .w100;
            background-color: #fff;
            border-width: 1px 0;
            border: 1px solid $dark10;
            margin-top: 4px;
            padding: 4px;

            .mobile-app-input-label {
              font-size: 12px;
              padding-bottom: 2px;
            }

            input[type=text] {
              width: 120px;

              &.w100 {
                width: 100%;
              }
            }

            textarea {
              resize: none;
            }
          }

          .mobile-app-bottom {
            @extend .pnl;
            @extend .w100;
            margin-bottom: 50px;
            padding: 12px 4px 4px 4px;

            .mobile-app-btn {
              @extend .pnl;
              @extend .w100;
              background-color: $dark1;
              border-radius: 4px;
              box-sizing: border-box;
              color: $theme-blue;
              cursor: default;
              margin-top: 6px;
              padding: 6px;
              text-align: center;

              i {
                position: absolute;
                left: 9px;
              }
            }
          }
        }
      }

      .mobile-app-btns {
        position: absolute;
        width: 277px;
        height: 40px;
        top: 513px;
        left: 24px;
        background-color: $dark1;

        i.fa {
          box-sizing: border-box;
          float: left;
          width: 92px;
          text-align: center;
          font-size: 24px;
          padding: 8px;
          color: $theme-blue;

          &:first-child {
            background-color: $dark2;
          }
        }
      }
    }
  }

</style>
