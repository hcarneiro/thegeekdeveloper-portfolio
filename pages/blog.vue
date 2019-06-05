<template>
  <section class="container main-container blog-page">
    <div class="big-wrapper">
      <div class="title-wrapper">
        <h1>
          Some stuff I wrote
        </h1>
      </div>
    </div>
    <div class="row">
      <loading v-if="loading" />
      <div v-for="(post, index) in posts" :key="index" :class="'col-md-4 ' + getRandomInt()" @click="openMediumPost(post.uniqueSlug)">
        <div class="card">
          <div class="card-banner" :style="'background-image: url(https://cdn-images-1.medium.com/max/1200/' + post.virtuals.previewImage.imageId + ')'" />
          <div>
            <h3 class="card-title">
              {{ post.title }}
            </h3>
            <div class="card-description">
              <p>
                {{ clampString(post.virtuals.metaDescription || post.virtuals.subtitle) }}
              </p>
            </div>
            <div class="card-tags">
              <span v-for="(tag, idx) in post.virtuals.tags" :key="idx">
                {{ tag.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Loading from '~/components/Loading'
import { mapState } from 'vuex'

export default {
  head() {
    return {
      title: 'Blog'
    }
  },
  components: {
    Loading
  },
  data() {
    return {
      loading: true
    }
  },
  computed: {
    ...mapState({
      posts: (state) => {
        return state.posts.list
      }
    })
  },
  created() {
    if (this.posts && this.posts.length) {
      this.loading = false
    }
  },
  mounted() {
    this.getPosts()
      .then(() => {
        this.loading = false
      })
      .catch((error) => {
        this.error = error
        this.loading = false
      })
  },
  methods: {
    getPosts() {
      return this.$store.dispatch('posts/getPosts')
    },
    clampString(string) {
      if (!string) {
        return ''
      }

      if (string.length <= 80) {
        return string
      }

      return string.substring(0, 80).trim() + '...'
    },
    openMediumPost(slug) {
      window.open(`https://medium.com/@hugodesigns/${slug}`, '_blank')
    },
    getRandomInt() {
      return Math.floor(Math.random() * Math.floor(6)) + 1
    }
  }
}
</script>
