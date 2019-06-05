<template>
  <section class="main-container work-page">
    <div class="project-header" :style="'background-image: url(' + project.image + ')'">
      <div class="project-header-screen" />
      <div class="container">
        <div class="big-wrapper">
          <div class="title-wrapper">
            <h1>
              {{ project.title }}
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

    <div class="container">
      <div class="page-content" v-html="project.content" />
    </div>
    <div class="container">
      <div class="page-tags">
        {{ project.tags }}
      </div>
    </div>
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
