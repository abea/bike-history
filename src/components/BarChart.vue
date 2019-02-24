<script>
import { Bar } from 'vue-chartjs';

export default {
  extends: Bar,
  name: 'BarChart',
  props: {
    info: {
      type: Array,
      required: true
    }
  },
  methods: {
    render: function() {
      const labels = [];
      const colors = [];
      const data = [];

      this.info.forEach(station => {
        if (!station.properties.kioskId) {
          return;
        }
        labels.push(station.properties.kioskId);
        colors.push(`hsl(${Math.random() * 360}, 100%, 35%)`);
        data.push(station.properties.bikesAvailable);
      });
      this.renderChart(
        {
          labels: labels,
          datasets: [
            {
              label: '# of available bikes',
              backgroundColor: colors,
              borderWidth: 0,
              data: data
            }
          ]
        },
        {}
      );
    }
  },
  watch: {
    info: function() {
      this.render();
    }
  },
  mounted: function () {
    this.render();
  }
};
</script>
