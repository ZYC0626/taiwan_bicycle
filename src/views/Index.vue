<template>
  <div class="bg-index">
    <nav class="navbar navbar-light bg-light sticky-top nav-shadow">
      <div class="container-fluid">
        <a class="navbar-brand p-0 m-0" href="#">
          <img src="@/assets/images/LOGO.png" class="brand-img" alt="logo" />
        </a>
        <div class="type me-3">
          <button
            class="btn btn-searchType me-3"
            @click="searchType = 'station'"
            :class="{ active: searchType === 'station' }"
          >
            尋找單車
          </button>
          <button
            class="btn btn-searchType"
            @click="searchType = 'route'"
            :class="{ active: searchType === 'route' }"
          >
            尋找車道
          </button>
        </div>
      </div>
    </nav>
    <div class="copyright"><a href="https://2021.thef2e.com/users/6296427084285739688?week=2&type=1" target="_blank">UI designer: Hao</a></div>
    <img src="@/assets/images/Vector-1.png" alt="img" class="index-img-top">
    <img src="@/assets/images/Vector.png" alt="img" class="index-img-bottom">
    <div class="container-xl container-fluid index-content">
      <div class="row">
        <div class="col-sm-12 col-md-3 col-xl-12"></div>
        <div class="col-lg-4 col-md-6 col-sm-8 col-12">
          <div class="index-content-input">
            <img src="@/assets/images/LOGO.png" class="index-logo" alt="logo">
            <div class="title">
              尋找單車, <br>來場悠閒的放鬆之旅!
            </div>
            <input type="search" class="input-custom mb-2 w-100" placeholder="輸入關鍵字"
              v-model="searchKeyWord"
              :style="{ 'background-image': 'url(' + require('@/assets/images/search.svg') + ')' }">
            <div class="row">
                  <div class="col-6">
                    <select class="form-select h-100" v-if="searchType === 'station'" v-model="searchCity">
                      <option :value="city.City" v-for="city in stationCity" :key="city.CityID">{{ city.CityName }}</option>
                    </select>
                    <select class="form-select h-100" v-else v-model="searchCity">
                      <option :value="city.City" v-for="city in routeCity" :key="city.CityID">{{ city.CityName }}</option>
                    </select>
                  </div>
                  <div class="col-6">
                    <div class="btn btn-primary-custom w-100"
                    @click="goToSearch()">搜尋</div>
                  </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-xl-3 col-12"></div>
        <div class="col-xl-6 col-12 img-row">
          <img src="@/assets/images/bike1.png" class="me-md-4 me-2 bike-img" alt="bike1">
          <img src="@/assets/images/bike2.png" class="me-md-4 me-2 bike-img" alt="bike2">
          <img src="@/assets/images/bike3.png" class="me-md-4 me-2 bike-img" alt="bike3">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import stationCity from '@/assets/stationCity.json'
import routeCity from '@/assets/routeCity.json'

export default {
  data () {
    return {
      searchType: 'station',
      searchCity: 'NewTaipei',
      searchKeyWord: '',
      stationCity,
      routeCity
    }
  },
  methods: {
    goToSearch () {
      console.log('search')
      const param = {
        type: this.searchType,
        city: this.searchCity,
        keyword: this.searchKeyWord
      }
      const qryStr = JSON.stringify(param)
      this.$router.push(`/map/${qryStr}`)
    }
  }
}
</script>
