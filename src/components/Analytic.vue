<template>
  <div class="about">
    <Chart :station="station"/>
    <form >
      <label for="startDate">
        Snapshot date
        <input type="date" name="startDate" v-model="toDate">
      </label>
      <label for="startTime">
        Snapshot time
        <input type="time" name="startTime" v-model="toTime">
      </label>
      <input type="submit" value="Submit">
    </form>
    <p>Date: {{ toDate || 'Not set' }} | Time: {{ toTime || 'Not set' }}</p>
  </div>
</template>

<script>
import ApiService from '@/services/ApiService';
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
      stationId: 3069,
      toDate: initialDate,
      toTime: initialTime,
      station: {},
      mode: 'getOneSnap'
    };
  },
  methods: {
    getInfo: async function(opts) {
      const stationData = await ApiService[this.mode]({
        id: opts.id,
        toTime: `${opts.toDate}T${opts.toTime}`,
        fromTime: `${opts.fromDate}T${opts.fromTime}`
      })
        .then(res => {
          // TODO deal with the different results from other request modes.
          return res.data.station.properties;
        })
        .catch(err => {
          console.error('🚨', err);
          return {};
        });

      return stationData;
    }
  },
  mounted: async function() {
    this.$watch(
      () => ({
        mode: this.mode,
        stationId: this.stationId,
        toDate: this.toDate,
        toTime: this.toTime
      }),
      async function(data) {
        this.station = await this.getInfo({
          mode: data.mode,
          id: data.stationId,
          toDate: data.toDate ? data.toDate : initialDate,
          toTime: data.toTime ? data.toTime : initialTime
          // fromDate: this.mode === 'getOneSeries' ? this.fromDate : null,
          // fromTime: this.mode === 'getOneSeries' ? this.fromTime : null
        });
      }
    );

    // Get the real station data to start.
    this.station = await this.getInfo({
      mode: this.mode,
      id: this.stationId,
      toDate: this.toDate,
      toTime: this.toTime
    });
  }
};
</script>
