import _ from 'lodash'

const oneSignalHeaders = {
  'Content-Type': 'application/json; charset=utf-8'
}

const oneSignalMessage = {
  included_segments: ['All']
}

const oneSignalOptions = {
  baseURL: 'https://onesignal.com',
  port: 443,
  url: '/api/v1/notifications',
  method: 'POST'
}

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
  updateProject(state, data) {
    const savedProject = _.find(state.list, { id: data.project.id })

    if (!savedProject.published && data.project.published) {
      // Send a push notification
      // when project is published
      oneSignalHeaders.Authorization = `Basic ${data.env.ONESIGNAL_REST_API}`
      oneSignalMessage.app_id = data.env.ONESIGNAL_APP_ID
      oneSignalMessage.template_id = data.env.ONESIGNAL_TEMPLATE_ID
      oneSignalOptions.headers = oneSignalHeaders
      oneSignalOptions.data = oneSignalMessage

      this.$axios(oneSignalOptions)
    }

    _.merge(savedProject, data.project)
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
  addProject({ commit, rootState }, data) {
    return this.$axios.post(`/api/projects`, data)
      .then((res) => {
        commit('addProject', res.data)

        if (res.data.published) {
          // Send a push notification
          // when project is published
          oneSignalHeaders.Authorization = `Basic ${rootState.env.ONESIGNAL_REST_API}`
          oneSignalMessage.app_id = rootState.env.ONESIGNAL_APP_ID
          oneSignalMessage.template_id = rootState.env.ONESIGNAL_TEMPLATE_ID
          oneSignalOptions.headers = oneSignalHeaders
          oneSignalOptions.data = oneSignalMessage

          this.$axios(oneSignalOptions)
        }

        return Promise.resolve(res.data)
      })
      .catch((error) => {
        return Promise.reject(error)
      })
  },
  updateProject({ commit, rootState }, param) {
    return this.$axios.put(`/api/projects/${param.id}`, param.project)
      .then((res) => {
        const data = {
          project: res.data[1][0],
          env: rootState.env
        }
        commit('updateProject', data)
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
