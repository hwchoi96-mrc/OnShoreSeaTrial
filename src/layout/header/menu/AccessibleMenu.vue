<template>
  <div class="menuContainer d-flex">
    <div v-for="(item, index) in accessMenus">
      <v-menu open-on-hover v-if="item.menuId != SETTINGS_MENU_ID && item.menuId != REPORT_MENU_ID">
        <template v-slot:activator="{ props }">
          <v-btn @click="goPage(item.routerPath)" color="white" v-bind="props">
            {{ item.menuName }}
          </v-btn>
        </template>

        <v-list v-if="item.children">
          <div v-for="(children, index) in item.children" :key="index">
            <v-list-item v-if="children.menuId != SUB_CII_MENU_ID && children.menuId != SUB_SHIPDASH_MENU_ID && children.menuId != SUB_FIRE_MENU_ID && children.menuId != SUB_CCTV_MENU_ID && children.menuId != SUB_INS_MENU_ID && children.menuId != SUB_ANAL_MENU_ID">
            <v-list-item-title @click="goPage(children.routerPath)">{{ children.menuName
              }}</v-list-item-title>
          </v-list-item>
          </div>          
        </v-list>
      </v-menu>
    </div>
  </div>

</template>

<script setup>
import { goPage } from '@/composables/util.js'
import { useAccessMenuStore } from '@/stores/accessMenuStore'
const { accessMenus } = useAccessMenuStore()
const SETTINGS_MENU_ID = 500
const VOYAGE_MENU_ID = 200
const MONITORING_MENU_ID = 300
const DATA_MENU_ID = 400
const REPORT_MENU_ID = 600
const SUB_CII_MENU_ID = 202
const SUB_SHIPDASH_MENU_ID = 301
const SUB_FIRE_MENU_ID = 303
const SUB_CCTV_MENU_ID = 304
const SUB_INS_MENU_ID = 305
const SUB_ANAL_MENU_ID = 403
</script>

<style></style>