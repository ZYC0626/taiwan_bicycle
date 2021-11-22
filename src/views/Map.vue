<template>
  <div class="wrap">
    <nav class="navbar navbar-light bg-light sticky-top nav-shadow">
      <div class="container-fluid">
        <a class="navbar-brand p-0 m-0" href="#">
          <img src="@/assets/images/LOGO.png" class="brand-img" alt="logo">
        </a>
        <div class="type me-3">
          <button class="btn btn-searchType me-3" @click="searchType = 'station'"
          :class="{active : searchType === 'station'}">尋找單車</button>
          <button class="btn btn-searchType" @click="searchType = 'route'"
          :class="{active : searchType === 'route'}"
          >尋找車道</button>
        </div>
        <div class="d-md-none d-block">
          <a href="#" class="p-0 m-0"><img src="@/assets/images/search.svg" alt="search"
          @click.prevent="callMobileSearch(true)"></a>
        </div>
      </div>
    </nav>
    <div class="map-wrap">
      <div class="map" id="map"></div>
    </div>
    <div class="gps-icon" @click="locateGPS()">
      <img src="@/assets/images/gps.svg" class="icon-filter" alt="gps-icon">
    </div>
    <div v-if="searchStatus" class="show-list-bar d-md-none d-block">
      <div class="row g-0">
        <div class="col-4"></div>
        <div class="col-4"></div>
        <div class="col-4">
          <a href="#" class="list-controll"
            @click.prevent="listShow()">顯示列表</a>
        </div>
      </div>
    </div>
    <div class="mobile-search-area d-md-none d-block">
      <div class="d-flex mb-3">
        <div class="title" v-if="searchType === 'station'">尋找單車</div>
        <div class="title" v-else>尋找車道</div>
        <a href="#" class="ms-auto"><img src="@/assets/images/close.png" alt="close"
        @click.prevent="callMobileSearch(false)"></a>
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
            <div class="col-6" v-if="searchType === 'station'">
              <div class="btn btn-primary-custom w-100"
              @click="getStation()">搜尋</div>
            </div>
            <div class="col-6" v-else>
              <div class="btn btn-primary-custom w-100"
              @click="getRoute()">搜尋</div>
            </div>
      </div>
    </div>
    <div class="search-area d-md-block d-none">
      <div class="search-bar">
        <div class="search-bar-topborder"></div>
        <div class="search-bar-input">
          <h2 class="mb-3" v-if="searchType === 'station'">尋找單車</h2>
          <h2 class="mb-3" v-else>尋找車道</h2>
          <input type="search" class="input-custom mb-3 w-100" placeholder="輸入關鍵字"
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
            <div class="col-6" v-if="searchType === 'station'">
              <div class="btn btn-primary-custom w-100"
              @click="getStation()">搜尋</div>
            </div>
            <div class="col-6" v-else>
              <div class="btn btn-primary-custom w-100"
              @click="getRoute()">搜尋</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="list-area-container" id="stationList">
      <div class="list-area-body">
        <ul class="station-list">
          <li class="station-list-item" v-for="station in stationSearchList" :key="station.StationUID"
          :class="{selected : selectMarkerID === station.markerID}"
          @click="goToLocation(station)">
            <div class="title">{{ station.StationName.Zh_tw }}</div>
            <div class="address"><img src="@/assets/images/location.png" alt="location">{{ station.StationAddress.Zh_tw  }}</div>
            <div class="d-flex">
              <template v-if="station.BikeAvailability">
                <template v-if="station.BikeAvailability.ServiceStatus">
                  <div class="tag normal" v-if="station.BikeAvailability.ServiceStatus  === 1">正常營運</div>
                  <div class="tag danger" v-else-if="station.BikeAvailability.ServiceStatus === 2">暫停營運</div>
                  <div class="tag stop" v-else>停止營運</div>
                  <div class="tag danger" v-if="station.BikeAvailability.AvailableRentBikes   === 0">已無單車</div>
                  <div class="tag warning" v-else-if="station.BikeAvailability.AvailableReturnBikes  === 0">車位已滿</div>
                  <div class="tag normal" v-else>尚有單車</div>
                </template>
              </template>
            </div>
          </li>
        </ul>
      </div>
      <div class="list-area-footer text-center">
        <div class="row g-0">
          <div class="col-4"></div>
          <div class="col-4"><span>pages</span></div>
          <div class="col-4">
            <a href="#" class="list-controll d-md-none d-block"
            @click.prevent="listHide()">顯示地圖</a>
          </div>
        </div>
      </div>
    </div>
    <div class="list-area-container" id="routeList">
      <div class="list-area-body">
        <ul class="route-list">
          <li class="route-list-item"
            v-for="route in routeSearchList" :key="route.RouteName"
            :class="{selected : selectMarkerID === route.markerID}"
            @click="goToLocation(route)"
            >
            <div class="title">{{ route.RouteName }}</div>
            <div class="address"><img src="@/assets/images/location.png" alt="location">{{ route.City }} {{ route.Town }}</div>
            <div class="d-flex">
              <div class="distance w-50"><img src="@/assets/images/direction.png" alt="direction" class="me-1">{{ route.Direction }}</div>
              <div class="distance w-50"><img src="@/assets/images/distance.png" alt="direction" class="me-1">{{ route.CyclingLength }}公尺</div>
            </div>
            <div class="site"><span class="site-name">開始</span><span class="site-content">{{ route.RoadSectionStart }}</span></div>
            <div class="site"><span class="site-name">結束</span><span class="site-content">{{ route.RoadSectionEnd }}</span></div>
            <div class="realtion-icon"><img src="@/assets/images/next.svg" height="24" alt="next"
            @click="goTorelationList(route.centerLatLng)"></div>
          </li>
        </ul>
      </div>
      <div class="list-area-footer text-center">
        <div class="row g-0">
          <div class="col-4"></div>
          <div class="col-4"><span>pages</span></div>
          <div class="col-4">
            <a href="#" class="list-controll d-md-none d-block"
            @click.prevent="listHide()">顯示地圖</a>
          </div>
        </div>
      </div>
    </div>
    <div class="list-area-container" id="relationList">
      <a href="#" class="return" @click.prevent="returnToRoute()"><img src="@/assets/images/forword.svg" alt="forward"> 返回</a>
      <div class="list-area-body">
        <ul class="relation-list">
          <li class="relation-list-item"
          v-for="(item) in relationList" :key="item.ID"
          :class="{selected : selectMarkerID === item.markerID}"
          @click="goToLocation(item)">
          <div class="d-flex">
            <img src="@/assets/images/miss_s.png" alt="missing">
            <div class="px-2">
              <div class="title">{{ item.Name }}</div>
              <div class="address" v-if="item.City"><img src="@/assets/images/location.png" alt="location">{{ item.City }}</div>
              <div class="tag">{{ item.type }}</div>
            </div>
          </div>
          </li>
        </ul>
      </div>
      <div class="list-area-footer text-center">
        <div class="row g-0">
          <div class="col-4"></div>
          <div class="col-4"><span>pages</span></div>
          <div class="col-4">
            <a href="#" class="list-controll d-md-none d-block"
            @click.prevent="listHide()">顯示地圖</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $L from 'leaflet'
import Wkt from 'wicket'
import stationCity from '@/assets/stationCity.json'
import routeCity from '@/assets/routeCity.json'

let openStreetMap = {}
let stationMarkersStore = []
let routeMarkerStore = []
let routeLayersStore = []
let relationMarkerStore = []

const locateIcon = new $L.Icon({
  iconUrl: require('@/assets/images/location.svg'),
  iconSize: [49, 63],
  iconAnchor: [24, 55],
  popupAnchor: [0, 0]
})

const stationIcon = new $L.Icon({
  iconUrl: require('@/assets/images/station.svg'),
  iconSize: [49, 63],
  iconAnchor: [24, 55],
  popupAnchor: [0, -50]
})

const routeIcon = new $L.Icon({
  iconUrl: require('@/assets/images/route.svg'),
  iconSize: [49, 63],
  iconAnchor: [24, 55],
  popupAnchor: [0, -50]
})

const restaurantIcon = new $L.Icon({
  iconUrl: require('@/assets/images/restaurant.svg'),
  iconSize: [49, 63],
  iconAnchor: [24, 55],
  popupAnchor: [0, -50]
})

const viewIcon = new $L.Icon({
  iconUrl: require('@/assets/images/view.svg'),
  iconSize: [49, 63],
  iconAnchor: [24, 55],
  popupAnchor: [0, -50]
})

function changeMarkerIcon (target, icon, store) {
  let targetMarker = null
  store.forEach((x) => {
    if (target.markerID === x._leaflet_id) {
      targetMarker = x
    }
  })
  if (targetMarker) {
    openStreetMap.setView(targetMarker._latlng, 17)
    icon.options.popupAnchor = [0, -50]
    // console.log(targetMarker)
    targetMarker.setIcon(icon).openPopup()
  }
}
function changeRouteStyle (target, style) {
  let targetLayer = null
  routeLayersStore.forEach((x) => {
    if (target.layerID === x._leaflet_id) {
      targetLayer = x
    }
  })
  if (targetLayer) {
    // console.log(targetLayer)
    targetLayer.setStyle(style)
  }
}
function removeMapMarker () {
  console.log(typeof openStreetMap)
  openStreetMap.eachLayer((layer) => {
    if (layer instanceof $L.Marker) {
      openStreetMap.removeLayer(layer)
    }
    if (layer.toGeoJSON) {
      openStreetMap.removeLayer(layer)
    }
  })
  stationMarkersStore = []
  routeMarkerStore = []
  routeLayersStore = []
}
function resetHeight () {
  // reset the body height to that of the inner browser
  console.log('resize')
  document.querySelector('.wrap').style.heigtht = window.innerHeight + 'px'
}

export default {
  components: {},
  data () {
    return {
      searchStatus: false,
      searchType: 'station',
      openStreetMap: {},
      selectMarkerID: '',
      stationSearchList: [],
      routeSearchList: [],
      stationSearchByLocate: null,
      searchKeyWord: '',
      searchCity: 'NewTaipei',
      lastTarget: null,
      relationList: [],
      stationCity,
      routeCity
    }
  },
  methods: {
    showCenter () {
      const center = openStreetMap.getCenter()
      $L.popup()
        .setLatLng([center.lat, center.lng])
        .setContent('I am a Center.')
        .openOn(openStreetMap)
    },
    goToLocation (target) {
      if (this.searchType === 'station') {
        if (this.lastTarget) {
          changeMarkerIcon(this.lastTarget, stationIcon, stationMarkersStore)
        }
        changeMarkerIcon(target, locateIcon, stationMarkersStore)
      } else {
        if (this.lastTarget) {
          if (this.lastTarget.iconType === 'route') {
            changeMarkerIcon(this.lastTarget, routeIcon, routeMarkerStore)
            changeRouteStyle(this.lastTarget, { color: '#21A400', weight: 3 })
          } else if (this.lastTarget.iconType === 'view') {
            changeMarkerIcon(this.lastTarget, viewIcon, relationMarkerStore)
          } else if (this.lastTarget.iconType === 'restaurant') {
            changeMarkerIcon(this.lastTarget, restaurantIcon, relationMarkerStore)
          }
        }
        if (target.iconType === 'route') {
          changeMarkerIcon(target, locateIcon, routeMarkerStore)
          changeRouteStyle(target, { color: '#C50047', weight: 8 })
        } else if (target.iconType === 'view') {
          changeMarkerIcon(target, locateIcon, relationMarkerStore)
        } else if (target.iconType === 'restaurant') {
          changeMarkerIcon(target, locateIcon, relationMarkerStore)
        }
      }
      this.lastTarget = target
      this.selectMarkerID = target.markerID
    },
    locateGPS () {
      // 定位
      // openStreetMap.locate({ setView: true, maxZoom: 16 })
      navigator.geolocation.getCurrentPosition(position => {
        const locate = [position.coords.latitude, position.coords.longitude]
        openStreetMap.setView(locate, 15)
        document.querySelector('.gps-icon').classList.add('active')
        if (this.searchType === 'station') {
          removeMapMarker()
          this.stationSearchByLocate = locate
          this.getStation()
          document.querySelector('#stationList').classList.add('active')
          this.stationSearchByLocate = null
        }
      })
    },
    getStation () {
      this.lastTarget = null
      stationMarkersStore = null
      this.searchStatus = true
      document.querySelector('#stationList').classList.add('active')
      // first get Station by Name
      let url = ''
      if (this.stationSearchByLocate) {
        url = `https://ptx.transportdata.tw/MOTC/v2/Bike/Station/NearBy?$top=30&$spatialFilter=nearby(${this.stationSearchByLocate[0]}%2C%20${this.stationSearchByLocate[1]}%2C%201000)&$format=JSON`
      } else {
        url = `https://ptx.transportdata.tw/MOTC/v2/Bike/Station/${this.searchCity}?$filter=contains(StationName%2FZh_tw%20%2C'${this.searchKeyWord}')&$top=${300}&$format=JSON`
      }
      // const url = `https://ptx.transportdata.tw/MOTC/v2/Bike/Station/NewTaipei?$filter=contains(StationName%2FZh_tw%20%2C'${this.searchKeyWord}')&$top=${20}&$format=JSON`
      console.log(url)
      this.axios.get(url,
        {
          headers: this.$getAuthorizationHeader()
        }
      )
        .then((response) => {
          console.log(response.data)
          if (response.data.length > 0) {
            this.getStationInfo(response.data)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getStationInfo (data) {
      const idList = []
      data.forEach((x) => {
        idList.push(x.StationUID)
      })
      const idListStr = "('" + idList.join("','") + "')"
      const url = `https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/${this.searchCity}?$filter=StationUID%20%20in%20${idListStr}&$format=JSON`
      this.axios.get(url,
        {
          headers: this.$getAuthorizationHeader()
        }
      )
        .then((response) => {
          // console.log(response.data)
          const stationAvail = response.data
          this.stationSearchList = []
          data.forEach((x) => {
            stationAvail.forEach((y) => {
              if (x.StationUID === y.StationUID) {
                const copyX = JSON.parse(JSON.stringify(x))
                const copyY = JSON.parse(JSON.stringify(y))
                copyX.BikeAvailability = copyY
                this.stationSearchList.push(copyX)
              }
            })
          })
          removeMapMarker()
          this.addStationMarker()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    addStationMarker () {
      this.stationSearchList.forEach((x) => {
        const marker = $L.marker([x.StationPosition.PositionLat, x.StationPosition.PositionLon], { icon: stationIcon })
        // .on('click', markerOnClick)
        marker.addTo(openStreetMap)
          .bindPopup(this.createPopUpContent(x))
        stationMarkersStore.push(marker)
        x.markerID = marker._leaflet_id
        x.iconType = 'station'
      })
      openStreetMap.setView([this.stationSearchList[0].StationPosition.PositionLat, this.stationSearchList[0].StationPosition.PositionLon], 15)
    },
    createPopUpContent (data) {
      let str = '<div class="station-pop-info">'
      str += `<div class="title">${data.StationName.Zh_tw}</div>`
      str += `<div class="address"><img src="${require('@/assets/images/location.png')}" height="20" class="me-1" alt="location">${data.StationAddress.Zh_tw}</div>`
      str += `<div class="updateTime"><img src="${require('@/assets/images/renew.png')}" height="20" class="me-1" alt="location">${this.$filters.formatDate(data.BikeAvailability.UpdateTime)}</div>`
      str += '<div class="d-flex">'
      if (data.BikeAvailability.ServiceStatus === 1) str += '<div class="tag normal">正常營運</div>'
      else if (data.BikeAvailability.ServiceStatus === 2) str += '<div class="tag danger">暫停營運</div>'
      else str += '<div class="tag stop">停止營運</div>'
      if (data.BikeAvailability.AvailableRentBikes === 0) str += '<div class="tag danger">已無單車</div>'
      else if (data.BikeAvailability.AvailableReturnBikes === 0) str += '<div class="tag warning">車位已滿</div>'
      else str += '<div class="tag normal">尚有單車</div>'
      str += '</div>'
      str += '    <div class="row g-2 mt-1">'
      str += '      <div class="col-6">'
      if (data.BikeAvailability.AvailableRentBikes === 0) str += '<div class="status danger">'
      else str += '<div class="status">'
      str += '          <div class="status-title">可借單車</div>'
      str += `          <div class="status-number">${data.BikeAvailability.AvailableRentBikes}</div>`
      str += '        </div>'
      str += '      </div>'
      str += '      <div class="col-6">'
      if (data.BikeAvailability.AvailableReturnBikes === 0) str += '<div class="status warning">'
      else str += '<div class="status">'
      str += '          <div class="status-title">可停空位</div>'
      str += `          <div class="status-number">${data.BikeAvailability.AvailableReturnBikes}</div>`
      str += '        </div>'
      str += '      </div>'
      str += '    </div>'
      str += '</div>'
      return str
    },
    // route
    getRoute () {
      this.lastTarget = null
      routeMarkerStore = null
      routeLayersStore = null
      this.relationList = []
      const url = `https://ptx.transportdata.tw/MOTC/v2/Cycling/Shape/${this.searchCity}?$filter=contains(RouteName%2C'${this.searchKeyWord}')&$orderby=CyclingLength%20desc&$top=100&$format=JSON`
      this.axios.get(url,
        {
          headers: this.$getAuthorizationHeader()
        }
      )
        .then((response) => {
          console.log(response.data)
          this.routeSearchList = response.data
          // console.log(this.routeSearchList)
          removeMapMarker()
          this.addRouteMarker()
          this.searchStatus = true
          document.querySelector('#routeList').classList.add('active')
          document.querySelector('#relationList').classList.remove('active')
        })
        .catch((err) => {
          console.log(err)
        })
    },
    addRouteMarker () {
      const geoStyle = {
        color: '#21A400',
        weight: 3
      }
      let layer = null
      this.routeSearchList.forEach((route) => {
        const wicket = new Wkt.Wkt()
        wicket.read(route.Geometry)
        const geoJsonFeature = wicket.toJson()
        try {
          layer = $L.geoJSON(geoJsonFeature, { style: geoStyle }).addTo(openStreetMap)
          layer.addData(geoJsonFeature)
          // marker
          // const markerLatlng = layer.getBounds().getCenter()
          const middlePoint = this.$filters.middleArray(this.$filters.middleArray(geoJsonFeature.coordinates))
          const markerLatlng = [middlePoint[1], middlePoint[0]]
          // console.log(markerLatlng)
          const marker = $L.marker(markerLatlng, { icon: routeIcon })
          marker.addTo(openStreetMap)
            .bindPopup(`
            <div class="station-pop-info">
              <div class="title">${route.RouteName}</div>
            </div>`)
          route.markerID = marker._leaflet_id
          route.layerID = layer._leaflet_id
          route.centerLatLng = markerLatlng
          route.iconType = 'route'
          routeMarkerStore.push(marker)
          routeLayersStore.push(layer)
        } catch (e) {
          console.log(e)
        }
      })
      // console.log(routeLayersStore)
      // openStreetMap.fitBounds(layer.getBounds())
    },
    goTorelationList (LatLng) {
      document.querySelector('#routeList').classList.remove('active')
      document.querySelector('#relationList').classList.add('active')
      openStreetMap.eachLayer((layer) => {
        relationMarkerStore.forEach((x) => {
          if (x._leaflet_id === layer._leaflet_id) {
            openStreetMap.removeLayer(layer)
          }
        })
      })
      openStreetMap.setView(LatLng, 15)
      this.relationList = []
      relationMarkerStore = []
      this.getSpotNearby(LatLng)
      this.getRestaurantNearby(LatLng)
    },
    getSpotNearby (LatLng) {
      const url = `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot/${this.searchCity}?$orderby=UpdateTime%20desc&$top=100&$spatialFilter=nearby(${LatLng[0]}%2C%20${LatLng[1]}%2C%2010000)&$format=JSON`
      this.axios.get(url,
        {
          headers: this.$getAuthorizationHeader()
        }
      )
        .then((response) => {
          // console.log(response.data)
          response.data.forEach((x) => {
            this.addRelationMarker(x, viewIcon, 'view')
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getRestaurantNearby (LatLng) {
      const url = `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant/${this.searchCity}?$orderby=UpdateTime%20desc&$top=100&$spatialFilter=nearby(${LatLng[0]}%2C%20${LatLng[1]}%2C%20500)&$format=JSON`
      this.axios.get(url,
        {
          headers: this.$getAuthorizationHeader()
        }
      )
        .then((response) => {
          // console.log(response.data)
          response.data.forEach((x) => {
            this.addRelationMarker(x, restaurantIcon, 'restaurant')
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    addRelationMarker (target, icon, type) {
      const LatLng = [target.Position.PositionLat, target.Position.PositionLon]
      const marker = $L.marker(LatLng, { icon: icon })
      marker.addTo(openStreetMap)
        .bindPopup(`
        <div class="station-pop-info">
          <div class="title">${target.Name}</div>
        </div>`)
      target.markerID = marker._leaflet_id
      target.type = type === 'view' ? '景點' : '餐飲'
      target.iconType = type
      this.relationList.push(target)
      relationMarkerStore.push(marker)
    },
    returnToRoute () {
      document.querySelector('#routeList').classList.add('active')
      document.querySelector('#relationList').classList.remove('active')
    },
    callMobileSearch (status) {
      if (status) document.querySelector('.mobile-search-area').classList.add('active')
      else document.querySelector('.mobile-search-area').classList.remove('active')
    },
    listHide () {
      document.querySelector('#routeList').classList.remove('active')
      document.querySelector('#relationList').classList.remove('active')
      document.querySelector('#stationList').classList.remove('active')
    },
    listShow () {
      if (this.searchType === 'route') {
        if (this.relationList.length > 0) document.querySelector('#relationList').classList.add('active')
        else if (this.routeSearchList.length > 0) document.querySelector('#routeList').classList.add('active')
      } else {
        document.querySelector('#stationList').classList.add('active')
      }
    }
  },
  watch: {
    searchType () {
      console.log('test')
      removeMapMarker()
      this.stationSearchList = []
      this.searchKeyWord = ''
      this.searchStatus = false
      document.querySelector('#stationList').classList.remove('active')
      document.querySelector('#routeList').classList.remove('active')
      document.querySelector('#relationList').classList.remove('active')
    }
  },
  mounted () {
    // quick start
    openStreetMap = $L.map('map', {
      zoomControl: false,
      center: [25.0834397, 121.4570441],
      zoom: 13,
      tap: false
    })
    $L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(openStreetMap)

    // resset zoom position
    $L.control.zoom({
      position: 'topright'
    }).addTo(openStreetMap)
    openStreetMap.on('moveend', function () {
      document.querySelector('.gps-icon').classList.remove('active')
    })
    const paramStr = this.$route.params.queryString
    const param = JSON.parse(paramStr)
    this.searchKeyWord = param.keyword
    this.searchCity = param.city
    this.searchType = param.type
    if (this.searchType === 'station') this.getStation()
    else this.getRoute()

    window.addEventListener('resize', resetHeight)
    resetHeight()
  },
  unmounted () {
    window.removeEventListener('resize', resetHeight)
  }
}
</script>
