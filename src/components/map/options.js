const options = {
  // geoserverWmsUrl: "http://navioncorp.asuscomm.com:8089/geoserver/wms",
  urlBefore: 'http://navioncorp.asuscomm.com:8080/TileMap/',
  urlAfter: '/{z}/{x}/{-y}.png',
  center: [128.100, 36.000],
  zoom: 7,
  mapBrightId: 'Day',
  mapModeId: 'Base',
  mapTypes: {
    Day_Base: {
      name: 'Day_Base',
      url: 'http://navioncorp.asuscomm.com:8080/TileMap/Day_Base/{z}/{x}/{-y}.png'
    },
    Day_Standard: {
      name: 'Day_Standard',
      url: 'http://navioncorp.asuscomm.com:8080/TileMap/Day_Standard/{z}/{x}/{-y}.png'
    },
    Day_Full: {
      name: 'Day_Full',
      url: 'http://navioncorp.asuscomm.com:8080/TileMap/Day_Full/{z}/{x}/{-y}.png'
    },
    Dusk_Base: {
      name: 'Dusk_Base',
      url: 'http://navioncorp.asuscomm.com:8080/TileMap/Dusk_Base/{z}/{x}/{-y}.png'
    },
    Dusk_Standard: {
      name: 'Dusk_Standard',
      url: 'http://navioncorp.asuscomm.com:8080/TileMap/Dusk_Standard/{z}/{x}/{-y}.png'
    },
    Dusk_Full: {
      name: 'Dusk_Full',
      url: 'http://navioncorp.asuscomm.com:8080/TileMap/Dusk_Full/{z}/{x}/{-y}.png'
    },
    Night_Base: {
      name: 'Night_Base',
      url: 'http://navioncorp.asuscomm.com:8080/TileMap/Night_Base/{z}/{x}/{-y}.png'
    },
    Night_Standard: {
      name: 'Night_Standard',
      url: 'http://navioncorp.asuscomm.com:8080/TileMap/Night_Standard/{z}/{x}/{-y}.png'
    },
    Night_Full: {
      name: 'Night_Full',
      url: 'http://navioncorp.asuscomm.com:8080/TileMap/Night_Full/{z}/{x}/{-y}.png'
    },
  },
};

export default options;
