import { useDispatch, useSelector } from "react-redux";
import {
  clearErrorMessage,
  onChecking,
  onLogin,
  onLogout,
} from "../store/auth/authSlice";
import Swal from "sweetalert2";
import { onLogoutCalendar } from "../store/calendar/calendarSlice";

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const startLogin = async ({ email, password }) => {
    dispatch(onChecking());

    const request = await fetch(`${import.meta.env.VITE_API_URL}/auth`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (request.status === 200) {
      const response = await request.json();
      localStorage.setItem("jwt-token", response.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(
        onLogin({ name: response.payload.name, uid: response.payload._id })
      );
    } else {
      const response = await request.json();
      dispatch(onLogout(response.msg));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const startRegister = async ({ email, name, password }) => {
    dispatch(onChecking());

    const request = await fetch(`${import.meta.env.VITE_API_URL}/auth/new`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    });

    if (request.status === 201) {
      const response = await request.json();

      localStorage.setItem("jwt-token", response.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(
        onLogin({ name: response.payload.name, uid: response.payload._id })
      );
      Swal.fire("Well done!", "User created", "success");
    } else {
      const response = await request.json();
      dispatch(onLogout(response.msg));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const checkAuthToken = async () => {
    const token = localStorage.getItem("jwt-token");

    if (!token) return dispatch(onLogout());

    const request = await fetch(`${import.meta.env.VITE_API_URL}/auth/renew`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "jwt-token": token,
      },
    });
    if (request.status === 200) {
      const response = await request.json();
      localStorage.setItem("jwt-token", response.msg.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(onLogin({ name: response.msg.name, uid: response.msg.uid }));
    } else {
      localStorage.clear();
      dispatch(onLogout());
    }
  };

  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogout());
    dispatch(onLogoutCalendar());
  };

  return {
    status,
    user,
    errorMessage,
    startLogin,
    startRegister,
    checkAuthToken,
    startLogout,
  };
};
