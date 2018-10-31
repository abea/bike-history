<template>
  <main class="row justify-content-center">
    <Chart mode="getOneSnap" class="col-sm-8 col-md-6"/>
    <Chart mode="getOneSnap" class="col-sm-8 col-md-6"/>
  </main>
</template>

<script>
// @ is an alias to /src
import Chart from '@/components/Chart.vue';

export default {
  name: 'home',
  components: {
    Chart
  }
};
</script>
