/**
 * Dx 그리드 인스턴스 반환
 */
export const getDxGridInstance = (ref) => {
  const instance = ref.value.instance
  return instance
}

/**
 * Dx그리드 데이터 새로 고침
 * @param DxDataGrid ref 객체
 */
export const dxGridRefresh = (ref) => {
  const instance = getDxGridInstance(ref)
  instance.refresh()
}

/**
 * Dx그리드 선택 해제
 * @param DxDataGrid ref 객체
 */
export const dxGridDeselectAll = (ref) => {
  const instance = getDxGridInstance(ref)
  instance.clearSelection()
}
