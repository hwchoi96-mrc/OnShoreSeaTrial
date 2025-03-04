// import 'devextreme/dist/css/dx.dark.css'
import '@/assets/dx.generic.dark-blue.css'
import './assets/base.css'

import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import router from './routes/'
import vuetify from './plugins/vuetify'
import customPlugins from '@/plugins/custom'
import devExtreamPlugins from './plugins/devextreme'
import '@/plugins/dxDataGridEnvs'
import 'video.js/dist/video-js.css'

import Echarts from 'vue-echarts'
import { GridLayout, GridItem } from 'grid-layout-plus'
import moment from 'moment'
import * as xlsx from 'xlsx'
import * as jspdf from 'jspdf'

const pinia = createPinia()
const app = createApp(App)

app.component(Echarts)
app.component('GridLayout', GridLayout)
app.component('GridItem', GridItem)
pinia.use(piniaPluginPersistedstate)

// storage sessionStorage로 설정해보기
app.use(pinia)
app.use(vuetify)
app.use(router)
app.use(customPlugins)
app.use(devExtreamPlugins)
app.use(jspdf)
app.use(moment)

app.config.globalProperties.echartTheme = 'echartBlackTheme'
app.config.globalProperties.xlsx = xlsx

app.mount('#app')
