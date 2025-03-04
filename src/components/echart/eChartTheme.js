import { useTheme } from "vuetify";

export function useEchartTheme() {
  const theme = useTheme();
  let themeType = "echartBlueTheme";

  switch (theme.global.name.value) {
    case "customBlueTheme":
      themeType = "echartBlueTheme";
      break;
    case "customGreenTheme":
      themeType = "echartGreenTheme";
      break;
    case "customPurpleTheme":
      themeType = "echartPurpleTheme";
      break;
    case "customBlackTheme":
      themeType = "echartBlackTheme";
      break;
    case "customGreenLightTheme":
      themeType = "customGreenLightTheme";
      break;
  }

  return { themeType };
}
