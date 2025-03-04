import DataGrid from 'devextreme/ui/data_grid'
// 그리드 옵션들을 알고 싶으면 그리드 인스턴스의 option()을 콘솔찍으면 나옵니다
DataGrid.defaultOptions({
  options: {
    noDataText: '데이터가 없습니다.',
    dateSerializationFormat: 'yyyy-MM-dd hh:mm:ss',
    // 페이지
    pager: {
      // visible: true,
      allowedPageSizes: [],
      displayMode: 'full',
      // showInfo: true,
      showNavigationButtons: true,
      showPageSizeSelector: true
    },
    paging: {
      pageCount: true
      // enabled: true,
      // pageSize: 15
    },
    remoteOperations: {
      // filtering : true,
      // paging :true,
      sorting: true
    },
    editing: {
      mode: 'cell',
      allowUpdating: true,
      selectTextOnEditStart: true,
      startEditAction: 'click',
      confirmDelete: false,
      newRowPosition: 'last'
    },
    scrolling: {
      rowRenderingMode: 'virtual'
    },

    //컬럼 사이즈 조절시 뒷컬럼 간격 고정
    columnResizingMode: 'widget',
    // 컬럼이 많아질때 가로스크롤 없이 ... 생기는것
    // columnHidingEnabled : true,

    // onContentReady(e) {
    //   let gridInstance = e.component
    //   if (!gridInstance.option('defaultPaging')) {
    //     // 화면에따른 페이징 맞추기
    //     setPageCount(gridInstance)
    //     gridInstance.option('loadPanel.enabled', false)
    //   }

    //   if (gridInstance.option('isAdding')) {
    //     gridInstance.option('focusedRowIndex', 0)
    //     gridInstance.option('isAdding', false)
    //   }
    // },

    onRowUpdated: (e) => {
      e.component.selectRows(e.key, true)
    },

    defaultPaging: false,
    isAdding: false
  }
})

// 그리드 행 추가
DataGrid.prototype.newRow = function (newRow) {
  let dataSource = this.option('dataSource')
  let visibleRow = this.getVisibleRows()

  const newRow1 = {
    id: newRow.id,
    measurementName: '',
    fieldName: '',
    imoNumber: '',
    tagName: '',
    description: '',
    dataType: '',
    dataUnit: '',
    equipmentName: '',
    partName: '',
    activated: true
  }

  let firstRowIndex =
    visibleRow.length !== 0 ? dataSource.findIndex((element) => element === visibleRow[0].data) : 0

  const result = dataSource.findIndex((element) => element === visibleRow[0].data)
  if (this.option('paging.pageSize') !== 0) {
    dataSource.splice(firstRowIndex == -1 ? firstRowIndex : 0, 0, newRow1)
  } else {
    dataSource.splice(0, 0, newRow1)
  }
  // dataSource.splice(0,0, newRow1 )
  // this.addRow()

  this.option('isAdding', true)
  // this.option('isNewRow', true)
}

// 화면에따른 페이징 맞추기
function setPageCount(gridInstance) {
  // dev의 onContentReady 이벤트에 넣으면 됨
  let rowOffsetHight = 60
  // 그리드 내용의 DOM
  let gridContentElement = gridInstance.element().querySelector('.dx-datagrid-rowsview')
  let FirstRow = gridContentElement.querySelector('.dx-data-row')
  if (FirstRow == null) return
  // 각각의 높이
  let contentHight = gridContentElement.offsetHeight
  // 나누기
  let value = Math.floor(contentHight / rowOffsetHight)
  // 페이징 계산
  gridInstance.option('paging.pageSize', value)
  // gridInstance.option("defaultPaging", false)

  // allowedPageSizes 에 페이지 기능 설정
  // setPageSizes(gridInstance, value)
}
