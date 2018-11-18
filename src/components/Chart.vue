<script>
import ApiService from '@/services/ApiService';
import { Pie } from 'vue-chartjs';

export default {
  extends: Pie,
  name: 'Chart',
  props: {
    mode: String,
    toDate: String,
    toTime: String
  },
  data() {
    return {
      stationId: 3069,
      station: {}
    };
  },
  watch: {
    station: function() {
      this.renderChart(
        {
          labels: ['Empty Docks', 'Available Bikes'],
          datasets: [
            {
              label: 'GitHub Commits',
              backgroundColor: ['#17a2b8', '#28a745'],
              data: [this.station.docksAvailable, this.station.bikesAvailable]
            }
          ]
        },
        {}
      );
    }
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
          toDate: data.toDate,
          toTime: data.toTime
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
