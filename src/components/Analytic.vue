<template>
  <section>
  <div class="card mb-3">
    <div class="card-header">
      <strong>Date/Time:</strong> {{ toDate || 'Date not set' }}, {{ toTime || 'Time not set' }}<br/>
      <span v-if="mode !== 'getAllSnap' && stationAddress">
        <strong>Station:</strong> {{ stationAddress }} (ID: {{ stationId }})
      </span>
    </div>
    <div class="card-body row">
      <form class="col-lg-6 form-row">
        <div class="form-group col-12">
          <label for="mode">Query mode</label>
          <select class="form-control" id="mode" v-model="mode">
            <option v-for="mode in modes" :value="mode.name" :key="mode.name">
              {{ mode.label }}
            </option>
          </select>
        </div>
        <div class="form-group col">
          <label class="" for="startDate">Snapshot date</label>
          <input class="form-control" type="date" name="startDate" v-model="toDate">
        </div>
        <div class="form-group col">
          <label for="startTime">Snapshot time</label>
          <input class="form-control" type="time" name="startTime" v-model="toTime">
        </div>
        <div class="form-group col-12" v-if="mode !== 'getAllSnap'">
          <label for="stationId">Station</label>
          <select class="form-control" id="stationId" v-model="stationId">
            <option v-if="sta.id" v-for="sta in stationIds" :value="sta.id" :key="sta.id">
              {{ sta.address }}
            </option>
          </select>
        </div>
      </form>
      <p class="col-lg-6" v-if="error || (mode !== 'getAllSnap' && !stationAddress)">
        <strong>No data returned for this request.</strong>
      </p>
      <PieChart class="col-lg-6" :info="info" v-else-if="mode === 'getOneSnap'"/>
      <BarChart class="col-lg-12" :info="info" v-else-if="mode === 'getAllSnap'"/>
    </div>
  </div>
  </section>
</template>

<script>
import ApiService from '@/services/ApiService';
import PieChart from '@/components/PieChart.vue';
import BarChart from '@/components/BarChart.vue';
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
    PieChart,
    BarChart
  },
  data() {
    return {
      stationId: 3069,
      toDate: initialDate,
      toTime: initialTime,
      info: {},
      mode: 'getOneSnap',
      stationIds: [3069],
      modes: [
        {
          name: 'getOneSnap',
          label: 'One station at one time'
        },
        {
          name: 'getAllSnap',
          label: 'All stations at one time'
        }
        // {
        //   name: 'getOneSeries',
        //   label: 'One station over time'
        // }
      ],
      error: null
    };
  },
  computed: {
    stationAddress: function() {
      if (this.info && this.info.addressStreet) {
        return `${this.info.addressStreet}, ${this.info.addressCity} ${
          this.info.addressState
        } ${this.info.addressZipCode}`;
      } else {
        return null;
      }
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
          let data;

          switch (this.mode) {
            case 'getOneSnap':
              if (!res.data.station) {
                this.error = true;
                break;
              }

              this.error = null;
              data = res.data.station.properties;
              break;
            case 'getAllSnap':
              if (!res.data.stations) {
                this.error = true;
                break;
              }

              this.error = null;
              data = res.data.stations;
              break;
            default:
              console.error('Request mode not recognized.');
          }

          // TODO deal with the different results from other request modes.
          return data;
        })
        .catch(err => {
          console.error('getInfo 🚨', err);
          return {};
        });

      return stationData;
    },
    // Set all station IDs to populate the select input.
    getStations: async function(opts) {
      await ApiService.getAllSnap({
        toTime: `${opts.toDate}T${opts.toTime}`
      })
        .then(res => {
          this.stationIds = [];

          if (res.data && res.data.stations && res.data.stations.length > 0) {
            for (let station of res.data.stations) {
              this.stationIds.push({
                id: station.properties.kioskId,
                address: station.properties.addressStreet
              });
            }
            this.stationIds.sort((a, b) => a.id - b.id);
            this.error = null;
          } else {
            this.error = true;
          }
        })
        .catch(err => {
          console.error('getStations 🚨', err);
        });
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
        this.info = await this.getInfo({
          mode: data.mode,
          id: data.stationId,
          toDate: data.toDate ? data.toDate : initialDate,
          toTime: data.toTime ? data.toTime : initialTime
          // fromDate: this.mode === 'getOneSeries' ? this.fromDate : null,
          // fromTime: this.mode === 'getOneSeries' ? this.fromTime : null
        });

        await this.getStations({
          toDate: data.toDate ? data.toDate : initialDate,
          toTime: data.toTime ? data.toTime : initialTime
        });
      }
    );

    // Get the real station data to start.
    this.info = await this.getInfo({
      mode: this.mode,
      id: this.stationId,
      toDate: this.toDate,
      toTime: this.toTime
    });

    await this.getStations({
      toDate: this.toDate,
      toTime: this.toTime
    });
  }
};
</script>
