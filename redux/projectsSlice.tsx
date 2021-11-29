import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import project from "../types/project";

const getProjectsByPage = createAsyncThunk(
  "projects/requestStatus",
  async () => {}
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase("promise.fufilled", (state, action) => {
      // Add user to the state array
    });
  },
});

export const projects = projectsSlice.actions;
export { getProjectsByPage };

export default projectsSlice.reducer;
