export const CalendarEvent = ({ event }) => {
  const { title, user } = !!event && event;
  return (
    <>
      <strong>{title}</strong>
      <span className="ms-1"> - {user?.name}</span>
    </>
  );
};
