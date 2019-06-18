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
      <div class="container pre-footer">
        <div class="row">
          <div class="col-md-6">
            <strong>Technologies:</strong> {{ project.tags }}
          </div>
          <div class="col-md-6 text-right">
            <no-ssr>
              <vue-goodshare-linked-in
                :page_url="'https://www.thegeekdeveloper.com' + fullPath"
                title_social="LinkedIn"
                has_icon
              />
              <vue-goodshare-facebook
                :page_url="'https://www.thegeekdeveloper.com' + fullPath"
                title_social="Facebook"
                has_icon
              />
              <vue-goodshare-twitter
                :page_url="'https://www.thegeekdeveloper.com' + fullPath"
                title_social="Twitter"
                has_icon
              />
            </no-ssr>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="text-center">
        <nuxt-link class="primary-button uppercase inline" tag="div" :to="'/work'">
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
      title: this.project.title,
      meta: [
        { hid: 'description', name: 'description', content: this.project.tags },
        { hid: 'og:image', property: 'og:image', content: this.project.thumb }
      ]
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
    }),
    fullPath() {
      return this.$route.path
    }
  },
  created() {
    this.slug = this.$route.params.slug
    this.$store.dispatch('projects/getProjectBySlug', this.slug)
  }
}
</script>
