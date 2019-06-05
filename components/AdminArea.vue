<template>
  <div class="admin-toolbar" :class="{ 'active': isAuthenticated, 'open': open }">
    <ul>
      <li class="heading" @click="toggleAdminArea">
        Admin area
        <span>
          <font-awesome-icon :icon="open ? 'angle-down' : 'angle-up'" />
        </span>
      </li>
      <li @click="openAdminOverlay">
        Manage projects
      </li>
      <li @click="logout">
        Logout
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    isAuthenticated: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      open: false
    }
  },
  methods: {
    toggleAdminArea() {
      this.open = !this.open
    },
    openAdminOverlay() {
      this.$store.commit('auth/adminOverlay', true)
      this.toggleAdminArea()
    },
    logout() {
      this.$store.dispatch('auth/logout')
    }
  }
}
</script>
