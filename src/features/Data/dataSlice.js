import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getData } from "./dataApi"


const initialState = {
    data: null,
    isLoading: false,
    isError: false,
    error:''
}

//async thunk
export const fetchData = createAsyncThunk("data/fetchData",
    async () => {
        const data = await getData()
        return data;
    }
)
const dataSlice = createSlice({
    name: "data",
    initialState,

    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.isError = false;
                state.isLoading = true;
            })
            .addCase(fetchData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.data = action.payload;
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.data = [];
                state.error = action.error?.message;
            })

    }
})

export default dataSlice.reducer;