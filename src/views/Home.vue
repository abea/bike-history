<template>
  <main class="row justify-content-center">
    <Analytic class="col-sm-8 col-md-6"/>
    <Analytic class="col-sm-8 col-md-6"/>
  </main>
</template>

<script>
// @ is an alias to /src
import Analytic from '@/components/Analytic.vue';

export default {
  name: 'home',
  components: {
    Analytic
  }
};
</script>
