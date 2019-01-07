<script>
import { Line } from 'vue-chartjs';
import moment from 'moment';

export default {
  extends: Line,
  name: 'LineChart',
  props: {
    info: {
      // type: Array,
      required: true
    }
  },
  watch: {
    info: function() {
      const labels = [];
      const data = [];

      this.info.forEach(snap => {
        if (!snap.station || !snap.station.properties.kioskId) {
          return;
        }
        labels.push(moment(snap.at).format('YYYY-MM-DD'));
        data.push(snap.station.properties.bikesAvailable);
      });
      this.renderChart(
        {
          labels: labels,
          datasets: [
            {
              label: '# of available bikes',
              backgroundColor: ['#17a2b8'],
              borderWidth: 0,
              data: data
            }
          ]
        },
        {}
      );
    }
  }
};
</script>
