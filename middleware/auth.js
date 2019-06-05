export default function (context) {
  if (!context.req) {
    return
  }

  const CREDENTIALS_REGEXP = /^ *(?:[Bb][Aa][Ss][Ii][Cc]) +([A-Za-z0-9._~+/-]+=*) *$/
  const match = CREDENTIALS_REGEXP.exec(context.req.headers.authorization)

  if (!match) {
    context.store.dispatch('auth/authenticate', false)
    return
  }

  context.store.dispatch('auth/authenticate', true)
}
