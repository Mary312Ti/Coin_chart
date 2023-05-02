<template>
  <div class="app">
    <select class="selected" v-model="selectedMonth" @change="updateChart">
      <option v-for="month in months " :value="month" :key="month">{{ month }}</option>
    </select>
    <apexcharts class="chart" width="1200" type="candlestick" :options="chartOptions" :series="series">
    </apexcharts>
    <div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import moment from 'moment'

export default {
  name: 'ChartComponent',
  components: {
    apexcharts: VueApexCharts,
  },

  data() {
    return {
      series: [{
        data: []
      }],
      chartOptions: {
        chart: {
          type: 'candlestick',
          height: 350,
        },
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true
        },
        tooltip: {
          enabled: true,
          x: {
            format: 'dd.MM.yyyy'
          },
          y: {
            formatter: (value) => { value.toFixed(2) }
          }
        },
        title: {
          text: '',
          align: 'left'
        },
        xaxis: {
          type: 'datetime',
          labels: {
            datetimeUTC: false // отключаем автоматический формат даты
          }
        },
        yaxis: {
          tooltip: {
            enabled: true
          }
        },
        toolbar: {
          autoSelected: 'zoom'
        },
      },
      selectedMonth: null,
      months: []
    }
  },
  computed: {
    coinData() {
      const callCoin = this.$store.getters.callCoin;
      if (callCoin) {
        return callCoin.map(item => {
          return {
            value: item.price,
            date: moment.unix(item.timestamp).format('YYYY-MM-DD')
          }
        });
      }
      return []
    },
    monthlyCoinData() {
      const firstDayOfMonth = date => moment(date, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');
      const uniqFirstDays = [...new Set(this.coinData.map(item => firstDayOfMonth(item.date)))];
      return uniqFirstDays.map(date => ({
        date: moment(date, 'YYYY-MM-DD').format('DD.MM.YYYY'),
        value: this.coinData.find(item => firstDayOfMonth(item.date) === date).value
      }));
    },
  },
  mounted() {
    this.months = [...new Set(this.coinData.map(item => moment(item.date).format('MMMM YYYY')))];
    this.selectedMonth = this.months[0];
    this.updateChart();
  },
  watch: {
    coinData() {
      this.months = [...new Set(this.coinData.map(item => moment(item.date).format('MMMM YYYY')))];
      this.selectedMonth = this.months[0];
      this.updateChart();
    },
    selectedMonth() {
      this.updateChart();
    }
  },
  methods: {
    updateChart() {
      const selectedMonth = moment(this.selectedMonth, 'MMMM YYYY');
      const filteredData = this.coinData.filter(item => moment(item.date).isSame(selectedMonth, 'month'));
      this.series = [{
        name: "Price",
        data: filteredData.map(item => ({
          x: moment(item.date, 'YYYY-MM-DD').valueOf(),
          y: [Number(item.value), Number(item.value), Number(item.value), Number(item.value)]
        }))
      }];
      this.chartOptions.xaxis.categories = filteredData.map(item => moment(item.date).format('DD.MM.YYYY'));
    },
  }
}
</script>

<style scoped>
.app {
  display: flex;
  justify-content: center;
}
.selected {
  height: 50px;
}

.apexcharts-tooltip {
  background-color: #269ffb !important;
}
</style>
