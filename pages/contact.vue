<template>
  <section class="container main-container contact-page">
    <div class="big-wrapper">
      <div class="title-wrapper">
        <h1>
          Say hello to get in touch
        </h1>
        <div class="title-subtitle">
          <p>
            Let's make your idea a reality
          </p>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4">
        <div class="card">
          <div class="card-banner gradient-3">
            <font-awesome-icon icon="lightbulb" />
          </div>
          <h3 class="card-title">
            Got an idea?
          </h3>
          <div class="card-description">
            <p>
              Great, I would love to help.
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-banner gradient-4">
            <font-awesome-icon icon="map-marker-alt" />
          </div>
          <h3 class="card-title">
            Where to find me
          </h3>
          <div class="card-description">
            <p>
              I’m currently based in London.
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-banner gradient-6">
            <font-awesome-icon icon="comments" />
          </div>
          <h3 class="card-title">
            How to get in touch
          </h3>
          <div class="card-description">
            <p>
              Drop me a line to get ball rolling.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="big-wrapper contact-email">
      <div class="title-wrapper">
        <div class="title-subtitle">
          <p>
            Get in touch
          </p>
        </div>
        <h1>
          <a href="mailto:hello@thegeekdeveloper.com?Subject=%5Byour%20idea%5D%20-%20%5Byour%20company%20name%5D" rel="noreferrer">hello@thegeekdeveloper.com</a>
        </h1>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  head() {
    return {
      title: 'Contact'
    }
  },
  data() {
    return {}
  }
}
</script>
