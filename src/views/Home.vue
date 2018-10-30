<template>
  <div class="home">
    <Chart mode="getOneSnap" />
    <Chart mode="getOneSnap" />
  </div>
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
