<template>
  <div class="admin-toolbar" :class="{ 'active': isAuthenticated, 'open': open, 'extra-option': project && project.id }">
    <ul>
      <li class="heading" @click="toggleAdminArea">
        Admin area
        <span>
          <font-awesome-icon :icon="open ? 'angle-down' : 'angle-up'" />
        </span>
      </li>
      <li v-if="project && project.id" @click="editProject">
        Edit project
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
  computed: {
    project() {
      if (this.$route.params.slug === this.$store.state.projects.project.slug) {
        return this.$store.state.projects.project
      }
      return false
    }
  },
  methods: {
    toggleAdminArea() {
      this.open = !this.open
    },
    editProject() {
      this.$store.commit('auth/adminOverlay', {
        isOpen: true,
        projectId: this.project.id
      })
      this.toggleAdminArea()
    },
    openAdminOverlay() {
      this.$store.commit('auth/adminOverlay', {
        isOpen: true
      })
      this.toggleAdminArea()
    },
    logout() {
      this.$store.dispatch('auth/logout')
    }
  }
}
</script>
