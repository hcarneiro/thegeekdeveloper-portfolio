<template>
  <div id="st-container" class="application st-container">
    <nav id="main-menu" v-click-outside="closeMenu" class="st-menu st-effect">
      <logo :in-menu="true" />
      <ul>
        <li>
          <nuxt-link class="menu-item" :to="'/'">
            Home
          </nuxt-link>
        </li>
        <li>
          <nuxt-link class="menu-item" :to="'/about'">
            Who am I?
          </nuxt-link>
        </li>
        <li>
          <nuxt-link class="menu-item" :to="'/portfolio'">
            Work
          </nuxt-link>
        </li>
        <li>
          <nuxt-link class="menu-item" :to="'/blog'">
            Blog
          </nuxt-link>
        </li>
        <li>
          <nuxt-link class="menu-item" :to="'/contact'">
            Get in touch
          </nuxt-link>
        </li>
      </ul>
      <div class="footer">
        The Geek Developer &copy; {{ year }}
      </div>
    </nav>

    <admin-area v-if="authenticated" :is-authenticated="authenticated" />
    <admin-overlay v-if="authenticated" :show="showAdminOverlay && showAdminOverlay.isOpen" />

    <div class="st-pusher">
      <div class="st-content">
        <div class="st-content-inner">
          <div class="header" :class="{ 'minimal': smallHeader }">
            <logo />
            <nav class="burger-menu" data-effect="st-effect">
              <font-awesome-icon icon="bars" />
            </nav>
          </div>
          <div ref="main" class="main-content">
            <nuxt />
            <bottom-footer />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* global window */
import $ from 'jquery'
import Logo from '~/components/Logo.vue'
import BottomFooter from '~/components/BottomFooter.vue'
import AdminArea from '~/components/AdminArea.vue'
import AdminOverlay from '~/components/AdminOverlay.vue'
import { mapState } from 'vuex'

export default {
  components: {
    Logo,
    BottomFooter,
    AdminArea,
    AdminOverlay
  },
  data() {
    return {
      year: new Date().getFullYear(),
      container: '.st-container',
      button: '.burger-menu',
      openClass: 'st-menu-open',
      menuLinks: '.menu-item',
      smallHeader: false
    }
  },
  computed: {
    ...mapState({
      authenticated: (state) => {
        return state.auth.authenticated
      },
      showAdminOverlay: (state) => {
        return state.auth.showAdminOverlay
      }
    })
  },
  watch: {
    $route() {
      // Scroll content to top on page change
      this.$refs.main.scrollTo(0, 0)
    }
  },
  mounted() {
    this.addEventListeners()

    // Push Notifications
    this.$OneSignal.push(() => {
      this.$OneSignal.isPushNotificationsEnabled((isEnabled) => {
        if (isEnabled) {
          console.log('Push notifications are enabled!')
        } else {
          console.log('Push notifications are not enabled yet.')
          this.$OneSignal.showNativePrompt()
        }
      })
    })

    // Using window and array form
    window.$OneSignal.push(['addListenerForNotificationOpened', (data) => {
      console.log('Received NotificationOpened:', data)
    }])
  },
  methods: {
    addEventListeners() {
      $(document).on('click', this.button, this.openMenu)
      $(document).on('click', this.menuLinks, this.closeMenu)
      this.$refs.main.addEventListener('scroll', this.onScroll)
    },
    closeMenu(event) {
      if ($(event.target).hasClass('burger-menu') ||
        $(event.target).parents('burger-menu').length) {
        return
      }

      $(this.container).removeClass(this.openClass)
    },
    openMenu() {
      const effect = $(this.button).data('effect')
      $(this.container).addClass(effect)
      $(this.container).addClass(this.openClass)
    },
    onScroll() {
      const top = this.$refs.main.scrollTop

      if (top >= 20) {
        this.smallHeader = true
      } else {
        this.smallHeader = false
      }
    }
  }
}
</script>
