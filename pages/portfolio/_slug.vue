<template>
  <section class="main-container work-page">
    <div class="project-header" :style="'background-image: url(' + project.image + ')'">
      <div class="project-header-screen" />
      <div class="container">
        <div class="big-wrapper">
          <div class="title-wrapper">
            <h1 v-if="project">
              {{ project.title }}
            </h1>
            <h1 v-else>
              No project found
            </h1>
            <div class="title-subtitle">
              <p>
                {{ project.category }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template v-if="project">
      <div class="container">
        <div class="page-content" v-html="project.content" />
      </div>
      <div class="container page-tags">
        <strong>Technologies:</strong> {{ project.tags }}
      </div>
    </template>
    <template v-else>
      <div class="text-center">
        <nuxt-link class="primary-button uppercase inline" tag="div" :to="'/portfolio'">
          Go back
        </nuxt-link>
      </div>
    </template>
  </section>
</template>
<script>
import { mapState } from 'vuex'

export default {
  head() {
    return {
      title: this.project.title
    }
  },
  data() {
    return {
      slug: undefined
    }
  },
  computed: {
    ...mapState({
      project: (state) => {
        return state.projects.project
      }
    })
  },
  created() {
    this.slug = this.$route.params.slug
    this.$store.dispatch('projects/getProjectBySlug', this.slug)
  }
}
</script>
