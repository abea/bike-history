<template>
  <div class="about">
    <Chart mode="getOneSnap" :toDate="toDate" :toTime="toTime"/>
    <form >
      <label for="startDate">
        Snapshot date
        <input type="date" name="startDate" v-model="toDate">
      </label>
      <label for="startTime">
        Snapshot time
        <input type="time" name="startTime">
      </label>
      <input type="submit" value="Submit">
    </form>
    <p>Date: {{toDate}} | Time: {{toTime}}</p>
  </div>
</template>

<script>
import Chart from '@/components/Chart.vue';
import moment from 'moment';

const initialMoment = moment().subtract({ hours: 1 });
const initialDate = initialMoment.format('YYYY-MM-DD');
const initialTime = initialMoment.format('HH:mm:ss');
// const initialFrom = initialMoment.subtract({ hours: 25 });
// const initialFromDate = initialFrom.format('YYYY-MM-DD');
// const initialFromTime = initialFrom.format('HH:mm:ss');

export default {
  name: 'Analytic',
  components: {
    Chart
  },
  data() {
    return {
      toDate: initialDate,
      toTime: initialTime
    };
  }
};
</script>
