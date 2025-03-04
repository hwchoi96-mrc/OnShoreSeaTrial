<template>
  <div id="map" class="map" ref="rootmap"></div>
</template>

<script>
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import LayerGroup from 'ol/layer/Group'
import VectorSource from 'ol/source/Vector'
import { defaults as defaultControls } from 'ol/control'
import { fromLonLat } from 'ol/proj'
import VectorLayer from 'ol/layer/Vector'
import { Style, Icon, Fill, Stroke, Text } from 'ol/style'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point.js'
import { getShipData, getShipWakePast, getShipWakeCurrent } from '@/api/worldMap'
import { LineString } from 'ol/geom'

import shipIcon from '/images/shipicons/shipIcon_green.png'
import arrowIcon from '/images/shipicons/arrow.png'

// const urlBefore = 'http://navioncorp.asuscomm.com:8080/TileMap/'
// const urlAfter = '/{z}/{x}/{-y}.png?v='+ Math.random();
const urlBefore = import.meta.env.VITE_TILE_MAP_URL + '/'
const urlAfter = '/{z}/{x}/{-y}.png'

import {
  convertFloatFormatObject,
  convertDateTimeType,
  convertDateType,
  convertUTCTimezone
} from '@/composables/util'
import moment from 'moment'

export default {
  name: 'olmap',
  data: () => ({
    baselayers: LayerGroup,
    shipSource: VectorSource,
    shipLayer: VectorLayer,
    shipPastWakeLayer: VectorLayer,
    mapTypeId: String,
    map: null,
    isClick: false
  }),
  props: ['imoNumber', 'departureTime', 'arrivalTime'],
  mounted: async function () {
    this.baselayers = new TileLayer({
      source: new XYZ({
        url: urlBefore + 'Day_Base' + urlAfter
      }),
      name: 'Day_Base',
      visible: true
    })
    this.initMap()
    this.$emit('init', this.map)
    this.setShipLayer()
    this.vesselTrackPast()
  },
  methods: {
    initMap: function () {
      this.map = new Map({
        target: 'map',
        layers: [this.baselayers],
        view: new View({
          // center: transform([128.100, 36.000], 'EPSG:4326', 'EPSG:3857')
          center: fromLonLat([128.1, 36.0]),
          zoom: 4,
          //zoom: 7,
          maxResolution: 21600,
          constrainResolution: true
        }),
        controls: defaultControls({
          attribution: false,
          zoom: false,
          rotate: false
        })
      })
      return this.map
    },
    setShipLayer: function () {
      this.map.removeLayer(this.shipLayer)
      this.map
        .getLayers()
        .getArray()
        .filter((layer) => layer.get('name') === 'shipPastWakeLayer')
        .forEach((layer) => this.map.removeLayer(layer))

      getShipData(this.imoNumber).then((response) => {
        if (response.data.data.length === 0) return
        var shipData = response.data.data[0]
        var pointFeature = new Feature({
          geometry: new Point([Number(shipData.longitude), Number(shipData.latitude)]),
          name: shipData.imoNumber,
          layer: 'shipLayer',
          course: shipData.course
        })
        pointFeature.getGeometry().transform('EPSG:4326', 'EPSG:3857')

        this.shipLayer = new VectorLayer({
          name: 'shipLayer',
          source: new VectorSource({
            features: [pointFeature]
          }),
          style: new Style({
            image: new Icon({
              src: shipIcon,
              scale: 0.2,
              anchor: [0.5, 0.5],
              rotateWithView: true,
              rotation: ((-90 + shipData.course) * Math.PI) / 180
            })
          })
        })
        this.map.addLayer(this.shipLayer)
        this.map
          .getView()
          .setCenter(fromLonLat([Number(shipData.longitude), Number(shipData.latitude)]))
        this.map.getView().setZoom(2)
      })
    },

    getLayer: function (id) {
      let lyr = null
      var layers = this.map.getLayers().getArray()
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

    vesselTrackPast: function () {
      const today = moment()
      let todayDate = convertUTCTimezone(today)

      let voyageEndDate = convertUTCTimezone(this.arrivalTime)
      const result = moment(this.arrivalTime).isBefore(todayDate)

      if (result) {
        getShipWakePast(this.imoNumber, this.departureTime, this.arrivalTime).then((response) => {
          var shipWaskPastList = response.data.data
          if (response.data.data === null) return

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
              style: this.stylePast
            })
            this.map.addLayer(this.shipPastWakeLayer)
          })
        })
      }
      else{
        getShipWakeCurrent(this.imoNumber).then((response) => {
        var shipWakeList = response.data.data
        if (response.data.data === null) return

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
          this.map.addLayer(this.shipWakeLayer)
        })
      })

      }
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

      if (resolution < 40) {
        geometry.forEachSegment(function (start, end) {
          const dx = end[0] - start[0]
          const dy = end[1] - start[1]
          const rotation = Math.atan2(dy, dx)
          styles.push(
            new Style({
              geometry: new Point(end),
              text: new Text({
                text: feature.values_.id,
                offsetX: 80,
                offsetY: 20,
                fill: new Fill({ color: 'black' }),
                stroke: new Stroke({ color: 'white', width: 2 }),
                font: 'bold 10px sans-serif'
              }),
              image: new Icon({
                src: arrowIcon,
                anchor: [0.5, 0.5],
                rotateWithView: true,
                rotation: -rotation
              }),
              zIndex: 100
            })
          )
        })
      }
      return styles
    }
  }
}
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
