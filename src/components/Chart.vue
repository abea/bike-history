<script>
import { Pie } from 'vue-chartjs';

export default {
  extends: Pie,
  name: 'Chart',
  props: {
    station: {
      type: Object,
      required: true
    }
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
  }
};
</script>
