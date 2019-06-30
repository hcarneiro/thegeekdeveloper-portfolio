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
          :to="'/work/' + project.slug"
          :class="'mix col-md-6 ' + getCategoryClasses(project.category)"
          :data-slug="project.slug"
          @click.native="openWork(project)"
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
import _ from 'lodash'
import { mapState } from 'vuex'
import LoadingCard from '~/components/LoadingCard'

export default {
  head() {
    return {
      title: 'Work',
      meta: [
        { hid: 'description', name: 'description', content: 'Some of the things I worked on' }
      ]
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
        const splitCategories = []

        state.projects.list.forEach((project) => {
          const categories = project.category.split(',')
          if (Array.isArray(categories) && categories.length) {
            for (let i = 0; i < categories.length; i++) {
              splitCategories.push(categories[i].trim())
            }
          } else {
            splitCategories.push(project.category.trim())
          }
        })

        const uniqCategories = _.uniq(splitCategories)
        return uniqCategories
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
    getCategoryClasses(category) {
      const splitCategories = []
      const categories = category.split(',')
      if (Array.isArray(categories) && categories.length) {
        for (let i = 0; i < categories.length; i++) {
          splitCategories.push(categories[i].trim().toLowerCase())
        }
      } else {
        splitCategories.push(category.trim().toLowerCase())
      }

      return splitCategories.join(' ')
    },
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
    },
    openWork(project) {
      this.$ga.event({
        eventCategory: 'Work',
        eventAction: 'open',
        eventLabel: project.title,
        eventValue: project.id
      })
    }
  }
}
</script>
