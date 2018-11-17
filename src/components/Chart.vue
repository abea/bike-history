<script>
import moment from 'moment';
import ApiService from '@/services/ApiService';
import { Pie } from 'vue-chartjs';

const initialMoment = moment().subtract({ hours: 1 });
const initialDate = initialMoment.format('YYYY-MM-DD');
const initialTime = initialMoment.format('HH:mm:ss');
const initialFrom = initialMoment.subtract({ hours: 25 });
const initialFromDate = initialFrom.format('YYYY-MM-DD');
const initialFromTime = initialFrom.format('HH:mm:ss');

export default {
  extends: Pie,
  name: 'Chart',
  props: {
    mode: String
  },
  data() {
    return {
      stationId: 3069,
      toDate: initialDate,
      toTime: initialTime,
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
        toDate: this.toDate,
        toTime: this.toTime,
        fromDate: this.mode === 'getOneSeries' ? this.fromDate : null,
        fromTime: this.mode === 'getOneSeries' ? this.fromTime : null
      });
    }
  },
  methods: {
    getInfo: async function(opts) {
      await ApiService[this.mode]({
        id: opts.id,
        toTime: `${opts.toDate}T${opts.toTime}`,
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

      this.renderChart(
        {
          labels: ['Empty Docks', 'Available Bikes'],
          datasets: [
            {
              label: 'GitHub Commits',
              backgroundColor: ['#17a2b8', '#28a745'],
              data: [this.station.empty, this.station.available]
            }
          ]
        },
        {}
      );
    }
  },
  created() {
    this.getInfo({
      mode: this.mode,
      id: this.stationId,
      toDate: this.toDate,
      toTime: this.toTime,
      fromDate: this.mode === 'getOneSeries' ? this.fromDate : null,
      fromTime: this.mode === 'getOneSeries' ? this.fromTime : null
    });
  }
};
</script>
