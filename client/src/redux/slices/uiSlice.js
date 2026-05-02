import { createSlice } from "@reduxjs/toolkit";

const savedTheme = localStorage.getItem("themeMode");
const initialTheme = savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: initialTheme,
  },
  reducers: {
    setTheme: (state, action) => {
      const next = action.payload === "dark" ? "dark" : "light";
      state.theme = next;
      localStorage.setItem("themeMode", next);
    },
  },
});

export const { setTheme } = uiSlice.actions;
export default uiSlice.reducer;
