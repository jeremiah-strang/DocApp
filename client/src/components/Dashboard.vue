<template>
  <div class="dashboard">
    <h3>Dashboard</h3>
  </div>
</template>

<script>
  export default {
    name: 'dashboard',
    dashboard () {
      return {
      }
    },
    watch: {
    },
    methods: {
    },
    components: {
    }
  }
</script>

<style lang="scss" scoped>
  @import '../style/_shared.scss';

  .dashboard {
    @extend .pnl;
    @extend .hw100;
    @extend .pad1;
  }
</style>
