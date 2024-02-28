import { useEffect, useState } from "react";
import { addHours } from "date-fns";
import Modal from "react-modal";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as Yup from "yup";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useCalendarStore, useUiStore } from "../../hooks";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

export const CalendarModal = () => {
  const { closeDateModal, isDateModalOpen } = useUiStore();
  const { activeEvent, startSavingEvent, startDeletingEvent } =
    useCalendarStore();
  const [errorDate, setErrorDate] = useState(false);

  const {
    handleChange,
    handleSubmit,
    resetForm,
    values,
    errors,
    setFormikState,
  } = useFormik({
    initialValues: {
      title: "",
      notes: "",
      start: new Date(),
      end: addHours(new Date(), 1),
    },
    validateOnChange: false,
    onSubmit: async (values) => {
      if (values.title !== "")
        Swal.fire("Well done!", "Event appointed!", "success");

      setErrorDate(false);

      await startSavingEvent(values);

      closeDateModal();

      resetForm();
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Title is required")
        .min(3, "The title should be larger"),
      start: Yup.date().default(() => new Date()),
      end: Yup.date().when(
        "start",
        (start, schema) =>
          start && schema.min(start, `End day should be later than start day`)
      ),
    }),
  });

  if (errors?.end && !errorDate) {
    Swal.fire(
      "Wrong Date",
      `Review date, ${errors.end.toLowerCase()}`,
      "error"
    );
    setErrorDate(true);
  }
  useEffect(() => {
    if (activeEvent !== null) {
      setFormikState({
        values: {
          ...activeEvent,
        },
      });
    }
  }, [activeEvent]);

  const onDeleteEvent = () => {
    startDeletingEvent();
    closeDateModal();
    Swal.fire("Event deleted!", "Your event was removed", "success");
  };
  return (
    <Modal
      isOpen={isDateModalOpen}
      onRequestClose={closeDateModal}
      style={customStyles}
      className="modal"
      overlayClassName="modal-fondo"
      closeTimeoutMS={200}
    >
      <div className="d-flex justify-content-between">
        <h1>New event</h1>
        {activeEvent?._id && (
          <button
            onClick={onDeleteEvent}
            className="btn btn-outline-danger btn-block p-1 d-flex align-items-center "
          >
            <i className="fa-solid fa-trash-can fs-4 me-2"></i>
            <span>Delete</span>
          </button>
        )}
      </div>

      <hr />
      <form className="container" onSubmit={handleSubmit}>
        <div className="form-group mb-2 d-flex flex-column">
          <label className="me-1">Day and start hour</label>
          <DatePicker
            selected={values.start}
            minDate={Date.now()}
            onChange={(date) =>
              handleChange({ target: { name: "start", value: date } })
            }
            name="start"
            className={`form-control ${errors?.end && "is-invalid"}`}
            dateFormat="Pp"
            showTimeSelect
          />
        </div>

        <div className="form-group mb-2 d-flex flex-column">
          <label className="me-1">Day and end hour</label>
          <DatePicker
            selected={values.end}
            minDate={values.start}
            onChange={(date) => {
              handleChange({ target: { name: "end", value: date } });
            }}
            name="end"
            className={`form-control ${errors?.end && "is-invalid"}`}
            dateFormat="Pp"
            showTimeSelect
          />
        </div>
        {errors?.end && (
          <div className="rounded-2 p-1 fs-6 mt-1  d-flex align-items-center gap-2">
            <i className="fa-solid fa-circle-exclamation text-danger"></i>
            <div className="text-danger">{errors.end}</div>
          </div>
        )}
        <hr />
        <div className="form-group mb-2">
          <label>Title and notes</label>
          <input
            type="text"
            className={`form-control ${errors?.title && "is-invalid"}`}
            placeholder="Event title"
            name="title"
            value={values.title}
            autoComplete="off"
            onChange={handleChange}
          />
          {errors?.title && (
            <div className="rounded-2 p-1 fs-6 mt-1 w-50 d-flex align-items-center gap-2">
              <i className="fa-solid fa-circle-exclamation text-danger"></i>
              <div className="text-danger">{errors?.title}</div>
            </div>
          )}
          <small id="emailHelp" className="form-text text-muted">
            Short description
          </small>
        </div>

        <div className="form-group mb-2">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notes"
            label="HOLA"
            rows="5"
            value={values.notes}
            name="notes"
            onChange={handleChange}
          ></textarea>

          <small id="emailHelp" className="form-text text-muted">
            Adittional information
          </small>
        </div>

        <button type="submit" className="btn btn-outline-primary btn-block">
          <i className="far fa-save"></i>
          <span> Save</span>
        </button>
      </form>
    </Modal>
  );
};
