export function setLineBar(legend, date, value) {
  return {
    style: 'width : 95%; height : 55vh',
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
      show : false
    },
    legend: {
      data: legend
    },
    xAxis: {
      type: 'category',
      data: date
    },
    yAxis: {
      type: 'value'
    },
    dataZoom: [
      {
        type: 'slider',
        show: true,
        realtime: true,
        start: 50,
        end: 85,
        handleSize: '100%'
      },
      {
        type: 'inside',
        realtime: true,
        start: 65,
        end: 85
      }
    ],
    // dataZoom: [
    //   {
    //     id: 'dataZoom',
    //     type: 'slider'
    //   }
    // ],
    series: value
  }
}

export class LineChart {
  constructor() {
    this.xAixs = { type: 'category' }
    this.yAxis = { type: 'value' }
    this.series = []
  }
  // setChartOption
  //   set xAixs(data) {
  // this._xAixs['data'] = data
  //   }

  //   set series(data) {
  //     let len = this._series.length
  //     this._series = len > 0 ? data : this._series.push(data)
  //   }

  addxAixs(data) {
    this.xAixs['data'] = data
  }
  addSeries(data) {
    let len = this.series.length
    this.series = len > 0 ? data : (this.series = data)
  }

  removeSeries(data) {
    // 데이터 삭제
  }
  getResult() {
    return {
      style: 'width : 80%; height : 300px',
      xAixs: this.xAixs,
      yAxis: this.yAxis,
      series: this.series
    }
  }
}

export const chartOption = {
  style: 'width : 80%; height : 300px',
  xAixs: { type: 'category' },
  yAxis: { type: 'value' },
  series: [],

  addxAixs: function (data) {
    this.xAixs['data'] = data
  },
  addSeries: function (data) {
    let len = this.series.length
    this.series = len > 0 ? data : this.series.push(data)
  }
}
