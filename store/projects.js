import _ from 'lodash'

export const state = () => ({
  list: [],
  project: {}
})

export const mutations = {
  setProjects(state, projects) {
    state.list = projects
  },
  setProject(state, project) {
    state.project = project
  },
  addProject(state, project) {
    state.list.push(project)
  },
  updateProject(state, project) {
    _.chain(state.list)
      .find({ id: project.id })
      .merge(project)
      .value()
  }
}

export const actions = {
  getProjects({ commit }) {
    return this.$axios.get(`/api/projects`)
      .then((res) => {
        if (res.status === 200) {
          commit('setProjects', res.data)
          return Promise.resolve(res.data)
        }

        return Promise.reject(res)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  getProjectById({ commit }, params) {
    return this.$axios.get(`/api/projects/${params.id}`)
      .then((res) => {
        if (res.status === 200) {
          commit('setProject', res.data)
          return Promise.resolve(res.data)
        }

        return Promise.reject(res)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  getProjectBySlug({ commit }, slug) {
    return this.$axios.get(`/api/projects/slug/${slug}`)
      .then((res) => {
        if (res.status === 200) {
          commit('setProject', res.data)
          return Promise.resolve(res.data)
        }

        return Promise.reject(res)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  addProject({ commit }, data) {
    return this.$axios.post(`/api/projects`, data)
      .then((res) => {
        commit('addProject', res.data)
        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  updateProject({ commit, rootState }, param) {
    return this.$axios.put(`/api/projects/${param.id}`, param.project)
      .then((res) => {
        commit('updateProject', res.data[1][0])
        if (res.data[1][0].id === rootState.projects.project.id) {
          commit('setProject', res.data[1][0])
        }
        return Promise.resolve(res.data[1][0])
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  removeProject({ commit }, projectId) {
    return this.$axios.delete(`/api/projects/${projectId}`)
  }
}
