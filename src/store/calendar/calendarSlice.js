import { createSlice } from "@reduxjs/toolkit";
import { addHours } from "date-fns";

const tempEvent = {
  _id: new Date(),
  title: "Cumple del Jefe",
  notes: "Comprar pastel",
  start: new Date(),
  end: addHours(new Date(), 1),
  bgColor: "#fafafa",
  user: {
    _id: "123",
    name: "Santiago",
  },
};

export const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    events: [tempEvent],
    activeEvent: null,
  },
  reducers: {
    onSetActiveEvent: (state, action) => {
      state.activeEvent = action.payload;
    },
    onAddNewEvent: (state, action) => {
      console.log(action);
      state.events.push(action.payload);
      state.activeEvent = null;
    },
    onUpdateEvent: (state, action) => {
      console.log(action.payload._id);
      state.events = state.events.map((event) => {
        console.log("Event is:", event);
        if (event._id === action.payload._id) {
        } else {
          return event;
        }
      });
    },
  },
});

export const { onSetActiveEvent, onAddNewEvent, onUpdateEvent } =
  calendarSlice.actions;
