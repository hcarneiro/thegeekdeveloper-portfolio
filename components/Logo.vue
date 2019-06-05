<template>
  <div class="logo-wrapper" :class="{ 'no-flex': inMenu }">
    <nuxt-link class="logo" tag="div" :to="'/'" />
    <div v-if="!inMenu" class="logo-text">
      The Geek Developer
    </div>
  </div>
</template>

<script>
export default {
  props: {
    inMenu: {
      type: Boolean,
      default: false
    }
  }
}
</script>
