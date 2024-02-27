export const CalendarEvent = ({ event }) => {
  const { title, user } = !!event && event;
  return (
    <div>
      <strong>{title}</strong>
      <span> - {user?.name}</span>
    </div>
  );
};
