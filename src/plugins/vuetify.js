// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import '@/assets/vuetify/index.scss'

// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// 블랙
const customBlackTheme = {
  dark: true,
  colors: {
    primary: '#5789FE',
    secondary: '#aaa',
    'secondary-1': '#61D1D2',
    'secondary-2': '#A63AA9',
    'secondary-3': '#b0bec5',
    'secondary-4': '#cfd8dc',
    background: '#000000',
    // color: "#000000",
    color: '#fff',
    // activeColor: "#6200EE",
    appBar: '#1f1e1e',
    'aside-top-bottom': '#1F1E1E',
    'aside-content': '#1F1E1E',
    footer: '#1e1e1e',
    card: '#222224',
    // "table-header": "#253a5f",
    // "table-body": "#253a5f",
    chart: '#806BFF',
    'btn-title': '#fff',
    'selectBox-title': '#fff',
    selectBoxBorder: '#fff',
    selectOption: '1e1e1e',
    iconColor: '#fff',
    btn: '#3b3b3b',
    orange: '#FFC000',
    green: '#92D050',
    red: '#DE4646'
  },
  variables: {
    // "border-color": "255, 120, 120",
    color: '#fff'
  }
}

export default createVuetify({
  theme: {
    defaultTheme: 'customBlackTheme',
    themes: {
      customBlackTheme
    }
  },
  icons: {
    defaultSet: 'mdi'
  },
  components,
  directives
})
