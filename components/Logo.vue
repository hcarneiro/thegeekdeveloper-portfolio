<template>
  <div class="logo-wrapper" :class="{ 'no-flex': inMenu }">
    <nuxt-link class="logo-holder" :to="'/'">
      <div class="logo" />
      <div v-if="!inMenu" class="logo-text">
        The Geek Developer
      </div>
    </nuxt-link>
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
