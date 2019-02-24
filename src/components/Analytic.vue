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
          <select class="form-control" id="mode" v-model="mode" v-on:change="resetInfo">
            <option v-for="mode in modes" :value="mode.name" :key="mode.name">
              {{ mode.label }}
            </option>
          </select>
        </div>
        <div class="form-group col" v-if="mode === 'getOneSeries'">
          <label class="" for="startDate">Start date</label>
          <input class="form-control" type="date" name="startDate"
            :min="minDate" v-model="fromDate" v-on:change="resetInfo">
        </div>
        <div class="form-group col" v-if="mode === 'getOneSeries'">
          <label for="startTime">Start time</label>
          <input class="form-control" type="time" name="startTime"
            v-model="fromTime" v-on:change="resetInfo">
        </div>
        <div class="form-group col">
          <label class="" for="endDate">
            {{ mode === 'getOneSeries' ? 'End Date' : 'Snapshot date' }}
          </label>
          <input class="form-control" type="date" name="endDate"
            :min="minDate" v-model="toDate" v-on:change="resetInfo">
        </div>
        <div class="form-group col">
          <label for="endTime">
            {{ mode === 'getOneSeries' ? 'End Time' : 'Snapshot time' }}
          </label>
          <input class="form-control" type="time" name="endTime"
            v-model="toTime" v-on:change="resetInfo">
        </div>
        <div class="form-group col-12"
          v-if="mode !== 'getAllSnap' && stationIds[0].address"
        >
          <label for="stationId">Select station</label>
          <select class="form-control" id="stationId" v-model="stationId">
            <option v-if="sta.id" v-for="sta in stationIds" :value="sta.id" :key="sta.id">
              {{ sta.address }}
            </option>
          </select>
        </div>
      </form>
      <p class="col-lg-6" v-if="loading">
        <strong>👩🏿‍🔬 Reticulating splines... 👨🏽‍💻</strong>
      </p>
      <p class="col-lg-6" v-if="error || (mode !== 'getAllSnap' && !stationAddress)">
        <strong>No data returned for this request.</strong>
      </p>
      <PieChart class="col-lg-6" :info="info"
        v-else-if="mode === 'getOneSnap' && info"/>
      <BarChart class="col-lg-12" :info="info"
        v-else-if="mode === 'getAllSnap' && info"/>
      <LineChart class="col-lg-12" :info="info"
        v-else-if="mode === 'getOneSeries' && info"/>
    </div>
  </div>
  </section>
</template>

<script>
import ApiService from '@/services/ApiService';
import PieChart from '@/components/PieChart.vue';
import BarChart from '@/components/BarChart.vue';
import LineChart from '@/components/LineChart.vue';
import moment from 'moment';

const initialMoment = moment().subtract({ hours: 1 });
const initialDate = initialMoment.format('YYYY-MM-DD');
const initialTime = initialMoment.format('HH:00');
const initialFrom = initialMoment.subtract({ hours: 72 });
const initialFromDate = initialFrom.format('YYYY-MM-DD');
const initialFromTime = initialFrom.format('HH:00');

export default {
  name: 'Analytic',
  components: {
    PieChart,
    BarChart,
    LineChart
  },
  data() {
    return {
      stationId: 3069,
      toDate: initialDate,
      toTime: initialTime,
      fromDate: initialFromDate,
      fromTime: initialFromTime,
      minDate: process.env.VUE_APP_MIN_DATE,
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
        },
        {
          name: 'getOneSeries',
          label: 'One station over time'
        }
      ],
      error: null,
      loading: true
    };
  },
  computed: {
    stationAddress: function() {
      let source;

      if (this.info && this.info.addressStreet) {
        source = this.info;
      } else if (
        this.info &&
        this.info.length > 0 &&
        this.info[0].station.properties
      ) {
        source = this.info[0].station.properties;
      } else {
        return null;
      }

      return `${source.addressStreet}, ${source.addressCity} ${
        source.addressState
      } ${source.addressZipCode}`;
    }
  },
  methods: {
    resetInfo: function () {
      this.info = null;
    },
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
            case 'getOneSeries':
              data = res.data.data;

              break;
            default:
              console.error('Request mode not recognized.');
          }

          this.loading = false;

          return data;
        })
        .catch(err => {
          console.error('getInfo 🚨', err);
          return {};
        });

      return stationData;
    },
    // Set all station IDs to populate the select input.
    getStationList: async function(opts) {
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
          console.error('getStationList 🚨', err);
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
        this.loading = true;

        this.info = await this.getInfo({
          mode: data.mode,
          id: data.stationId,
          toDate: data.toDate ? data.toDate : initialDate,
          toTime: data.toTime ? data.toTime : initialTime,
          fromDate: this.mode === 'getOneSeries' ? this.fromDate : null,
          fromTime: this.mode === 'getOneSeries' ? this.fromTime : null
        });

        await this.getStationList({
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

    await this.getStationList({
      toDate: this.toDate,
      toTime: this.toTime
    });
  }
};
</script>
