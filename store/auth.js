export const state = () => ({
  authenticated: false,
  showAdminOverlay: {
    isOpen: false,
    options: undefined
  }
})

export const mutations = {
  setAuthenticated(state, status) {
    state.authenticated = status
  },
  adminOverlay(state, options) {
    state.showAdminOverlay.options = options

    if (!options) {
      state.showAdminOverlay.isOpen = !state.showAdminOverlay.isOpen
      return
    }

    state.showAdminOverlay.isOpen = options.isOpen
  }
}

export const actions = {
  authenticate({ commit }, value) {
    commit('setAuthenticated', value)
  },
  logout({ commit }) {
    this.$axios.get('/logout')
      .then(() => {
        // Nothing to do here
        // It should fail
      })
      .catch(() => {
        commit('setAuthenticated', false)
      })
  }
}
