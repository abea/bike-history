<template>
  <section>
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

export default {
  name: 'Chart',
  data() {
    return {
      stationId: 3069,
      date: initialDate,
      time: initialTime,
      station: {}
    };
  },
  watch: {
    stationId: function(newId, oldId) {
      return this.getInfo(this.stationId, this.date, this.time);
    }
  },
  methods: {
    getInfo: async function(id, date, time) {
      let station = {};

      await ApiService.getOneSnap({
        id: id,
        time: `${date}T${time}`
      })
        .then(res => {
          const data = res.data.station.properties;

          this.$set(this.station, 'total', data.totalDocks);
          this.$set(this.station, 'available', data.bikesAvailable);
          this.$set(this.station, 'empty', data.docksAvailable);
        })
        .catch(err => {
          console.error('🚨', err);
          return {};
        });

      return station;
    }
  },
  created() {
    this.getInfo(this.stationId, this.date, this.time);
  }
};
</script>
