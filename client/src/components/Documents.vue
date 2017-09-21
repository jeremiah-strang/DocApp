<template>
  <div class="documents">
    <doc-builder v-if="docBuilderOpen"></doc-builder>
    <h3 v-else>Documents</h3>
  </div>
</template>

<script>
  import DocBuilder from '@/components/DocBuilderPdfJS'

  export default {
    name: 'documents',
    data () {
      return {
        docBuilderOpen: true,
      }
    },
    watch: {
    },
    methods: {
    },
    mounted: function () {
    },
    components: {
      DocBuilder
    }
  }
</script>

<style lang="scss" scoped>
  @import '../style/_shared.scss';

  .documents {
    @extend .pnl;
    @extend .hw100;
  }
</style>
