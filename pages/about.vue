<template>
  <section class="container main-container about-page">
    <div class="big-wrapper">
      <div class="title-wrapper">
        <h1>
          Hugo Carneiro
        </h1>
        <div class="title-subtitle">
          <p>
            Designer & Developer
          </p>
        </div>
      </div>
    </div>
    <div class="row">
      <!-- first row -->
      <div class="col-md-4">
        <div class="card">
          <div class="card-banner gradient-1">
            <font-awesome-icon icon="code-branch" />
          </div>
          <h3 class="card-title">
            Jack of all trades
          </h3>
          <div class="card-description">
            <p>
              From design to development. Learning and experimenting is in my genes.
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-banner gradient-2">
            <font-awesome-icon icon="anchor" />
          </div>
          <h3 class="card-title">
            Mentoring
          </h3>
          <div class="card-description">
            <p>
              I enjoy sharing my knowledge and help others grow as quickly as they can.
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-banner gradient-3">
            <font-awesome-icon icon="tasks" />
          </div>
          <h3 class="card-title">
            Management
          </h3>
          <div class="card-description">
            <p>
              More value, fewer resources. I've got your team's back and your projects flowing.
            </p>
          </div>
        </div>
      </div>
      <!-- second row -->
      <div class="col-md-4">
        <div class="card">
          <div class="card-banner gradient-4">
            <font-awesome-icon icon="chart-line" />
          </div>
          <h3 class="card-title">
            Scalability
          </h3>
          <div class="card-description">
            <p>
              From sketches to production. Everything is created and built with care and possibility to expand.
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-banner gradient-5">
            <font-awesome-icon icon="rocket" />
          </div>
          <h3 class="card-title">
            MVP
          </h3>
          <div class="card-description">
            <p>
              Solving problems developing a minimum viable product and learning as quickly as possible to iterate.
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card">
          <div class="card-banner gradient-6">
            <font-awesome-icon icon="gamepad" />
          </div>
          <h3 class="card-title">
            Gamer
          </h3>
          <div class="card-description">
            <p>
              That's right, I love playing video games and be immersed in new worlds and stories.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="history-container">
      <h2>
        For the past {{ years }} years I have helped agencies and teams fulfil their vision.
      </h2>
    </div>
    <div class="cv-container">
      <div class="cv-holder">
        <p>
          Currently working as <span>Product Designer</span> and <span>Frontend Developer</span> at Fliplet in London.
        </p>
      </div>
      <div class="cv-button-holder">
        <a class="primary-button uppercase" href="./hugo-carneiro-cv.pdf" target="_blank">
          View CV
        </a>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  head() {
    return {
      title: 'About'
    }
  },
  data() {
    return {}
  },
  computed: {
    years() {
      const start = 2009
      const currentYear = new Date().getFullYear()
      return currentYear - start
    }
  }
}
</script>
