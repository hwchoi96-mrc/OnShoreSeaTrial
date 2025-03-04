import { defineStore } from "pinia";
import { ref, getCurrentInstance } from "vue";

export const useThemeStore = defineStore("echartTheme", () => {
  const { proxy } = getCurrentInstance();
  const currentEchartTheme = ref(proxy.echartTheme);

  return { currentEchartTheme };
});
