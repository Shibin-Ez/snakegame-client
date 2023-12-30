import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    highScore: 0,
    userId: 0,
    name: "",
};

export const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        setHighScore: (state, action) => {
            state.highScore = action.payload.highScore;
        },
        setUserId: (state, action) => {
            state.userId = action.payload.userId;
        },
        setName: (state, action) => {
            state.name = action.payload.name;
        }
    }
});

export const { setHighScore, setUserId, setName } = gameSlice.actions;
export default gameSlice.reducer;