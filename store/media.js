export const state = () => ({})

export const mutations = {}

export const actions = {
  uploadThumb({ commit }, file) {
    const projectData = {
      thumb: ''
    }

    return this.$axios.post(`/api/upload/thumb`, file)
      .then((res) => {
        if (res.status === 200) {
          projectData.thumb = res.data.url
          return res.data
        }
      })
  }
}
