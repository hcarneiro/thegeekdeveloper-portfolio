<template>
  <div class="loading-card" :class="{ 'home-page': context === 'home', 'col-md-6': context !== 'blog', 'col-md-4 blog-page': context === 'blog' }">
    <div class="folio-image" />
    <div class="folio-info">
      <div class="folio-title" />
      <div class="folio-category">
        <div class="description" />
        <div v-if="context === 'blog'" class="description" />
      </div>
      <div class="view-more-holder" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    context: {
      type: String,
      default: ''
    }
  }
}
</script>
