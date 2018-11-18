<template>
  <div class="row justify-content-center">
    <h1 class="col-md-12">Indego History</h1>
    <Analytic class="col-sm-8 col-md-6"/>
    <Analytic class="col-sm-8 col-md-6"/>
  </div>
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
