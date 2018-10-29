<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <Chart msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Chart from "@/components/Chart.vue";

export default {
  name: "home",
  components: {
    Chart
  }
};
</script>
