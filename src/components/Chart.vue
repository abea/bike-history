<template>
  <section>
    <!-- TODO: Work out displaying different mode results. -->
    <p>Station {{stationId}} at {{ date }}T{{time}}</p>
    <ul>
      <li>total: {{ station.total }}</li>
      <li>empty: {{ station.empty }}</li>
      <li>available: {{ station.available }}</li>
    </ul>
  </section>
</template>

<script>
import moment from 'moment';
import ApiService from '@/services/ApiService';

const initialMoment = moment().subtract({ days: 3 });
const initialDate = initialMoment.format('YYYY-MM-DD');
const initialTime = initialMoment.format('HH:mm:ss');
const initialFrom = initialMoment.subtract({ days: 7 });
const initialFromDate = initialFrom.format('YYYY-MM-DD');
const initialFromTime = initialFrom.format('HH:mm:ss');

export default {
  name: 'Chart',
  props: {
    mode: String
  },
  data() {
    return {
      stationId: 3069,
      date: initialDate, // Used for the `to` value in series requests.
      time: initialTime, // Used for the `to` value in series requests.
      // TODO Switch the `date` and `time` to stand in for the `from` values.
      // That feels more clear.
      fromDate: initialFromDate,
      fromTime: initialFromTime,
      station: {}
    };
  },
  watch: {
    stationId: function(newId, oldId) {
      return this.getInfo({
        mode: this.mode,
        id: this.stationId,
        date: this.date,
        time: this.time,
        fromDate: this.mode === 'getOneSeries' ? this.fromDate : null,
        fromTime: this.mode === 'getOneSeries' ? this.fromTime : null
      });
    }
  },
  methods: {
    getInfo: async function(opts) {
      await ApiService[this.mode]({
        id: opts.id,
        time: `${opts.date}T${opts.time}`,
        fromTime: `${opts.fromDate}T${opts.fromTime}`
      })
        .then(res => {
          // TODO deal with the different results from other request modes.
          const data = res.data.station.properties;

          this.$set(this.station, 'total', data.totalDocks);
          this.$set(this.station, 'available', data.bikesAvailable);
          this.$set(this.station, 'empty', data.docksAvailable);
        })
        .catch(err => {
          console.error('🚨', err);
          return {};
        });
    }
  },
  created() {
    this.getInfo({
      mode: this.mode,
      id: this.stationId,
      date: this.date,
      time: this.time,
      fromDate: this.mode === 'getOneSeries' ? this.fromDate : null,
      fromTime: this.mode === 'getOneSeries' ? this.fromTime : null
    });
  }
};
</script>
