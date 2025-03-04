<template>
    <div id="mapContainer" class="map" ref="rootmap"></div>
</template>

<script>
// APPEND_240618
import CPATCPA from './cpa_tcpa/cpa_tcpa.js'

import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import LayerGroup from 'ol/layer/Group'
import VectorSource from 'ol/source/Vector'
import { defaults as defaultControls } from 'ol/control'
import { fromLonLat, transform } from 'ol/proj'
import VectorLayer from 'ol/layer/Vector'
import { Style, Icon, Fill, Stroke, RegularShape, Text, Circle as CircleStyle } from 'ol/style'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point.js'
import Select from 'ol/interaction/Select'
import { Draw } from 'ol/interaction'
import emitter from '@/composables/eventbus'
import { TileWMS } from 'ol/source'
import { useMapStore } from '@/stores/mapStore'
import { useRouteStore } from '@/stores/routeStore'
import { getShipData, getShipWakeCurrent, getShipWakePast } from '@/api/worldMap'
import { getAisData } from '@/api/aisData'
import { storeToRefs } from 'pinia'
import { singleClick } from 'ol/events/condition'
import { LineString } from 'ol/geom'


import shipIcon from '/images/shipicons/shipIcon_green.png'
import selectShipIcon from '/images/shipicons/shipIcon_yellow.png'
import arrowIcon from '/images/shipicons/arrow.png'
import { getShipInfo } from '@/api/shipApi'
import { isStatusOk } from '@/composables/util'
import { useShipStore } from '@/stores/shipStore'

import { convertUTCTimezone } from '@/composables/util'

const urlBefore = import.meta.env.VITE_TILE_MAP_URL + '/'
const urlAfter = '/{z}/{x}/{-y}.png'
const ONE_MINUTES_TO_SECONDS = 60000
let sv = false;

const imoNums = null;
let vessels = false

// APPEND_240618
var OwnshipLat = 0
var OwnshipLon = 0
var OwnshipCrs = 0
var OwnshipSpeed = 0

const nums = 0;
//const geoserverWmsUrl = import.meta.env.VITE_GEOSERVER_WMS_URL

export default {
  name: 'olmap',
  data() {
    return {
      baselayers: LayerGroup,
      shipSource: VectorSource,
      shipLayer: VectorLayer,
      shipWakeLayer: VectorLayer,
      shipPastWakeLayer: VectorLayer,
      aisAtonLayer: VectorLayer,
      aisBasestationLayer: VectorLayer,
      aisClassLayer: VectorLayer,
      routePLayer: VectorLayer,
      routeLLayer: VectorLayer,
      mapTypeId: String,
      imoNumbers: [],
      curImoNumber: String,
      selectInteraction: Select,
      drawInteration_route: Draw,
      interval: ''
    }
  },
  props: [
    'propsdata',
    'curSelectedShip',
    'isShow',
    'isRouteShow',
    'vesselTrack',
    'startDate',
    'endDate',
    'isPastVesselTracks',
    'isCurrentTrack',
    'isPastTrack',
    'isRemoveTrack',
    'layerMode',
    'layerBright',
    'isSelect',
    'selWeather',
    'imoNumbers',
    'shipDataTwo'
  ],
  watch: {
    propsdata: function () {
      map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipLayer')
        .forEach((layer) => map.removeLayer(layer))
      map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipWakeLayer')
        .forEach((layer) => map.removeLayer(layer))
      map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipPastWakeLayer')
        .forEach((layer) => map.removeLayer(layer))
      this.imoNumbers = []

      var shipdataList = this.propsdata
      shipdataList.map((shipData) => {
        this.imoNumbers.push(shipData.imoNumber)
      })
      this.setShipLayer()
    },
    curSelectedShip: async function () {
      let imoNumber
      Object.keys(this.curSelectedShip).forEach((key) => {
        if (key === 'imoNumber') imoNumber = this.curSelectedShip[key]
      })

      if (imoNumber) {
        map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipWakeLayer')
        .forEach((layer) => map.removeLayer(layer))
      map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipPastWakeLayer')
        .forEach((layer) => map.removeLayer(layer))
        getShipInfo(imoNumber).then((response) => {
          const {
            status,
            data: { data }
          } = response
          if (isStatusOk(status)) {
            let cimoNums = null;
            const shipStore2 = useShipStore()
            const { checkedShips } = storeToRefs(shipStore2)
            let checkedShips2 = checkedShips.value;
            var temp
            if (checkedShips2 != null)
            if (checkedShips2.length !== 0) {
              temp = "";
              checkedShips2.forEach(ship => {
                if (temp !== undefined) temp = temp + ',' + ship.imoNumber
                else temp = ship.imoNumber
              })
              cimoNums = temp;
            }

            if (cimoNums != null)
            if (cimoNums.length != 0)
            getShipData(cimoNums).then((response) => {
                const { status, data } = response
                if (isStatusOk(status)) {
                  if (vessels == true) {
                        // this.vesselTrackCurrent();
                      }
                  map
                    .getLayers()
                    .getArray()
                    .filter((layer) => layer.get('name') === 'shipLayer')
                    .forEach((layer) => map.removeLayer(layer))

                  var shipDataList = data.data
                  shipDataList.forEach((shipData) => {
                    var pointFeature = new Feature({
                      geometry: new Point([Number(shipData.longitude), Number(shipData.latitude)]),
                      name: shipData.imoNumber,
                      layer: 'shipLayer',
                      course: shipData.course
                    })
                    pointFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857')

                    if (imoNumber === shipData.imoNumber) {
                      this.shipLayer = new VectorLayer({
                        name: 'shipLayer',
                        id: shipData.imoNumber,
                        source: new VectorSource({
                          features: [pointFeature]
                        }),
                        style: new Style({
                          image: new Icon({
                            src: selectShipIcon,
                            // scale: 0.2,
                            // anchor: [0.5, 0.5],
                            rotateWithView: true,
                            // rotation: (-90 + shipData.course) * Math.PI/180
                            rotation: (shipData.course * Math.PI) / 180             // [20240708 Eugene] 관리선박 심볼 각도
                          })
                        }),
                        zIndex: 999
                      })
                      // APPEND_240618
                      // if (ship[0] != null)
                      {
                        OwnshipLat = shipData.latitude
                        OwnshipLon = shipData.longitude
                        OwnshipCrs = shipData.course
                        OwnshipSpeed = shipData.speed
                      }
                      this.aisData()

                      if (sv === false) {
                        map
                          .getView()
                          .setCenter(fromLonLat([Number(shipData.longitude), Number(shipData.latitude)]))
                      }
                      sv = false;

                    }
                    else {
                      this.shipLayer = new VectorLayer({
                        name: 'shipLayer',
                        id: shipData.imoNumber,
                        source: new VectorSource({
                          features: [pointFeature]
                        }),
                        style: new Style({
                          image: new Icon({
                            src: shipIcon,
                            // scale: 0.2,
                            // anchor: [0.5, 0.5],
                            rotateWithView: true,
                            // rotation: (-90 + shipData.course) * Math.PI/180
                            rotation: (shipData.course * Math.PI) / 180             // [20240708 Eugene] 관리선박 심볼 각도
                          })
                        }),
                        zIndex: 999
                      })
                    }
                    map.addLayer(this.shipLayer)
                  })
                }
              })

          }
        })

      }


      if (this.propsdata == null) return
      if (this.propsdata.length === 0) return
      // else if (this.propsdata.length !== 0) {
      //   this.propsdata.map((shipData) => {
      //     if (shipData.imoNumber === imoNumber) {
      //       if (imoNumber.length != 0)
      //         getShipData(imoNumber).then((response) => {
      //           sv = true;
      //           if (response.data.data === null) return
      //           var ship = response.data.data
      //           // APPEND_240618 : test. 임시 관리선박 위치는 부산과 마라도 사이. 배포 시에는 comment 처리할 것.
      //           // ship[0].latitude = 34.85;
      //           // ship[0].longitude = 129.27;
      //           map
      //             .getView()
      //           // .setCenter(fromLonLat([Number(ship[0].longitude), Number(ship[0].latitude)]))
      //           // map.getView().setZoom(4)

      //           // APPEND_240618
      //           if (ship[0] != null) {
      //             OwnshipLat = ship[0].latitude
      //             OwnshipLon = ship[0].longitude
      //             OwnshipCrs = ship[0].course
      //             OwnshipSpeed = ship[0].speed
      //           }
      //           this.aisData()
      //         })
      //     }
      //   })
      // }
    },
    isShow: function() {
      // if (this.isShow === false) {
      //   this.setShipLayer();
      //   this.shipSelectEvent();
      // } else {
      //   map.removeInteraction(this.selectInteraction);
      // }
    },
    // selWeather: function() {
    //   console.log(this.selWeather.value);
    //   if (this.tempAir) {
    //     console.log("tempAir");
    //   }
    // },
    isRouteShow: function () {
      if (this.isRouteShow === false) {
        this.setShipLayer()
      }
    },
    vesselTrack: function() {
      vessels = this.vesselTrack

      // vesselTrackStatus.value = vessels;
    },
    startDate: function() {
    },
    endDate: function() {
    },
    isCurrentTrack: function() {
      if (vessels)
      if (this.isCurrentTrack) {
        map
          .getLayers()
          .getArray()
          .filter((layer) => layer.get('name') === 'shipWakeLayer')
          .forEach((layer) => map.removeLayer(layer))
        map
          .getLayers()
          .getArray()
          .filter((layer) => layer.get('name') === 'shipPastWakeLayer')
          .forEach((layer) => map.removeLayer(layer))
          const mapStore2 = useMapStore()
          const { vesselTrackStatus2 } = storeToRefs(mapStore2)
          vesselTrackStatus2.value=true
        this.vesselTrackCurrent()
      }
      //  else {
      //   map
      //     .getLayers()
      //     .getArray()
      //     .filter((layer) => layer.get('name') === 'shipWakeLayer')
      //     .forEach((layer) => map.removeLayer(layer))
      //   map
      //     .getLayers()
      //     .getArray()
      //     .filter((layer) => layer.get('name') === 'shipPastWakeLayer')
      //     .forEach((layer) => map.removeLayer(layer))
          
      //   }
    },
    isPastVesselTracks: function() {
      // this.vesselTrackPast();
    },
    isPastTrack: function () {
      if (vessels)
      if (this.isPastTrack) {
        map
          .getLayers()
          .getArray()
          .filter((layer) => layer.get('name') === 'shipWakeLayer')
          .forEach((layer) => map.removeLayer(layer))
        map
          .getLayers()
          .getArray()
          .filter((layer) => layer.get('name') === 'shipPastWakeLayer')
          .forEach((layer) => map.removeLayer(layer))
          const mapStore2 = useMapStore()
          const { vesselTrackStatus2 } = storeToRefs(mapStore2)
          vesselTrackStatus2.value=false
          this.vesselTrackPast()
      }
      
    },
    isRemoveTrack: function () {
      if (this.isRemoveTrack === true) {
        map
          .getLayers()
          .getArray()
          .filter((layer) => layer.get('name') === 'shipWakeLayer')
          .forEach((layer) => map.removeLayer(layer))
        map
          .getLayers()
          .getArray()
          .filter((layer) => layer.get('name') === 'shipPastWakeLayer')
          .forEach((layer) => map.removeLayer(layer))
        const mapStore = useMapStore()
        const { isRemoveTrack } = storeToRefs(mapStore)
        isRemoveTrack.value = false
        // vessels = false;
      }
    },
    layerMode: function () {
      this.setMapType(this.layerBright, this.layerMode)
    },
    layerBright: function () {
      this.setMapType(this.layerBright, this.layerMode)
    },
    isSelect: function () {
      // var temp
      // if (this.imoNumbers.length !== 0) {
      //   this.imoNumbers.forEach((imoNumber) => {
      //     if (temp !== undefined) temp = temp + ',' + imoNumber
      //     else temp = imoNumber
      //   })
      //   this.shipData(temp)
      // }

      // if (this.isSelect === true) {
      //   this.setShipLayer()
      //   this.shipSelectEvent()F
      // } else {
      //   map.removeInteraction(this.selectInteraction)
      // }
    }
  },
  mounted: async function () {
    // 기상정보 API URL 설정
    baseUrl = import.meta.env.VITE_WEATHER_API_URL
    geoserverWmsUrl = import.meta.env.VITE_GEOSERVER_WMS_URL;

    this.initMap()
    this.setMapType(this.layerBright, this.layerMode)
    this.$emit('init', map)

    // 오픈레이어스 좌우영역 제한
    map.on('moveend', function () {
      let view = map.getView() // 지도의 뷰
      // 지도의 크기를 가져옴
      let mapSize = map.getSize()

      // 화면의 왼쪽 중앙 좌표를 계산
      let leftCoordinate = map.getCoordinateFromPixel([0, 0]) // 좌측 좌표
      let rightPixel = mapSize[0] // 우측 좌표(x)
      let rightCoordinate = map.getCoordinateFromPixel([rightPixel, mapSize[1]]) // 화면 좌표를 지도 좌표로 변환
      // 화면상의 중심 좌표
      var currentCenter = view.getCenter()

      // 화면상의 중심 좌표와 왼쪽 좌표의 차이 계산
      var dx = currentCenter[0] - leftCoordinate[0]

      let lonLeft = transform([leftCoordinate[0], 0], 'EPSG:3857', 'EPSG:4326')[0]
      let lonRight = transform([rightCoordinate[0], 0], 'EPSG:3857', 'EPSG:4326')[0]

      // 경도 제한
      let newCenter
      if (lonLeft < -180 || lonRight > 540) {
        if (lonLeft < -180) {
          lonLeft = 360 + (lonLeft % 360)
          newCenter = transform([lonLeft, 0], 'EPSG:4326', 'EPSG:3857')
          newCenter = [newCenter[0] + dx, currentCenter[1]]
        } else {
          lonRight = lonRight % 360

          newCenter = transform([lonRight, 0], 'EPSG:4326', 'EPSG:3857')
          newCenter = [newCenter[0] - dx, currentCenter[1]]
        }

        view.setCenter(newCenter) // 변경된 경도로 지도 중심 재설정
      }



    })

    this.shipSelectEvent()
    this.shipData()
    vessels = this.vesselTrack
    // this.vesselTrackCurrent()
    // this.vesselTrackPast()


    //
    // const mapStore2 = useMapStore()
    // const { isCurrentTrack, isPastTrack } = storeToRefs(mapStore2)
    // isCurrentTrack.value = false;
    // isPastTrack.value = false;
    

    // ais 정보 시각화
    this.interval = setInterval(this.aisData, ONE_MINUTES_TO_SECONDS)

    this.setRouteLayer()

    // 기상정보 웹팩 관련 라이브러리 추가
    const bundleScript = document.createElement('script')
    bundleScript.src = '/js/common/bundle.js'
    document.body.appendChild(bundleScript)

    emitter.on('draw_route_d2', () => {
      this.drawRoute()
    })

    emitter.on('draw_route_d4', () => {
      this.drawRoute4()
    })

    emitter.on('route_Interaction2', () => {
      this.routeInteraction()
    })

    const mapStore2 = useMapStore()
      const { vesselTrackStatus, vesselTrackStatus2 } = storeToRefs(mapStore2)
      if (vesselTrackStatus.value === true)
      if (vesselTrackStatus2.value === true)
      this.vesselTrackCurrent();
      else this.vesselTrackPast();
      


  },
  unmounted() {
    clearInterval(this.interval)
  },
  methods: {
    initMap: function () {
      const view = new View({
        center: fromLonLat([128.1, 36.0]),
        maxZoom: 12,
        zoom: 4,
        maxResolution: 21600,
        extent:[-120037508, -9997197, 120037508, 9997197 ]
      });
      map = new Map({
        target: 'mapContainer',
        view: view,
        controls: defaultControls({
          attribution: false,
          zoom: false,
          rotate: false
        })
      })
      return map
    },
    shipDataTwo: function () {
      return;
    },
    setMapType: function (mapBright, mapMode) {
      if (mapBright !== 'Black') {
        map.getLayers().clear()
        map.addLayer(
          new TileLayer({
            source: new XYZ({
              url: urlBefore + mapBright + '_' + mapMode + urlAfter
            }),
            name: mapBright + '_' + mapMode,
            visible: true
          })
        )
      } else if (mapBright === 'Black') {
        map.getLayers().clear()
        map.addLayer(
          new TileLayer({
            id: 'ocean',
            title: 'ocean',
            opacity: 1,
            zIndex: -1,
            source: new TileWMS({
              url: geoserverWmsUrl,
              serverType: 'geoserver',
              crossOrigin: 'anonymous',
              params: {
                VERSION: '1.1.0',
                LAYERS: 'emap:ocean',
                CRS: 'EPSG:3857'
                //'CRS' : 'EPSG:404000',
              }
            })
          })
        )
        this.makeSld('ocean', 'Polygon1_1', '17284F', null)
        map.addLayer(
          new TileLayer({
            id: 'worldcountries',
            title: 'worldcountries',
            opacity: 1,
            zIndex: 100,
            source: new TileWMS({
              url: geoserverWmsUrl,
              serverType: 'geoserver',
              crossOrigin: 'anonymous',
              params: {
                VERSION: '1.1.0',
                LAYERS: 'emap:worldcountries',
                CRS: 'EPSG:3857'
              }
            })
          })
        )
        this.makeSld('worldcountries', 'Polygon1_2', '1E1E1E', null)
      }
      this.setShipLayer()
      this.aisData()
    },
    setShipLayer: function () {

      map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipLayer')
        .forEach((layer) => map.removeLayer(layer))
      map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipWakeLayer')
        .forEach((layer) => map.removeLayer(layer))
      map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipPastWakeLayer')
        .forEach((layer) => map.removeLayer(layer))

      var temp
      var shipdataList = this.propsdata
      if (shipdataList != null)
        shipdataList.map((shipData) => {
          if(this.imoNumbers.indexOf(shipData.imoNumber) === -1) 
          this.imoNumbers.push(shipData.imoNumber)
        })
      if (this.imoNumbers.length !== 0) {
        temp = "";
        this.imoNumbers.forEach((imoNumber) => {
          if (temp !== undefined) temp = temp + ',' + imoNumber
          else temp = imoNumber
        })
        this.imoNums = temp;
        this.shipData(temp)
      }
    },
    shipSelectEvent: function () {
      const shipStore = useShipStore()
      const { curSelectedShip } = storeToRefs(shipStore)
      const { isSelect } = storeToRefs(useMapStore())

      // isSelect.value = false
      this.selectInteraction = new Select({
        condition: singleClick,
        layers: function (layer) {
          //shipData(this.imoNums)
          return layer.get('name') === 'shipLayer'
        }
      })/*.style(
              new Style({
               image: new Icon({
                 // scale: 0.2,
                 // anchor: [0.5, 0.5],
                 rotateWithView: true,
                 // rotation: e.selected[0].values_.course
                 rotation: (e.selected[0].values_.course * Math.PI) / 180
               })
      }))*//*.getLayers().forEach()
      {]
        if(layer.get('name') === 'shipLayer')
        this.curImoNumber = layer.values_.name
      }*/

      map.addInteraction(this.selectInteraction)
      //this.shipData(this.curImoNumber)
      this.selectInteraction.on('select', (e) => {
        if (e.selected[0] === undefined) return
        if (e.selected[0].values_.layer === 'shipLayer') {
          e.selected[0].setStyle(new Style(null));
          // e.selected[0].setStyle(
          //   new Style({
          //     image: new Icon({
          //       src: shipIcon,
          //       // scale: 0.2,
          //       // anchor: [0.5, 0.5],
          //       rotateWithView: true,
          //       // rotation: e.selected[0].values_.course
          //       rotation: (e.selected[0].values_.course * Math.PI) / 180
          //     })
          //   })
          // )
          let selectedShipImoNumber = e.selected[0].values_.name
          this.curImoNumber = selectedShipImoNumber
          //this.shipData(this.curImoNumber)
          if (selectedShipImoNumber) {
            map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipWakeLayer')
        .forEach((layer) => map.removeLayer(layer))
      map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipPastWakeLayer')
        .forEach((layer) => map.removeLayer(layer))

            getShipInfo(selectedShipImoNumber).then((response) => {
              const {
                status,
                data: { data }
              } = response
              if (isStatusOk(status)) {
                // emitter.emit('clickShipName', selectedShipImoNumber)
                curSelectedShip.value = { ...data }
                isSelect.value = true


                if (this.imoNums != null)
                if (this.imoNums.length != 0) {
                  map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipWakeLayer')
        .forEach((layer) => map.removeLayer(layer))
      map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipPastWakeLayer')
        .forEach((layer) => map.removeLayer(layer))

                  getShipData(this.imoNums).then((response) => {
                    sv = true;
                    const { status, data } = response
                    if (isStatusOk(status)) {
                      if (vessels == true) {
                        // this.vesselTrackCurrent();
                      }
                      map
                        .getLayers()
                        .getArray()
                        .filter((layer) => layer.get('name') === 'shipLayer')
                        .forEach((layer) => map.removeLayer(layer))

                      var shipDataList = data.data
                      shipDataList.forEach((shipData) => {
                        var pointFeature = new Feature({
                          geometry: new Point([Number(shipData.longitude), Number(shipData.latitude)]),
                          name: shipData.imoNumber,
                          layer: 'shipLayer',
                          course: shipData.course
                        })
                        pointFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857')

                        if (this.curImoNumber === shipData.imoNumber) {
                          this.shipLayer = new VectorLayer({
                            name: 'shipLayer',
                            id: shipData.imoNumber,
                            source: new VectorSource({
                              features: [pointFeature]
                            }),
                            style: new Style({
                              image: new Icon({
                                src: selectShipIcon,
                                // scale: 0.2,
                                // anchor: [0.5, 0.5],
                                rotateWithView: true,
                                // rotation: (-90 + shipData.course) * Math.PI/180
                                rotation: (shipData.course * Math.PI) / 180             // [20240708 Eugene] 관리선박 심볼 각도
                              })
                            }),
                            zIndex: 999
                          })
                          
                          // APPEND_240618
                          // if (ship[0] != null)
                          {
                            OwnshipLat = shipData.latitude
                            OwnshipLon = shipData.longitude
                            OwnshipCrs = shipData.course
                            OwnshipSpeed = shipData.speed
                          }
                          this.aisData()

                        }
                        else {
                          this.shipLayer = new VectorLayer({
                            name: 'shipLayer',
                            id: shipData.imoNumber,
                            source: new VectorSource({
                              features: [pointFeature]
                            }),
                            style: new Style({
                              image: new Icon({
                                src: shipIcon,
                                // scale: 0.2,
                                // anchor: [0.5, 0.5],
                                rotateWithView: true,
                                // rotation: (-90 + shipData.course) * Math.PI/180
                                rotation: (shipData.course * Math.PI) / 180             // [20240708 Eugene] 관리선박 심볼 각도
                              })
                            }),
                            zIndex: 999
                          })
                        }
                        map.addLayer(this.shipLayer)
                      })
                    }
                  })
                }
              }
            })

          }

          // shipDataTwo.value = this.curImoNumber

          // if (isSelect) {
          //   map.removeLayer(e.selected[0]);
          //   getShipData(selectedShipImoNumber).then((response) => {
          //     const { status, data } = response
          //     if (isStatusOk(status)) {
          //       var shipDataList = data.data
          //       shipDataList.forEach((shipData) => {
          //         var shipIcon_yellowLayer_png = '/images/shipicons/shipIcon_yellow.png'
          //         if (shipData.imoNumber == this.curImoNumber) {
          //         map.removeLayer(this.shipIcon_yellowLayer)
          //         var pointFeature = new Feature({
          //           geometry: new Point([Number(shipData.longitude), Number(shipData.latitude)]),
          //           name: shipData.imoNumber,
          //           layer: 'shipLayer',
          //           course: shipData.course
          //         })
          //         pointFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857')

          //         this.shipIcon_yellowLayer = new VectorLayer({
          //           name: 'shipIcon_yellowLayer_png',
          //           id: shipData.imoNumber,
          //           source: new VectorSource({
          //             features: [pointFeature]
          //           }),
          //           style: new Style({
          //             image: new Icon({
          //               src: shipIcon_yellowLayer_png,
          //               // scale: 0.2,
          //               // anchor: [0.5, 0.5],
          //               rotateWithView: true,
          //               // rotation: (-90 + shipData.course) * Math.PI/180
          //               rotation: (shipData.course * Math.PI) / 180             // [20240708 Eugene] 관리선박 심볼 각도
          //             })
          //           }),
          //           zIndex: 9999
          //         })
          //         map.addLayer(this.shipIcon_yellowLayer)
          //     }})
          //     }})
          //   }

          //this.shipDataTwo();

        }
        // // else {
        //   e.selected[0].setStyle(new Style({
        //     image: new Icon({
        //       src: shipIcon,
        //       // scale: 0.2,
        //       // anchor: [0.5, 0.5],
        //       rotateWithView: true,
        //       // rotation: e.selected[0].values_.course
        //       rotation: e.selected[0].values_.course * Math.PI / 180
        //     })
        //   }));
        // }
        // map.removeInteraction(this.selectInteraction)
      }
      )
      
      if (this.imoNums != null)
      if (isSelect) {
        this.curImoNumber = this.curSelectedShip.imoNumber
        this.shipData(this.imoNums)
      }







    },
    makeSld: function (lynm, type, color1, color2) {
      var text_SLD =
        "\
					<?xml version='1.0' encoding='UTF-8'?>\
					<StyledLayerDescriptor version='1.0.0' \
					 xsi:schemaLocation='http://www.opengis.net/sld StyledLayerDescriptor.xsd' \
					 xmlns='http://www.opengis.net/sld' \
					 xmlns:ogc='http://www.opengis.net/ogc' \
					 xmlns:xlink='http://www.w3.org/1999/xlink' \
					 xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>\
					  <NamedLayer>\
					    <Name>emap:" +
        lynm +
        "</Name>\
					    <UserStyle>\
					      <Title>Default Polygon</Title>\
					      <Abstract>A sample style that draws a polygon</Abstract>\
					      <FeatureTypeStyle>\
					        <Rule>\
					"

      if (type == 'Polygon1') {
        text_SLD +=
          "\
					          <PolygonSymbolizer>\
            					<Fill>\
					              <CssParameter name='fill'>#" +
          color1 +
          "</CssParameter>\
					            </Fill>\
					          </PolygonSymbolizer>\
					"
      } else if (type == 'Polygon1_1') {
        // 경도 경계에 흰색 선 생기는 것 방지 : 테두리를 최소화하고 색상 동일화
        text_SLD +=
          "\
					          <PolygonSymbolizer>\
            					<Fill>\
					              <CssParameter name='fill'>#" +
          color1 +
          "</CssParameter>\
					            </Fill>\
					            <Stroke>\
					              <CssParameter name='stroke'>#" +
          color1 +
          "</CssParameter>\
					              <CssParameter name='stroke-width'>1</CssParameter>\
					            </Stroke>\
					            \
					          </PolygonSymbolizer>\
					"
      } else if (type == 'Polygon1_2') {
        // 경도 경계에 흰색 선 생기는 것 방지 : 테두리를 최소화하고 색상 동일화
        text_SLD +=
          "\
					          <PolygonSymbolizer>\
            					<Fill>\
					              <CssParameter name='fill'>#" +
          color1 +
          "</CssParameter>\
					            </Fill>\
					            <Stroke>\
					              <CssParameter name='stroke'>#6689CA</CssParameter>\
					              <CssParameter name='stroke-width'>1</CssParameter>\
					            </Stroke>\
					          </PolygonSymbolizer>\
					"
      } else if (type == 'Polygon2') {
        text_SLD +=
          "\
					          <PolygonSymbolizer>\
					            <Fill>\
					              <CssParameter name='fill'>#" +
          color1 +
          "</CssParameter>\
					            </Fill>\
					            <Stroke>\
					              <CssParameter name='stroke'>#" +
          color1 +
          "</CssParameter>\
					              <CssParameter name='stroke-width'>0</CssParameter>\
					            </Stroke>\
					          </PolygonSymbolizer>\
					        </Rule>\
							<Rule>\
					          <Title>0to20</Title>\
					          <ogc:Filter>\
					            <ogc:And>\
					              <ogc:PropertyIsGreaterThanOrEqualTo>\
					                <ogc:PropertyName>DRVAL1</ogc:PropertyName>\
					                <ogc:Literal>0</ogc:Literal>\
					              </ogc:PropertyIsGreaterThanOrEqualTo>\
					              <ogc:PropertyIsLessThan>\
					                <ogc:PropertyName>DRVAL1</ogc:PropertyName>\
					                <ogc:Literal>20</ogc:Literal>\
					              </ogc:PropertyIsLessThan>\
					            </ogc:And>\
					          </ogc:Filter>\
					          <PolygonSymbolizer>\
					            <Fill>\
					              <CssParameter name='fill'>#" +
          color1 +
          "</CssParameter>\
					            </Fill>\
					            <Stroke>\
					              <CssParameter name='stroke'>#" +
          color1 +
          "</CssParameter>\
					              <CssParameter name='stroke-width'>1</CssParameter>\
					            </Stroke>\
					          </PolygonSymbolizer>\
					        </Rule>\
					        <Rule>\
					          <Title>20to100</Title>\
					          <ogc:Filter>\
					            <ogc:And>\
					              <ogc:PropertyIsGreaterThanOrEqualTo>\
					                <ogc:PropertyName>DRVAL1</ogc:PropertyName>\
					                <ogc:Literal>20</ogc:Literal>\
					              </ogc:PropertyIsGreaterThanOrEqualTo>\
					              <ogc:PropertyIsLessThan>\
					                <ogc:PropertyName>DRVAL1</ogc:PropertyName>\
					                <ogc:Literal>100</ogc:Literal>\
					              </ogc:PropertyIsLessThan>\
					            </ogc:And>\
					          </ogc:Filter>\
					          <PolygonSymbolizer>\
					            <Fill>\
					              <CssParameter name='fill'>#" +
          color2 +
          "</CssParameter>\
					            </Fill>\
					            <Stroke>\
					              <CssParameter name='stroke'>#" +
          color2 +
          "</CssParameter>\
					              <CssParameter name='stroke-width'>1</CssParameter>\
					            </Stroke>\
					          </PolygonSymbolizer>\
					        </Rule>\
					        <Rule>\
					          <Title>100great</Title>\
					          <ogc:Filter>\
					              <ogc:PropertyIsGreaterThanOrEqualTo>\
					                <ogc:PropertyName>DRVAL1</ogc:PropertyName>\
					                <ogc:Literal>100</ogc:Literal>\
					              </ogc:PropertyIsGreaterThanOrEqualTo>\
					          </ogc:Filter>\
					          <PolygonSymbolizer>\
					            <Fill>\
					              <CssParameter name='fill'>#" +
          color2 +
          "</CssParameter>\
					            </Fill>\
					            <Stroke>\
					              <CssParameter name='stroke'>#" +
          color2 +
          "</CssParameter>\
					              <CssParameter name='stroke-width'>1</CssParameter>\
					            </Stroke>\
					          </PolygonSymbolizer>\
					"
      }

      text_SLD +=
        "\
				        </Rule>\
				      </FeatureTypeStyle>\
				    </UserStyle>\
				  </NamedLayer>\
				</StyledLayerDescriptor>\
				"

      var source = this.getLayer(lynm).getSource();
      //var source = getLayerGroup(lynm).getSource();
      source.updateParams({ STYLES: '', SLD_BODY: text_SLD })
    },
    makeSldTemp: function(lynm, radius) {
      var text_SLD = "\
        <?xml version='1.0' encoding='ISO-8859-1'?>\
        <StyledLayerDescriptor version='1.0.0'\
					xsi:schemaLocation='http://www.opengis.net/sld StyledLayerDescriptor.xsd'\
					xmlns='http://www.opengis.net/sld' \
					xmlns:ogc='http://www.opengis.net/ogc'\
					xmlns:xlink='http://www.w3.org/1999/xlink'\
					xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>\
         <NamedLayer>\
          <Name>emap:" + lynm + "</Name>\
          <UserStyle>\
            <Title>Heatmap</Title>\
            <Abstract>A heatmap surface showing population density</Abstract>\
            <FeatureTypeStyle>\
              <Transformation>\
                <ogc:Function name='vec:Heatmap'>\
                  <ogc:Function name='parameter'>\
                    <ogc:Literal>data</ogc:Literal>\
                  </ogc:Function>\
                  <ogc:Function name='parameter'>\
                    <ogc:Literal>weightAttr</ogc:Literal>\
                    <ogc:Literal>temp</ogc:Literal>\
                  </ogc:Function>\
                  <ogc:Function name='parameter'>\
                    <ogc:Literal>radiusPixels</ogc:Literal>\
                    <ogc:Function name='env'>\
                      <ogc:Literal>radius</ogc:Literal>\
                      <ogc:Literal>" + radius + "</ogc:Literal>\
                    </ogc:Function>\
                  </ogc:Function>\
                  <ogc:Function name='parameter'>\
                    <ogc:Literal>pixelsPerCell</ogc:Literal>\
                    <ogc:Literal>20</ogc:Literal>\
                  </ogc:Function>\
                  <ogc:Function name='parameter'>\
                    <ogc:Literal>outputBBOX</ogc:Literal>\
                    <ogc:Function name='env'>\
                      <ogc:Literal>wms_bbox</ogc:Literal>\
                    </ogc:Function>\
                  </ogc:Function>\
                  <ogc:Function name='parameter'>\
                    <ogc:Literal>outputWidth</ogc:Literal>\
                    <ogc:Function name='env'>\
                      <ogc:Literal>wms_width</ogc:Literal>\
                    </ogc:Function>\
                  </ogc:Function>\
                  <ogc:Function name='parameter'>\
                    <ogc:Literal>outputHeight</ogc:Literal>\
                    <ogc:Function name='env'>\
                      <ogc:Literal>wms_height</ogc:Literal>\
                    </ogc:Function>\
                  </ogc:Function>\
                </ogc:Function>\
              </Transformation>\
              <Rule>\
                <RasterSymbolizer>\
                  <Geometry>\
                    <ogc:PropertyName>the_geom</ogc:PropertyName></Geometry>\
                  <Opacity>0.3</Opacity>\
                  <ColorMap type='ramp'>\
                    <ColorMapEntry color='#bbebf4' quantity='0'/>\
                    <ColorMapEntry color='#9fefb7' quantity='0.33'/>\
                    <ColorMapEntry color='#e4ef97' quantity='0.66'/>\
                    <ColorMapEntry color='#ec6767' quantity='1'/>\
                  </ColorMap>\
                </RasterSymbolizer>\
              </Rule>\
            </FeatureTypeStyle>\
          </UserStyle>\
        </NamedLayer>\
        </StyledLayerDescriptor>\
				"

      var source = this.getLayer(lynm).getSource();
      source.updateParams({ 'STYLES': '', 'SLD_BODY': text_SLD });
    },
    getLayer: function (id) {
      let lyr = null
      var layers = map.getLayers().getArray()
      for (let i in layers) {
        const l = layers[i]
        const thisLayerId = layers[i].get('id')

        if (id === thisLayerId) {
          lyr = l
          break
        }
      }
      return lyr
    },
    shipData: async function (imoNumbers) {
      var shipdataList = this.propsdata
      if (shipdataList != null)
        if (imoNumbers != null)
          if (imoNumbers.length != 0) {

            map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipWakeLayer')
        .forEach((layer) => map.removeLayer(layer))
      map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipPastWakeLayer')
        .forEach((layer) => map.removeLayer(layer))
            getShipData(imoNumbers).then((response) => {
              const { status, data } = response
              if (isStatusOk(status)) {
                map
                    .getLayers()
                    .getArray()
                    .filter((layer) => layer.get('name') === 'shipLayer')
                    .forEach((layer) => map.removeLayer(layer))

                var shipDataList = data.data
                shipDataList.forEach((shipData) => {
                  var pointFeature = new Feature({
                    geometry: new Point([Number(shipData.longitude), Number(shipData.latitude)]),
                    name: shipData.imoNumber,
                    layer: 'shipLayer',
                    course: shipData.course
                  })
                  pointFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857')

                  if (this.curImoNumber === shipData.imoNumber) {
                    this.shipLayer = new VectorLayer({
                      name: 'shipLayer',
                      id: shipData.imoNumber,
                      source: new VectorSource({
                        features: [pointFeature]
                      }),
                      style: new Style({
                        image: new Icon({
                          src: selectShipIcon,
                          // scale: 0.2,
                          // anchor: [0.5, 0.5],
                          rotateWithView: true,
                          // rotation: (-90 + shipData.course) * Math.PI/180
                          rotation: (shipData.course * Math.PI) / 180             // [20240708 Eugene] 관리선박 심볼 각도
                        })
                      }),
                      zIndex: 999
                    })

                                // APPEND_240618
                    // if (ship[0] != null)
                    {
                      OwnshipLat = shipData.latitude
                      OwnshipLon = shipData.longitude
                      OwnshipCrs = shipData.course
                      OwnshipSpeed = shipData.speed
                    }
                    this.aisData()

                  }
                  else {
                    this.shipLayer = new VectorLayer({
                      name: 'shipLayer',
                      id: shipData.imoNumber,
                      source: new VectorSource({
                        features: [pointFeature]
                      }),
                      style: new Style({
                        image: new Icon({
                          src: shipIcon,
                          // scale: 0.2,
                          // anchor: [0.5, 0.5],
                          rotateWithView: true,
                          // rotation: (-90 + shipData.course) * Math.PI/180
                          rotation: (shipData.course * Math.PI) / 180             // [20240708 Eugene] 관리선박 심볼 각도
                        })
                      }),
                      zIndex: 999
                    })
                  }
                  map.addLayer(this.shipLayer)
                })
              }
            })
          }
    },
    removeTrack: function () {
      if (this.isRemoveTrack === true) {
        map
          .getLayers()
          .getArray()
          .filter((layer) => layer.get('name') === 'shipWakeLayer')
          .forEach((layer) => map.removeLayer(layer))
        map
          .getLayers()
          .getArray()
          .filter((layer) => layer.get('name') === 'shipPastWakeLayer')
          .forEach((layer) => map.removeLayer(layer))
        const mapStore = useMapStore()
        const { isRemoveTrack } = storeToRefs(mapStore)
        isRemoveTrack.value = false
        // vessels = false;
      }
    },
    vesselTrackCurrent: function () {
      const mapStore = useMapStore()
      const { clickedShipInfo } = storeToRefs(mapStore)
      // vessels = true

      map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipWakeLayer')
        .forEach((layer) => map.removeLayer(layer))
      map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipPastWakeLayer')
        .forEach((layer) => map.removeLayer(layer))
      getShipWakeCurrent(clickedShipInfo.value.imoNumber).then((response) => {
        var shipWakeList = response.data.data
        if (response.data.data === null) return

          const storeToRefs2 = storeToRefs(useMapStore())
          let clickedShipInfo2 = storeToRefs2.clickedShipInfo.value.imoNumber
          if (clickedShipInfo2 !== clickedShipInfo.value.imoNumber) return;

          map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipWakeLayer')
        .forEach((layer) => map.removeLayer(layer))
      map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipPastWakeLayer')
        .forEach((layer) => map.removeLayer(layer))

        var currentPointFeatures = []

        shipWakeList.forEach((shipData) => {
          if (isNaN(Number(shipData.longitude)) || isNaN(Number(shipData.latitude))) return
          var pointFeature = new Feature({
            geometry: new Point([Number(shipData.longitude), Number(shipData.latitude)]),
            name: shipData.imoNumber,
            text: shipData.time
          })
          currentPointFeatures.push(pointFeature)
        })

        currentPointFeatures.map((pointFeature, index) => {
          if (index === 0) return
          if (currentPointFeatures[index] === null) return
          var lineFeature = new Feature({
            geometry: new LineString([
              currentPointFeatures[index - 1].getGeometry().getCoordinates(),
              currentPointFeatures[index].getGeometry().getCoordinates()
            ]),
            id: shipWakeList[index].time
          })
          lineFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857')
          var point = new Feature({
            geometry: new Point([
              Number(currentPointFeatures[index].longitude),
              Number(currentPointFeatures[index].latitude)
            ]),
            name: shipWakeList[index].imoNumber,
            label: shipWakeList[index].time
          })
          point.getGeometry().transform('EPSG:4326', 'EPSG:3857')

          this.shipWakeLayer = new VectorLayer({
            name: 'shipWakeLayer',
            source: new VectorSource({
              features: [lineFeature]
            }),
            style: this.styleCurrent,
            zIndex: 200
          })
          map.addLayer(this.shipWakeLayer)

          
        })
      })
      const { isCurrentTrack, isPastTrack } = storeToRefs(mapStore)
      isCurrentTrack.value = false;
      isPastTrack.value = false;
    },
    styleCurrent: function (feature, resolution) {
      const geometry = feature.getGeometry()
      const styles = [
        // linestring
        new Style({
          stroke: new Stroke({
            color: '#ddae34',
            width: 4
          })
        })
      ]

      if (resolution < 20) {
        geometry.forEachSegment(function (start, end) {
          const dx = end[0] - start[0]
          const dy = end[1] - start[1]
          const dx_2 = (start[0] + end[0]) / 2
          const dy_2 = (start[1] + end[1]) / 2
          const rotation = Math.atan2(dy, dx)

          const center = [dx_2, dy_2]

          styles.push(
            new Style({
              geometry: new Point(center),
              image: new Icon({
                src: arrowIcon,
                anchor: [0.5, 0.5],
                rotateWithView: true,
                rotation: -rotation
              }),
              zIndex: 500
            })
          )
          styles.push(
            new Style({
              geometry: new Point(end),
              // image: new CircleStyle({
              //   radius: 3,
              //   fill: new Fill({color: '#ddae34'}),
              //   stroke: new Stroke({color: 'white', width: 2}),
              // }),
              text: new Text({
                text: feature.values_.id,
                offsetX: 80,
                offsetY: 20,
                fill: new Fill({ color: 'black' }),
                stroke: new Stroke({ color: 'white', width: 2 }),
                font: 'bold 10px sans-serif'
              }),
              zIndex: 500
            })
          )
        })
      }
      return styles
    },
    vesselTrackPast: function () {
      const mapStore = useMapStore()
      // const { clickedShipInfo, startDate, endDate, isPastTrack, isCurrentTrack } = storeToRefs(mapStore)
      const { clickedShipInfo, startDate, endDate, startDate2, endDate2, isPastTrack, isCurrentTrack } = storeToRefs(mapStore)

      // let utcstartDate = convertUTCTimezone(startDate._value);
      // let utcendDate = convertUTCTimezone(endDate._value);

      let utcstartDate = startDate2._value;
      let utcendDate = endDate2._value;
      
      getShipWakePast(clickedShipInfo.value.imoNumber, utcstartDate, utcendDate).then(
        (response) => {
          var shipWaskPastList = response.data.data
          if (response.data.data === null) return

          const storeToRefs2 = storeToRefs(useMapStore())
          let clickedShipInfo2 = storeToRefs2.clickedShipInfo.value.imoNumber
          if (clickedShipInfo2 !== clickedShipInfo.value.imoNumber) return;

          map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipWakeLayer')
        .forEach((layer) => map.removeLayer(layer))
      map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipPastWakeLayer')
        .forEach((layer) => map.removeLayer(layer))

          var pointFeatures = []
          shipWaskPastList.forEach((shipData) => {
            if (isNaN(Number(shipData.longitude)) || isNaN(Number(shipData.latitude))) return
            var pointFeature = new Feature({
              geometry: new Point([Number(shipData.longitude), Number(shipData.latitude)]),
              name: shipData.imoNumber,
              text: shipData.time
            })
            pointFeatures.push(pointFeature)
          })

          pointFeatures.map((pointFeature, index) => {
            if (index === 0) return
            if (pointFeatures[index] === null) return
            var lineFeature = new Feature({
              geometry: new LineString([
                pointFeatures[index - 1].getGeometry().getCoordinates(),
                pointFeatures[index].getGeometry().getCoordinates()
              ]),
              id: shipWaskPastList[index].time
            })
            lineFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857')
            var point = new Feature({
              geometry: new Point([
                Number(pointFeatures[index].longitude),
                Number(pointFeatures[index].latitude)
              ]),
              name: shipWaskPastList[index].imoNumber,
              label: shipWaskPastList[index].time
            })
            point.getGeometry().transform('EPSG:4326', 'EPSG:3857')

            this.shipPastWakeLayer = new VectorLayer({
              name: 'shipPastWakeLayer',
              source: new VectorSource({
                features: [lineFeature]
              }),
              style: this.stylePast,
              zIndex: 300
            })

            map.addLayer(this.shipPastWakeLayer)

          })
        }
      )
      isPastTrack.value = false;
      isCurrentTrack.value = false;

    },
    stylePast: function (feature, resolution) {
      const geometry = feature.getGeometry()
      const styles = [
        // linestring
        new Style({
          stroke: new Stroke({
            color: '#32d218',
            width: 4
          })
        })
      ]

      if (resolution < 60) {
        geometry.forEachSegment(function (start, end) {
          const dx = end[0] - start[0]
          const dy = end[1] - start[1]
          const dx_2 = (start[0] + end[0]) / 2
          const dy_2 = (start[1] + end[1]) / 2
          const rotation = Math.atan2(dy, dx)

          const center = [dx_2, dy_2]

          styles.push(
            new Style({
              geometry: new Point(center),
              image: new Icon({
                src: arrowIcon,
                anchor: [0.5, 0.5],
                rotateWithView: true,
                rotation: -rotation
              }),
              zIndex: 500
            })
          )
          styles.push(
            new Style({
              geometry: new Point(end),
              image: new CircleStyle({
                radius: 3,
                fill: new Fill({ color: '#ddae34' }),
                stroke: new Stroke({ color: 'white', width: 2 })
              }),
              text: new Text({
                text: feature.values_.id,
                offsetX: 80,
                offsetY: 20,
                fill: new Fill({ color: 'black' }),
                stroke: new Stroke({ color: 'white', width: 2 }),
                font: 'bold 10px sans-serif'
              }),
              zIndex: 500
            })
          )
        })
      }
      return styles
    },
    aisData: function () {
      map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'aisAtonLayer')
        .forEach((layer) => map.removeLayer(layer))
      map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'aisBasestationLayer')
        .forEach((layer) => map.removeLayer(layer))
      map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'aisClassLayer')
        .forEach((layer) => map.removeLayer(layer))

      getAisData().then((data) => {
        // console.log('getAisData')
        let aisAton = data.ais_aton[0]
        let ais_basestation = data.ais_basestation[0]
        let ais_class_a = data.ais_class_a[0]
        let ais_class_b = data.ais_class_b[0]
        let vpass_class_b = data.vpass_class_a[0]

        let fill = new Fill({ color: 'green' })
        let stroke = new Stroke({ color: 'black', width: 2 })
        aisAton.forEach((aisAtonData) => {
          var pointFeature = new Feature({
            geometry: new Point([Number(aisAtonData.longitude), Number(aisAtonData.latitude)])
          })
          pointFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857')

          this.aisAtonLayer = new VectorLayer({
            name: 'aisAtonLayer',
            source: new VectorSource({
              features: [pointFeature]
            }),
            style: new Style({
              image: new RegularShape({
                fill: fill,
                points: 4,
                radius: 10,
                angle: 0
              })
            })
          })
          // MODIFY_240619
          //map.addLayer(this.aisAtonLayer);
        })

        fill = new Fill({ color: 'blue' })
        ais_basestation.forEach((aisBaseData) => {
          var pointFeature = new Feature({
            geometry: new Point([Number(aisBaseData.longitude), Number(aisBaseData.latitude)])
          })
          pointFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857')

          this.aisBasestationLayer = new VectorLayer({
            name: 'aisBasestationLayer',
            source: new VectorSource({
              features: [pointFeature]
            }),
            style: new Style({
              image: new RegularShape({
                fill: fill,
                stroke: stroke,
                points: 4,
                radius: 10,
                angle: Math.PI / 4
              }),
              zIndex: 500
            })
          })
          // MODIFY_240619
          // map.addLayer(this.aisBasestationLayer);
        })

        ais_class_a.forEach((aisClassAData) => {
          var rotation
          if (aisClassAData.heading === null) rotation = aisClassAData.cog
          else rotation = aisClassAData.heading

          var pointFeature = new Feature({
            geometry: new Point([Number(aisClassAData.longitude), Number(aisClassAData.latitude)])
          })
          pointFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857')

          // APPEND_240618
          var TargetLat = aisClassAData.latitude
          var TargetLon = aisClassAData.longitude
          var TargetCrs = aisClassAData.cog
          var TargetSpeed = aisClassAData.sog
          var return_CPATCPA = ''
          if (!isNaN(TargetLat) && !isNaN(TargetLon) && !isNaN(TargetCrs) && !isNaN(TargetSpeed)) {
            return_CPATCPA = CPATCPA.CalcCPATCPA(
              OwnshipLat,
              OwnshipLon,
              OwnshipCrs,
              OwnshipSpeed,
              TargetLat,
              TargetLon,
              TargetCrs,
              TargetSpeed
            )
          }
          var AISpng1 = '/images/shipicons/AIS.png'
          if (return_CPATCPA == 'warning' || return_CPATCPA == 'danger') {
            console.log('return A : ' + return_CPATCPA)
            AISpng1 = '/images/shipicons/AIS_warning.png'
          }

          this.aisClassLayer = new VectorLayer({
            name: 'aisClassLayer',
            source: new VectorSource({
              features: [pointFeature]
            }),
            style: new Style({
              image: new Icon({
                // APPEND_240618
                //                src: '/images/shipicons/AIS.png',
                src: AISpng1,
                // scale: 0.2,
                // anchor: [0.5, 0.5],
                opacity: 0.7,
                rotateWithView: true,
                // rotation: (-90 + rotation) * Math.PI/180
                rotation: (rotation * Math.PI) / 180
              })
            }),
            zIndex: 500
          })
          map.addLayer(this.aisClassLayer)
        })
        ais_class_b.forEach((aisClassBData) => {
          var rotation
          if (aisClassBData.heading === null) rotation = aisClassBData.cog
          else rotation = aisClassBData.heading

          var pointFeature = new Feature({
            geometry: new Point([Number(aisClassBData.longitude), Number(aisClassBData.latitude)])
          })
          pointFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857')

          // APPEND_240618
          var TargetLat = aisClassBData.latitude
          var TargetLon = aisClassBData.longitude
          var TargetCrs = aisClassBData.cog
          var TargetSpeed = aisClassBData.sog
          var return_CPATCPA = ''
          if (!isNaN(TargetLat) && !isNaN(TargetLon) && !isNaN(TargetCrs) && !isNaN(TargetSpeed)) {
            return_CPATCPA = CPATCPA.CalcCPATCPA(
              OwnshipLat,
              OwnshipLon,
              OwnshipCrs,
              OwnshipSpeed,
              TargetLat,
              TargetLon,
              TargetCrs,
              TargetSpeed
            )
          }
          var AISpng1 = '/images/shipicons/AIS.png'
          if (return_CPATCPA == 'warning' || return_CPATCPA == 'danger') {
            console.log('return B : ' + return_CPATCPA)
            AISpng1 = '/images/shipicons/AIS_warning.png'
          }

          this.aisClassLayer = new VectorLayer({
            name: 'aisClassLayer',
            source: new VectorSource({
              features: [pointFeature]
            }),
            style: new Style({
              image: new Icon({
                // APPEND_240618
                // src: '/images/shipicons/AIS.png',
                src: AISpng1,
                // scale: 0.2,
                // anchor: [0.5, 0.5],
                opacity: 0.7,
                rotateWithView: true,
                // rotation: (-90 + rotation) * Math.PI/180
                rotation: (rotation * Math.PI) / 180
              })
            }),
            zIndex: 500
          })
          map.addLayer(this.aisClassLayer)
        })
        vpass_class_b.forEach((vpassClassBData) => {
          var rotation
          if (vpassClassBData.heading === null) rotation = vpassClassBData.cog
          else rotation = vpassClassBData.heading

          var pointFeature = new Feature({
            geometry: new Point([
              Number(vpassClassBData.longitude),
              Number(vpassClassBData.latitude)
            ])
          })
          pointFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857')

          this.aisClassLayer = new VectorLayer({
            name: 'aisClassLayer',
            source: new VectorSource({
              features: [pointFeature]
            }),
            style: new Style({
              image: new Icon({
                src: '/images/shipicons/AIS.png',
                // scale: 0.7,
                // anchor: [0.5, 0.5],
                opacity: 0.7,
                rotateWithView: true,
                // rotation: (-90 + rotation) * Math.PI/180
                rotation: (rotation * Math.PI) / 180
              })
            }),
            zIndex: 500
          })
          // MODIFY_240619
          //map.addLayer(this.aisClassLayer);
        })
      })
    },

    setRouteLayer: function () {
      const source = new VectorSource()
      var routePLayer = new VectorLayer({
        id: 'route_p',
        source: source,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new Stroke({
            color: '#00ff00',
            width: 2
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#00ff00'
            })
          })
        })
      })
      map.addLayer(routePLayer)

      var routeLLayer = new VectorLayer({
        id: 'route_l',
        source: source,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new Stroke({
            color: '#ffcc33',
            width: 2
          }),
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({
              color: '#ffcc33'
            })
          })
        })
      })
      map.addLayer(routeLLayer)
    },

    routeInteraction: function () {
      const lyr_p = this.getLayer('route_p')

      this.drawInteration_route = new Draw({
        id: 'draw_i',
        source: lyr_p.getSource(),
        type: 'Point'
      })
      this.drawInteration_route.on('drawend', this.onDrawEnd)
      map.addInteraction(this.drawInteration_route)
    },

    onDrawEnd(f) {
      const routeStore = useRouteStore()
      const { routeMaster, routeDetail, selectedMIndex, selectedDIndex, drawactive } =
        storeToRefs(routeStore)

      var xy = f.feature.getGeometry().transform('EPSG:3857', 'EPSG:4326').getCoordinates()
      var y = xy[0]
      var x = xy[1]

      routeDetail.value[selectedDIndex.value].lon = y.toFixed(3)
      routeDetail.value[selectedDIndex.value].lat = x.toFixed(3)

      f.feature.getGeometry().transform('EPSG:4326', 'EPSG:3857')
      this.drawRoute()
      map.removeInteraction(this.drawInteration_route)
    },

    drawRoute4: function() {
      let lyr_p = this.getLayer('route_p')
      let lyr_l = this.getLayer('route_l')
      lyr_p.getSource().clear()
      lyr_l.getSource().clear()
    },

    drawRoute: function () {
      const routeStore = useRouteStore()
      const { routeMaster, routeDetail, selectedMIndex, selectedDIndex, drawactive } =
        storeToRefs(routeStore)

      let lyr_p = this.getLayer('route_p')
      let lyr_l = this.getLayer('route_l')
      lyr_p.getSource().clear()
      lyr_l.getSource().clear()

      var arr_line = new Array()
      if (routeDetail.value.length > 0) {
        routeDetail.value.forEach(function (item) {
          var point = [Number(item.lon), Number(item.lat)]
          var feat_p = new ol.Feature({
            id: 'rt_' + item.routeseq,
            geometry: new Point(point)
          })
          feat_p.getGeometry().transform('EPSG:4326', 'EPSG:3857')
          lyr_p.getSource().addFeature(feat_p)
          arr_line.push(point)
        })

        var feat_line = new ol.Feature({
          id: 'rt_' + routeMaster.value.routeid,
          geometry: new LineString(arr_line)
        })
        let c_geometry = feat_line.getGeometry().transform('EPSG:4326', 'EPSG:3857')
        lyr_l.getSource().addFeature(feat_line)
      }
    }
  }
}
</script>

<style scoped>
.map {
  position: fixed;
  width: 100%;
  height: 100%;
}
</style>
