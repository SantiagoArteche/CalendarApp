import { useFormik } from "formik";
import "./LoginPage.css";
import { useAuthStore } from "../../hooks";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";
export const LoginPage = () => {
  const { startLogin, errorMessage, startRegister } = useAuthStore();
  const [counter, setCounter] = useState(0);

  const { handleChange, handleSubmit, values, resetForm, errors } = useFormik({
    initialValues: {
      loginPassword: "",
      loginEmail: "",
    },
    validateOnChange: false,
    onSubmit: (data) => {
      startLogin({
        email: data.loginEmail,
        password: data.loginPassword,
      });
      resetForm();
    },
    validationSchema: Yup.object({
      loginPassword: Yup.string().required("Password is required"),
      loginEmail: Yup.string().required("Email is required"),
    }),
  });

  const {
    handleChange: handleChangeRegister,
    handleSubmit: handleSubmitRegister,
    values: valuesRegister,
    resetForm: resetFormRegister,
    errors: errorsRegister,
  } = useFormik({
    initialValues: {
      name: "",
      registerPassword: "",
      registerRepeatPassword: "",
      registerEmail: "",
    },
    validateOnChange: false,
    onSubmit: (data) => {
      if (data.registerPassword !== data.registerRepeatPassword) {
        Swal.fire("Error in register", "Passwords are not equal", "error");
        return;
      }
      if (data.registerPassword.length < 6) {
        Swal.fire(
          "Error in register",
          "Passwords should have at least 6 characters",
          "error"
        );
        return;
      }
      startRegister({
        email: data.registerEmail,
        name: data.name,
        password: data.registerPassword,
      });
      resetFormRegister();
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      registerEmail: Yup.string().required("Email is required"),
      registerPassword: Yup.string().required("Password is required"),
      registerRepeatPassword: Yup.string().required(
        "Repeat Password is required"
      ),
    }),
  });

  useEffect(() => {
    if (errorMessage !== undefined) {
      Swal.fire("Error in auth", errorMessage, "error");
    }
  }, [errorMessage]);

  return (
    <div className="container login-container">
      <div className="row">
        <div className="col-md-6 login-form-1 ">
          <h3>Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-2">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                onChange={handleChange}
                name="loginEmail"
                value={values.loginEmail}
              />

              {errors?.loginEmail && (
                <div className="rounded-2 p-1 fs-6 mt-1  d-flex align-items-center gap-2">
                  <i className="fa-solid fa-circle-exclamation text-danger"></i>
                  <div className="text-danger">{errors.loginEmail}</div>
                </div>
              )}
            </div>
            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                name="loginPassword"
                onChange={handleChange}
                value={values.loginPassword}
              />
              {errors?.loginPassword && (
                <div className="rounded-2 p-1 fs-6 mt-1  d-flex align-items-center gap-2">
                  <i className="fa-solid fa-circle-exclamation text-danger"></i>
                  <div className="text-danger">{errors.loginPassword}</div>
                </div>
              )}
            </div>
            <div className="form-group mb-2">
              <input type="submit" className="btnSubmit" value="Login" />
            </div>
          </form>
        </div>

        <div className="col-md-6 login-form-2">
          <h3>Register</h3>
          <form onSubmit={handleSubmitRegister}>
            <div className="form-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                name="name"
                onChange={handleChangeRegister}
                value={valuesRegister.name}
              />
              {errorsRegister?.name && (
                <div className="rounded-2 p-1 fs-6 mt-1  d-flex align-items-center gap-2">
                  <i className="fa-solid fa-circle-exclamation text-danger"></i>
                  <div className="text-danger">{errorsRegister?.name}</div>
                </div>
              )}
            </div>
            <div className="form-group mb-2">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="registerEmail"
                onChange={handleChangeRegister}
                value={valuesRegister.registerEmail}
              />
              {errorsRegister?.registerEmail && (
                <div className="rounded-2 p-1 fs-6 mt-1  d-flex align-items-center gap-2">
                  <i className="fa-solid fa-circle-exclamation text-danger"></i>
                  <div className="text-danger">
                    {errorsRegister?.registerEmail}
                  </div>
                </div>
              )}
            </div>
            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                name="registerPassword"
                onChange={handleChangeRegister}
                value={valuesRegister.registerPassword}
              />
              {errorsRegister?.registerPassword && (
                <div className="rounded-2 p-1 fs-6 mt-1  d-flex align-items-center gap-2">
                  <i className="fa-solid fa-circle-exclamation text-danger"></i>
                  <div className="text-danger">
                    {errorsRegister?.registerPassword}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group mb-2">
              <input
                type="password"
                className="form-control"
                placeholder="Repeat password"
                name="registerRepeatPassword"
                onChange={handleChangeRegister}
                value={valuesRegister.registerRepeatPassword}
              />
              {errorsRegister?.registerRepeatPassword && (
                <div className="rounded-2 p-1 fs-6 mt-1  d-flex align-items-center gap-2">
                  <i className="fa-solid fa-circle-exclamation text-danger"></i>
                  <div className="text-danger">
                    {errorsRegister?.registerRepeatPassword}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group mb-2">
              <input
                type="submit"
                className="btnSubmit"
                value="Create Account"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
