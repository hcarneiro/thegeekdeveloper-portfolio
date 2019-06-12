let privateConfig
try {
  privateConfig = require('../config/private.json')
} catch (err) {
  privateConfig = undefined
}

export const state = () => ({
  env: {
    NODE_ENV: 'development'
  }
})

export const actions = {
  nuxtServerInit({ commit }) {
    // read runtime environment everytimes and set to store
    const env = {}
    env.NODE_ENV = process.env.NODE_ENV || 'development'
    env.ONESIGNAL_REST_API = process.env.ONESIGNAL_REST_API || privateConfig.ONESIGNAL_REST_API
    env.ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID || privateConfig.ONESIGNAL_APP_ID
    env.ONESIGNAL_TEMPLATE_ID = process.env.ONESIGNAL_TEMPLATE_ID || privateConfig.ONESIGNAL_TEMPLATE_ID
    commit('setEnv', env)
  }
}

export const mutations = {
  setEnv(state, env) {
    state.env = env
  }
}
