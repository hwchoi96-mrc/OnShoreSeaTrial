import geodesic from 'geographiclib-geodesic'
// var geodesic = require("geographiclib-geodesic");
//var DMS = require("geographiclib-dms");

// 단위 : NM
var CPA_warning = 1
var CPA_danger = 1
// 단위 : 분
var TCPA_warning = 5
var TCPA_danger = 5
//
var cnt_warning = 0
var cnt_danger = 0
//
var cnt_wardan = 0
//
var cnt_AIS = 0

var m_clsGeodesic = geodesic.Geodesic.WGS84
// var m_clsRhumb;

var OwnshipLat
var OwnshipLon
var OwnshipCrs
var OwnshipSpeed

var TargetMMSI
var TargetLat
var TargetLon
var TargetCrs
var TargetSpeed

var s = start()

function start() {
  // setOwnshipSample1();
  // var visdata = import.meta.env.VITE_AIS_DATA_URL;
  // fetch(visdata)
  //     .then(response => response.text())
  //     .then(html => {
  //         json_parser(html);
  //     })
  //     .catch(error => {
  //         console.error('Fail', error);
  //     });
}

function setOwnshipSample1() {
  // OwnshipLat = 34;
  // OwnshipLon = 129;
  // OwnshipCrs = 0;
  // OwnshipSpeed = 10.0;
  // OwnshipLat = 35.440;
  // OwnshipLon = 129.354;
  // OwnshipCrs = 183.800;
  // OwnshipSpeed = 10.0;
  // console.log("* Ownship" +
  //     " / Lat : " + OwnshipLat.toFixed(3) + "도" +
  //     " / Lon : " + OwnshipLon.toFixed(3) + "도" +
  //     " / Crs : " + OwnshipCrs.toFixed(3) + "도" +
  //     " / Speed : " + OwnshipSpeed.toFixed(3) + "kts"
  // );
}

function json_parser(jsonString) {
  var jsonObject = JSON.parse(jsonString)

  cnt_AIS =
    Object.keys(jsonObject.ais_class_a[0]).length + Object.keys(jsonObject.ais_class_b[0]).length

  // CLASS_A
  console.log('* CLASS_A 개수 : ' + Object.keys(jsonObject.ais_class_a[0]).length)
  console.log('')
  for (let i = 0; i < Object.keys(jsonObject.ais_class_a[0]).length; i++) {
    TargetMMSI = jsonObject.ais_class_a[0][i].mmsi
    TargetLat = parseFloat(jsonObject.ais_class_a[0][i].latitude)
    TargetLon = parseFloat(jsonObject.ais_class_a[0][i].longitude)
    TargetCrs = parseFloat(jsonObject.ais_class_a[0][i].cog)
    TargetSpeed = parseFloat(jsonObject.ais_class_a[0][i].sog)

    // TargetLat = 35;
    // TargetLon = 129;
    // TargetCrs = 270;
    // TargetSpeed = 10.0;

    if (i % 100 == 0) {
      console.log(
        'CLASS_A 타겟' +
          (i + 1) +
          ' / Lat : ' +
          TargetLat.toFixed(3) +
          '도' +
          ' / Lon : ' +
          TargetLon.toFixed(3) +
          '도' +
          ' / Crs : ' +
          TargetCrs.toFixed(3) +
          '도' +
          ' / Speed : ' +
          TargetSpeed.toFixed(3) +
          'kts' +
          ' / MMSI : ' +
          TargetMMSI
      )

      if (!isNaN(TargetLat) && !isNaN(TargetLon) && !isNaN(TargetCrs) && !isNaN(TargetSpeed))
        CalcCPATCPA(
          OwnshipLat,
          OwnshipLon,
          OwnshipCrs,
          OwnshipSpeed,
          TargetLat,
          TargetLon,
          TargetCrs,
          TargetSpeed
        )

      console.log('')
    }
  }

  // CLASS_B
  console.log('* CLASS_B 개수 : ' + Object.keys(jsonObject.ais_class_b[0]).length)
  console.log('')
  for (let i = 0; i < Object.keys(jsonObject.ais_class_b[0]).length; i++) {
    TargetMMSI = jsonObject.ais_class_b[0][i].mmsi
    TargetLat = parseFloat(jsonObject.ais_class_b[0][i].latitude)
    TargetLon = parseFloat(jsonObject.ais_class_b[0][i].longitude)
    TargetCrs = parseFloat(jsonObject.ais_class_b[0][i].cog)
    TargetSpeed = parseFloat(jsonObject.ais_class_b[0][i].sog)

    if (i % 100 == 0) {
      console.log(
        'CLASS_B 타겟' +
          (i + 1) +
          ' / Lat : ' +
          TargetLat.toFixed(3) +
          '도' +
          ' / Lon : ' +
          TargetLon.toFixed(3) +
          '도' +
          ' / Crs : ' +
          TargetCrs.toFixed(3) +
          '도' +
          ' / Speed : ' +
          TargetSpeed.toFixed(3) +
          'kts' +
          ' / MMSI : ' +
          TargetMMSI
      )

      if (!isNaN(TargetLat) && !isNaN(TargetLon) && !isNaN(TargetCrs) && !isNaN(TargetSpeed))
        CalcCPATCPA(
          OwnshipLat,
          OwnshipLon,
          OwnshipCrs,
          OwnshipSpeed,
          TargetLat,
          TargetLon,
          TargetCrs,
          TargetSpeed
        )

      console.log('')
    }
  }

  //
  console.log('* AIS 선박수 = ' + cnt_AIS)
  console.log('* warning 선박수 = ' + cnt_warning)
  console.log('* danger 선박수 = ' + cnt_danger)
  console.log('* 총 위험 선박수 = ' + (cnt_warning + cnt_danger))
}

/// <summary>
/// Ownship기준으로 Target의 CPA,TCPA 얻어내는 함수
/// </summary>
/// <param name="dOwnshipLat">Ownship 위치 (경도) - 단위: 도</param>
/// <param name="dOwnshipLon">Ownship 위치 (위도) - 단위: 도</param>
/// <param name="dOwnshipCrs">Ownship 코스 - 단위: 도</param>
/// <param name="dOwnshipSpeed">Ownship 속력 - 단위: kts</param>
/// <param name="dTargetLat">Target 위치 (위도) - 단위: 도</param>
/// <param name="dTargetLon">Target 위치 (경도) - 단위: 도</param>
/// <param name="dTargetCrs">Target 코스 - 단위: 도</param>
/// <param name="dTargetSpeed">Target 속력 - 단위: kts</param>

/// <param name="dCPA">CPA 거리 반환 - 단위: NM</param>
/// <param name="dTCPA">CPA 도달 시간 반환. 값이 0 이하이면 충돌하지 않는다. - 단위: 분</param>
/// <param name="dBCPA">자함에서 CPA 방향 방위 반환 - 단위: 도</param>
/// <param name="dCPA_TargetLat">CPA Target 위치 (위도) 반환 - 단위: 도</param>
/// <param name="dCPA_TargetLon">CPA Target 위치 (경도) 반환 - 단위: 도</param>
/// <param name="dCPA_OwnshipLat">CPA Ownship 위치 (위도) 반환 - 단위: 도</param>
/// <param name="dCPA_OwnshipLon">CPA Ownship 위치 (경도) 반환 - 단위: 도</param>
/// <returns></returns>

let dBrg = 0.0,
  dDist = 0.0

var dCPA = 0.0,
  dTCPA = 0.0,
  dBCPA = 0.0
var dCPA_TargetLat = 0.0,
  dCPA_TargetLon = 0.0
var dCPA_OwnshipLat = 0.0,
  dCPA_OwnshipLon = 0.0

// [RETURN] : dCPA, dTCPA, dBCPA
// [RETURN] : dCPA_TargetLat, dCPA_TargetLon,
// [RETURN] : dCPA_OwnshipLat, dCPA_OwnshipLon
function CalcCPATCPA(
  dOwnshipLat,
  dOwnshipLon,
  dOwnshipCrs,
  dOwnshipSpeed,
  dTargetLat,
  dTargetLon,
  dTargetCrs,
  dTargetSpeed
) {
  if (dOwnshipLat == 0 && dOwnshipLon == 0 && dOwnshipCrs == 0 && dOwnshipSpeed == 0) return ''
  // console.log("CalcCPATCPA");

  // function toRadians(degrees) {return degrees * (Math.PI / 180);}
  function toRadians(degrees) {
    return degrees * (3.141592653589793 / 180)
  }

  while (dTargetCrs < 0.0) dTargetCrs += 360.0
  while (dTargetCrs > 360.0) dTargetCrs -= 360.0
  while (dOwnshipCrs < 0.0) dOwnshipCrs += 360.0
  while (dOwnshipCrs > 360.0) dOwnshipCrs -= 360.0

  // Target 속도 벡터
  let dVector_TargetLat = dTargetSpeed * Math.cos(toRadians(dTargetCrs))
  let dVector_TargetLon = dTargetSpeed * Math.sin(toRadians(dTargetCrs))

  // Ownship 속도 벡터
  let dVector_OwnshipLat = dOwnshipSpeed * Math.cos(toRadians(dOwnshipCrs))
  let dVector_OwnshipLon = dOwnshipSpeed * Math.sin(toRadians(dOwnshipCrs))

  // 자함에서 Target 까지의 거리 및 방위
  PosToBrgDist_ref(dOwnshipLat, dOwnshipLon, dTargetLat, dTargetLon /*, dDist, dBrg*/)

  // 자함에서 Target 까지의 거리 차이
  let dDiffRange_Lat = dDist * Math.cos(toRadians(dBrg))
  let dDiffRange_Lon = dDist * Math.sin(toRadians(dBrg))

  // 표적과 자함의 속도 차이
  let dDiffSpeed_Lat = dVector_TargetLat - dVector_OwnshipLat
  let dDiffSpeed_Lon = dVector_TargetLon - dVector_OwnshipLon

  // CPA 도달 시간
  if (dDiffSpeed_Lon == 0.0 && dDiffSpeed_Lat == 0.0) {
    // 속도 차이가 없으면 거리 차이가 변하지 않으므로 현재가(항상) 가장 근접한 시간임
    dTCPA = 0.0
  } else {
    dTCPA =
      -(dDiffRange_Lon * dDiffSpeed_Lon + dDiffRange_Lat * dDiffSpeed_Lat) /
      (dDiffSpeed_Lon * dDiffSpeed_Lon + dDiffSpeed_Lat * dDiffSpeed_Lat)
  }

  let dOwnshipMoveRange = dOwnshipSpeed * dTCPA // dTCPA 동안 자함이 이동하는 거리
  if (dTCPA >= 0) {
    BrgDistToPos(dOwnshipLat, dOwnshipLon, dOwnshipMoveRange, dOwnshipCrs, 'Ownship')
  } else {
    // 시간이 음수이면 반대 방향으로 dOwnshipMoveRange 만큼 떨어진 지점의 좌표
    BrgDistToPos(dOwnshipLat, dOwnshipLon, -dOwnshipMoveRange, dOwnshipCrs + 180.0, 'Ownship')
  }

  let dTargetMoveRange = dTargetSpeed * dTCPA // dTCPA 동안 표적이 이동하는 거리
  if (dTCPA >= 0) {
    BrgDistToPos(dTargetLat, dTargetLon, dTargetMoveRange, dTargetCrs, 'Target')
  } else {
    // 시간이 음수이면 반대 방향으로 dTargetMoveRange 만큼 떨어진 지점의 좌표
    BrgDistToPos(dTargetLat, dTargetLon, -dTargetMoveRange, dTargetCrs + 180.0, 'Target')
  }

  // CPA 자함과 표적간 거리/방위
  finalCalcCPATCPA(
    dCPA_OwnshipLat,
    dCPA_OwnshipLon,
    dCPA_TargetLat,
    dCPA_TargetLon /*, dCPA, dBCPA*/
  )
  dTCPA *= 60

  var isdanwar = false
  if (dCPA >= 0 && dCPA < CPA_danger && dTCPA >= 0 && dTCPA < TCPA_danger) {
    isdanwar = true
  } else if (dCPA >= 0 && dCPA < CPA_warning && dTCPA >= 0 && dTCPA < TCPA_warning) {
    isdanwar = true
  }

  //
  if (isdanwar == true) {
    console.log(
      isdanwar +
        ' / ' +
        cnt_wardan +
        ' ' +
        '> CPA : ' +
        dCPA.toFixed(3) +
        'NM' +
        ', TCPA : ' +
        dTCPA.toFixed(3) +
        '분' +
        ', BCPA : ' +
        dBCPA.toFixed(3) +
        '도' +
        ', CPA_TargetLat : ' +
        dCPA_TargetLat.toFixed(3) +
        '도' +
        ', CPA_TargetLon : ' +
        dCPA_TargetLon.toFixed(3) +
        '도' +
        ', CPA_OwnshipLat : ' +
        dCPA_OwnshipLat.toFixed(3) +
        '도' +
        ', CPA_OwnshipLon : ' +
        dCPA_OwnshipLon.toFixed(3) +
        '도' +
        ' / CPA_danger = ' +
        CPA_danger +
        ', TCPA_danger = ' +
        TCPA_danger +
        ', CPA_warning = ' +
        CPA_warning +
        ' , TCPA_warning = ' +
        TCPA_warning +
        ' / dOwnshipLat = ' +
        dOwnshipLat +
        ', dOwnshipLon = ' +
        dOwnshipLon +
        ', dOwnshipCrs = ' +
        dOwnshipCrs +
        ', dOwnshipSpeed = ' +
        dOwnshipSpeed +
        ' / dTargetLat = ' +
        dTargetLat +
        ', dTargetLon = ' +
        dTargetLon +
        ', dTargetCrs = ' +
        dTargetCrs +
        ', dTargetSpeed = ' +
        dTargetSpeed
    )
  }

  if (dCPA >= 0 && dCPA < CPA_danger && dTCPA >= 0 && dTCPA < TCPA_danger) {
    console.log('CPA,TCPA danger')
    cnt_danger++
    cnt_wardan++
    return 'danger'
  } else if (dCPA >= 0 && dCPA < CPA_warning && dTCPA >= 0 && dTCPA < TCPA_warning) {
    console.log('CPA, TCPA warning')
    cnt_warning++
    cnt_wardan++
    return 'warning'
  }
}

/// <summary>
/// Ownship기준으로 Target의 거리와 방위각을 얻어내는 함수
/// </summary>
/// <param name="fOwnshipLat">Ownship 위치 (경도) - 단위: 도</param>
/// <param name="fOwnshipLon">Ownship 위치 (위도) - 단위: 도</param>
/// <param name="fTargetLat">Target 위치 (위도) - 단위: 도</param>
/// <param name="fTargetLat">Target 위치 (경도) - 단위: 도</param>
/// <param name="fDist">자함과 표적간의 거리 반환 - 단위: NM</param>
/// <param name="fBrg">자함과 표적간의 방위 반환 - 단위: 도</param>
/// <returns></returns>

// [Params] : 자함위치, 표적위치, [RETURN] : (fDist, fBrg 베어링) 거리,방위
function finalCalcCPATCPA(fOwnshipLat, fOwnshipLon, fTargetLat, fTargetLon) {
  var r

  // let fBrg2 = 0;

  // Geodesic 거리
  if (m_clsGeodesic) {
    r = m_clsGeodesic.Inverse(fOwnshipLat, fOwnshipLon, fTargetLat, fTargetLon)

    dCPA = r.s12
    dBCPA = r.azi1

    dCPA /= 1852

    if (dBCPA < 0) dBCPA += 360
  }
  // Rhumb 방위
  else {
    console.log('Geodesic Lib가 선언되지 않았습니다.')
    // // m_clsRhumb->Inverse(fOwnshipLat, fOwnshipLon, fTargetLat, fTargetLon, fDist, fBrg, fBrg2);
    // r = m_clsGeodesic.Inverse(fOwnshipLat, fOwnshipLon, fTargetLat, fTargetLon);

    // dCPA = r.s12;
    // dBCPA = r.azi1;

    // dCPA /= 1852;

    // if (dBCPA < 0)
    //     dBCPA += 360;
  }
}

function PosToBrgDist_ref(fOwnshipLat, fOwnshipLon, fTargetLat, fTargetLon) {
  var r

  // let dBrg2 = 0;

  // Geodesic 거리
  if (m_clsGeodesic) {
    r = m_clsGeodesic.Inverse(fOwnshipLat, fOwnshipLon, fTargetLat, fTargetLon)

    dDist = r.s12
    dBrg = r.azi1

    dDist /= 1852

    if (dBrg < 0) dBrg += 360
  }
  // Rhumb 방위
  else {
    console.log('Geodesic Lib가 선언되지 않았습니다.')
    // // m_clsRhumb->Inverse(fOwnshipLat, fOwnshipLon, fTargetLat, fTargetLon, dDist, dBrg, dBrg2);
    // r = m_clsGeodesic.Inverse(fOwnshipLat, fOwnshipLon, fTargetLat, fTargetLon);

    // dDist = r.s12;
    // dBrg = r.azi1;

    // dDist /= 1852;

    // if (dBrg < 0)
    //     dBrg += 360;
  }
}

/// <summary>
/// Ownship기준으로 거리와 방위각에 대한 Target의 위치를 얻어내는 함수
/// </summary>
/// <param name="fOwnshipLat">Ownship 위치 (경도) - 단위: 도</param>
/// <param name="fOwnshipLon">Ownship 위치 (위도) - 단위: 도</param>
/// <param name="fDist">자함과 표적간의 거리 - 단위: NM</param>
/// <param name="fBrg">자함과 표적간의 방위 - 단위: 도</param>
/// <param name="fTargetLat">Target 위치 (위도) 반환 - 단위: 도</param>
/// <param name="fTargetLat">Target 위치 (경도) 반환 - 단위: 도</param>
/// <returns></returns>

// [RETURN] : dCPA, dTCPA, dBCPA
// [RETURN] : dCPA_TargetLat, dCPA_TargetLon,
// [RETURN] : dCPA_OwnshipLat, dCPA_OwnshipLon

// [Params] : 자함위치, 거리, 방위, [RETURN] : 표적위치 (fTargetLat, fTargetLon)
function BrgDistToPos(fOwnshipLat, fOwnshipLon, fDist, fBrg, OwnTarget) {
  var r

  fDist *= 1852

  // Geodesic 거리
  if (m_clsGeodesic) {
    r = m_clsGeodesic.Direct(fOwnshipLat, fOwnshipLon, fBrg, fDist)
    if (OwnTarget == 'Ownship') {
      dCPA_OwnshipLat = r.lat2
      dCPA_OwnshipLon = r.lon2
    } else if (OwnTarget == 'Target') {
      dCPA_TargetLat = r.lat2
      dCPA_TargetLon = r.lon2
    }
  }
  // Rhumb 방위
  else {
    // m_clsRhumb->Direct(fOwnshipLat, fOwnshipLon, fBrg, fDist, fTargetLat, fTargetLon);
    // r = m_clsGeodesic.Direct(fOwnshipLat, fOwnshipLon, fDist, fBrg);
    // if (OwnTarget == "Ownship") {
    //     dCPA_OwnshipLat = r.lat2;
    //     dCPA_OwnshipLon = r.lon2;
    // }
    // else if (OwnTarget == "Target") {
    //     dCPA_TargetLat = r.lat2;
    //     dCPA_TargetLon = r.lon2;
    // }
  }
}

const CPATCPA = { CalcCPATCPA }
export default CPATCPA
