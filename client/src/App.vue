<template>
  <div id="app">
    <div class="app-nav" :class="isNavMaximized ? 'app-nav-maximized' : ''">

      <div class="app-nav-toggle" v-on:click="toggleNav"><i class="fa fa-thumb-tack"></i></div>

      <router-link to="/" title="Go to your dashboard">
        <i class="fa fa-home"></i>
        <span v-show="isNavMaximized">Dashboard</span>
      </router-link>

      <router-link to="/Documents" title="Manage to your documents">
        <i class="fa fa-files-o"></i>
        <span v-show="isNavMaximized">Documents</span>
      </router-link>

      <router-link to="/Account" title="View/edit your account settings">
        <i class="fa fa-cog"></i>
        <span v-show="isNavMaximized">Account</span>
      </router-link>
    </div>

    <div class="app-body" :class="isNavMaximized ? 'app-nav-maximized' : ''">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  const appNavWidth = 40
  const appNavMaximizedWidth = 140

  export default {
    name: 'app',
    data: function () {
      return {
        isNavMaximized: false,
        appNavWidth: appNavWidth,
      }
    },
    methods: {
      toggleNav: function () {
        this.isNavMaximized = !this.isNavMaximized
        if (this.isNavMaximized) {
          this.appNavWidth = appNavWidth
        } else {
          this.appNavWidth = appNavMaximizedWidth
        }
      }
    }
  }
</script>

<style lang="scss">
  @import 'style/_shared.scss';
  $app-nav-width: 40px;
  $app-nav-maximized-width: 140px;

  #app {
    @extend .pnl;
    @extend .h100;
    overflow: hidden;
    background-color: $gray3;
  }
  .app-nav {
    @extend .pnl;
    @extend .h100;
    @extend .shadowed;
    background-color: $dark1;
    width: $app-nav-width;
    z-index: 1;

    > a {
      @extend .pnl;
      @extend .w100;
      background-color: $dark3;
      border-bottom: 1px solid $dark5;
      display: block;
      padding: 8px;
      color: #fff;

      i:first-child {
        @extend .w100;
        text-align: center;
        color: lighten($theme-blue, 15%);
      }

      &:hover,
      &.router-link-exact-active {
        background-color: $dark2;
      }
    }

    > .app-nav-toggle {
      @extend .pnl;
      @extend .w100;
      background-color: $gray1;
      border-radius: 0;
      border: none;
      cursor: pointer;
      padding: 8px;

      > i {
        @extend .w100;
        text-align: center;
      }
    }


    &.app-nav-maximized {
      width: $app-nav-maximized-width;

      > a > i:first-child {
        width: 24px;
      }
      
      > .app-nav-toggle {
        padding-right: 8px;
        text-align: right;
        > i {
          transform: rotate(45deg);
          width: auto;
        }
      }
    }
  }

  .app-body {
    @extend .pnl;
    @extend .hw100;
    left: 0;
    padding-left: $app-nav-width;
    position: absolute;
    top: 0;

    &.app-nav-maximized {
      padding-left: $app-nav-maximized-width;
    }
  }
</style>
