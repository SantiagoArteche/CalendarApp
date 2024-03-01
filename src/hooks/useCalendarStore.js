import { useDispatch, useSelector } from "react-redux";
import {
  onAddNewEvent,
  onDeleteEvent,
  onSetActiveEvent,
  onUpdateEvent,
  onLoadingEvents,
} from "../store/calendar/calendarSlice";
import { convertEventsToDateEvents } from "../helpers/converEventsToDateEvents";
import Swal from "sweetalert2";

export const useCalendarStore = () => {
  const { events, activeEvent } = useSelector((state) => state.calendar);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const setActiveEvent = (calendarEvent) => {
    dispatch(onSetActiveEvent(calendarEvent));
  };

  const startSavingEvent = async (calendarEvent) => {
    const token = localStorage.getItem("jwt-token");
    if (calendarEvent.id) {
      const request = await fetch(
        `${import.meta.env.VITE_API_URL}/events/${calendarEvent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
            "jwt-token": token,
          },
          body: JSON.stringify(calendarEvent),
        }
      );

      if (request.status === 200) {
        await request.json();
        dispatch(
          onUpdateEvent({
            ...calendarEvent,
            user,
          })
        );
      } else {
        Swal.fire("Error updating", "", "error");
      }
    } else {
      const request = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "jwt-token": token,
        },
        body: JSON.stringify(calendarEvent),
      });

      if (request.status === 200) {
        const response = await request.json();
        dispatch(
          onAddNewEvent({
            ...calendarEvent,
            id: response.msg.id,
            user,
          })
        );
      } else {
        Swal.fire("Error creating new event", "", "error");
      }
    }
  };

  const startDeletingEvent = async () => {
    const token = localStorage.getItem("jwt-token");
    const request = await fetch(
      `${import.meta.env.VITE_API_URL}/events/${activeEvent.id}`,
      {
        method: "DELETE",
        headers: { "Content-type": "application/json", "jwt-token": token },
      }
    );

    if (request.status === 200) {
      await request.json();
      dispatch(onDeleteEvent());
      Swal.fire("Event deleted!", "Your event was removed", "success");
    } else {
      Swal.fire("Error", "You can´t privileges", "error");
    }
  };

  const startLoadingEvents = async () => {
    const token = localStorage.getItem("jwt-token");
    try {
      const request = await fetch(`${import.meta.env.VITE_API_URL}/events`, {
        method: "GET",
        headers: { "Content-type": "application/json", "jwt-token": token },
      });

      if (request.status === 200) {
        const response = await request.json();
        const events = convertEventsToDateEvents(response.msg);
        dispatch(onLoadingEvents(events));
      }
    } catch (error) {
      console.log("Error loading events");
      console.log(error);
    }
  };
  return {
    events,
    activeEvent,
    setActiveEvent,
    startSavingEvent,
    startDeletingEvent,
    startLoadingEvents,
  };
};
