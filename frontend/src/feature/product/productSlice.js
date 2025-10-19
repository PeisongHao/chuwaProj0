import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAll = createAsyncThunk(
  "product/all",
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:3000/api/product/`);
      return res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: [],
  extraReducers: (builder) => {
    builder
      .addCase(fetchAll.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAll.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchAll.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;
