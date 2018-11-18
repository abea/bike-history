<template>
  <section>
  <div class="card mb-3">
    <div class="card-header">
      <strong>Date/Time:</strong> {{ toDate || 'Date not set' }}, {{ toTime || 'Time not set' }}<br/>
      <strong>Station:</strong> {{ station.addressStreet }}, {{ station.addressCity }} {{ station.addressState }} {{ station.addressZipCode }} (ID: {{ stationId }})
    </div>
    <div class="card-body">
      <Chart :station="station"/>
      <form class="form-row">
        <div class="form-group col">
          <label class="" for="startDate">Snapshot date</label>
          <input class="form-control" type="date" name="startDate" v-model="toDate">
        </div>
        <div class="form-group col">
          <label for="startTime">Snapshot time</label>
          <input class="form-control" type="time" name="startTime" v-model="toTime">
        </div>
      </form>
    </div>
  </div>
  </section>
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
