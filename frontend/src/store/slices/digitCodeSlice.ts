import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type DigitCodeState = {
  shape: Shape;
  digit: Digit;
  state: "correct" | "incorrect";
}[];

const initialState: DigitCodeState = [];

export const digitCodeSlice = createSlice({
  name: "digitCode",
  initialState,
  reducers: {
    load: (_, action: PayloadAction<DigitCodeState>) => action.payload,
    reset: () => initialState,
    // legacy toggler used when clicking a marked cell to clear it
    toggleDigitState: (
      state,
      action: PayloadAction<{ shape: Shape; digit: Digit }>
    ) => {
      const { shape, digit } = action.payload;

      const index = state.findIndex(
        (entry) => entry.shape === shape && entry.digit === digit
      );

      if (index >= 0) {
        state.splice(index, 1);
      } else {
        state.push({ shape, digit, state: "incorrect" });
      }
    },
    setDigitState: (
      state,
      action: PayloadAction<{ shape: Shape; digit: Digit; state: "correct" | "incorrect" }>
    ) => {
      const { shape, digit, state: newState } = action.payload;
      const index = state.findIndex(
        (entry) => entry.shape === shape && entry.digit === digit
      );

      if (index >= 0) {
        state[index].state = newState;
      } else {
        state.push({ shape, digit, state: newState });
      }
    },
    removeDigit: (
      state,
      action: PayloadAction<{ shape: Shape; digit: Digit }>
    ) => {
      const { shape, digit } = action.payload;
      const index = state.findIndex(
        (entry) => entry.shape === shape && entry.digit === digit
      );
      if (index >= 0) {
        state.splice(index, 1);
      }
    },
  },
});

export const digitCodeActions = digitCodeSlice.actions;

export default digitCodeSlice.reducer;
