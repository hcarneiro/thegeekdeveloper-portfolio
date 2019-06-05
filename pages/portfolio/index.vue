<template>
  <section class="container main-container work-page">
    <div class="big-wrapper">
      <div class="title-wrapper">
        <h1>
          My work
        </h1>
      </div>
    </div>

    <div class="portfolio-preview">
      <div v-if="loading" class="loading-holder row">
        <loading-card />
        <loading-card />
      </div>
      <div v-if="!loading && projects && projects.length" class="portfolio-controls">
        <a class="filters-button">
          <span>Filters</span>
          <font-awesome-icon icon="long-arrow-alt-right" />
        </a>
        <div class="filters">
          <div class="control" data-filter="all">
            All
          </div>
          <template v-for="(category, index) in categories">
            <div :key="index" class="control" :data-filter="'.' + category.toLowerCase()">
              {{ category }}
            </div>
          </template>
        </div>
      </div>
      <div v-if="!loading && projects && projects.length" class="portfolio-container row">
        <nuxt-link
          v-for="(project, index) in projects"
          :key="index"
          tag="div"
          :to="'/portfolio/' + project.slug"
          :class="'mix col-md-6 ' + project.category.toLowerCase()"
          :data-slug="project.slug"
        >
          <div v-if="project.thumb" :style="'background-image: url(' + project.thumb + ')'" class="folio-image" />
          <div :class="'folio-info gradient-' + getRandomInt()">
            <div class="folio-title">
              {{ project.title }}
            </div>
            <div class="folio-category">
              {{ project.category }}
            </div>
            <div class="view-more-holder">
              <span>
                View more
              </span>
              <font-awesome-icon icon="long-arrow-alt-right" />
            </div>
          </div>
        </nuxt-link>
        <div class="gap" />
        <div class="gap" />
        <div class="gap" />
      </div>
      <div v-if="!loading && (!projects || !projects.length)" class="empty-portfolio-preview">
        Projects coming soon!
      </div>
    </div>
  </section>
</template>

<script>
import LoadingCard from '~/components/LoadingCard'
import _ from 'lodash'
import { mapState } from 'vuex'

export default {
  head() {
    return {
      title: 'Work'
    }
  },
  components: {
    LoadingCard
  },
  data() {
    return {
      loading: true,
      mixitup: undefined,
      mixer: undefined
    }
  },
  computed: {
    ...mapState({
      projects: (state) => {
        return _.chain(state.projects.list)
          .filter({ published: true })
          .take(6)
          .value()
      },
      categories: (state) => {
        const categories = _.uniq(_.map(state.projects.list, 'category'))
        return categories
      }
    })
  },
  mounted() {
    this.mixitup = require('mixitup')

    this.getProjects()
      .then(() => {
        this.loading = false
        this.$nextTick(this.initMixItUp)
      })
      .catch((error) => {
        this.error = error
        this.loading = false
      })
  },
  methods: {
    getProjects() {
      return this.$store.dispatch('projects/getProjects')
    },
    getRandomInt() {
      return Math.floor(Math.random() * Math.floor(6)) + 1
    },
    initMixItUp() {
      if (!this.projects || !this.projects.length) {
        return
      }

      const containerEl = document.querySelector('.portfolio-container')
      this.mixer = this.mixitup(containerEl)
    }
  }
}
</script>
