import { Platform } from "react-native";

import colors from "./colors";

export default {
  text: {
    fontSize: 17,
    fontFamily: Platform.OS === "android" ? "Robot" : "Avenir",
    color: colors.dark,
  },
};
