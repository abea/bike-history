<script>
import { Pie } from 'vue-chartjs';

export default {
  extends: Pie,
  name: 'Chart',
  props: {
    info: {
      type: Object,
      required: true
    }
  },
  watch: {
    info: function() {
      this.renderChart(
        {
          labels: ['Empty Docks', 'Available Bikes'],
          datasets: [
            {
              label: 'GitHub Commits',
              backgroundColor: ['#17a2b8', '#28a745'],
              data: [this.info.docksAvailable, this.info.bikesAvailable]
            }
          ]
        },
        {}
      );
    }
  }
};
</script>
