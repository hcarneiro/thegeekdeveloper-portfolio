<template>
  <section class="main-container home-page">
    <div class="container">
      <div class="big-wrapper">
        <div class="title-wrapper">
          <div class="title-subtitle">
            <p>
              Hey, I'm Hugo
            </p>
          </div>
          <h1>
            I design &amp; build user interfaces
          </h1>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-holder home-page">
      <loading-card context="home" />
      <loading-card context="home" />
      <loading-card context="home" />
    </div>

    <div class="portfolio-preview">
      <div v-if="!loading && projects && projects.length" v-swiper:mySwiper="swiperOption">
        <div class="swiper-wrapper">
          <nuxt-link
            v-for="(project, index) in projects"
            :key="index"
            tag="div"
            :to="'/work/' + project.slug"
            class="swiper-slide"
            :data-slug="project.slug"
            @click.native="openWork(project)"
          >
            <div class="slide-wrapper">
              <img v-if="project.thumb" :src="project.thumb" :alt="project.title" class="folio-image">
              <div :class="'folio-info gradient-' + (index + 1)">
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
            </div>
          </nuxt-link>
        </div>
        <div class="swiper-button-prev-slide">
          <font-awesome-icon icon="angle-left" />
        </div>
        <div class="swiper-button-next-slide">
          <font-awesome-icon icon="angle-right" />
        </div>
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
      title: 'The Geek Developer Portfolio',
      titleTemplate: null
    }
  },
  components: {
    LoadingCard
  },
  data() {
    return {
      loading: true,
      swiperOption: {
        slidesPerView: 'auto',
        spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        navigation: {
          nextEl: '.swiper-button-next-slide',
          prevEl: '.swiper-button-prev-slide'
        }
      }
    }
  },
  computed: {
    ...mapState({
      projects: (state) => {
        return _.chain(state.projects.list)
          .filter({ published: true })
          .take(6)
          .value()
      }
    })
  },
  watch: {
    projects(newVal) {
      if (this.mySwiper) {
        this.mySwiper.update()
      }
    }
  },
  created() {
    if (this.projects && this.projects.length) {
      this.loading = false
    }
  },
  mounted() {
    this.getProjects()
      .then(() => {
        this.loading = false
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
