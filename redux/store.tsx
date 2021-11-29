import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "../redux/projectsSlice";

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
  },
});

//export type RootState = ReturnType<typeof store.state>
export default store;
