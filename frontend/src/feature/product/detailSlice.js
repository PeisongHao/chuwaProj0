import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchDetailById = createAsyncThunk(
  "product/detailById",
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:3000/api/product/detail/${id}`);
      return res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const detailSlice = createSlice({
  name: "detail",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: [],
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetailById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDetailById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchDetailById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default detailSlice.reducer;
