<template>
  <div id="app">
    <div class="wrapp">
      <p>Choose a coin</p>
      <select v-model="coin" name="name" id="">
      <option @click="getData" :key="a.name" v-for="a in arr" :value="a.name">{{ a.name }}</option>
    </select>
    </div>
    
    <div v-if="isLoading" class="preloader-wrapp">
      <div class="preloader"></div>
    </div>
      <ChartComponent />
    <!-- v-if=""  -->
    
    
  </div>
</template>

<script>
import ChartComponent from './components/ChartСomponent.vue'
import axios from 'axios';
import "@/assets/fonts.css";
// import moment from 'moment'

export default {
  name: 'App',
  data() {
    return {
      arr: [],
      prices: [],
      coin: 'Bitcoin',
      isLoading: true,
    }
  },
  watch: {
    coin() {
      this.getData()
    }
  },
  // Метод компонента для получения данных с помощью axios
  methods: {

    getCoins() {
      axios.get("https://api.coinranking.com/v2/search-suggestions")
        .then((response) => {
          this.arr = response.data.data.coins
          console.log(response.data.data.coins)
          this.getData()
        })
    },
    getData() {
      const uuid = this.arr.filter(a => a.name == this.coin)[0].uuid
      console.log(uuid)
      this.isLoading = true
      axios.get(`https://api.coinranking.com/v2/coin/${uuid}/history?timePeriod=1y`) //запрос на получение данных о цене биткоина за последние 360 дней
        .then((response) => {
          this.prices = response.data.data.history // Сохранение полученных данных 
          console.log(this.prices[0].price)
          this.$store.commit('dataCoin', this.prices)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
  },
  created() {
    this.getCoins()
  },
  components: {
    ChartComponent
  },
}
</script>

<style>
.preloader-wrapp {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #fff;
}
.preloader {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 50px;
  width: 50px;
  margin: -25px 0 0 -25px;
  border: 4px rgba(67, 180, 255, 0.25) solid;
  border-top: 4px #269ffb solid;
  border-radius: 50%;
  -webkit-animation: spin2 1s infinite linear;
          animation: spin2 1s infinite linear;
}

@-webkit-keyframes spin2 {
  from {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
            transform: rotate(359deg);
  }
}
@keyframes spin2 {
  from {
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
            transform: rotate(359deg);
    -webkit-transform: rotate(359deg);
            transform: rotate(359deg);
  }
}


select {
  background-color: white;
  border: 1px #269ffb solid;
  font-family: "Montserrat Alternates";
}

.wrapp {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 35px;
  font-family: "Montserrat Alternates";
}
option {
  font-family: Arial;
  font-size: 14px;
}
option:hover {
  background: #269ffb;
}
</style>
