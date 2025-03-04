import iButton from '@/components/common/iButton.vue'
import iButtonGroup from '@/components/common/iButtonGroup.vue'
import iButtonToggle from '@/components/common/iButtonToggle.vue'
import iInput from '@/components/common/iInput.vue'
import iSelectbox from '@/components/common/iSelectbox.vue'
import iVerticalTable from '@/components/common/iVerticalTable.vue'
import iTable from '@/components/common/iTable.vue'
import iVideo from '@/components/common/iVideo.vue'
import iDxGrid from '@/components/common/iDxGrid.vue'


const customPlugins = {
  install(app){
    app.component('i-btn', iButton)
    app.component('i-input', iInput)
    app.component('i-btnGroup', iButtonGroup)
    app.component('i-btnToggle', iButtonToggle)
    app.component('i-selectbox', iSelectbox)
    app.component('i-verticalTable', iVerticalTable)
    app.component('i-Table', iTable)
    app.component('i-dxGrid', iDxGrid)
    app.component('i-video', iVideo)

    

  }
}

export default customPlugins