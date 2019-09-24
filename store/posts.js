export const state = () => ({
  list: []
})

export const mutations = {
  setPosts(state, posts) {
    state.list = posts
  }
}

export const actions = {
  getPosts({ commit }) {
    return this.$axios.get('/api/posts')
      .then((res) => {
        if (res.data.status === 200) {
          commit('setPosts', res.data.response)
          return Promise.resolve(res.data.response)
        }

        return Promise.reject(res)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  }
}
