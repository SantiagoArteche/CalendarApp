import { dateFnsLocalizer } from "react-big-calendar";
import { parse, startOfWeek, getDay, format } from "date-fns";
import enUS from "date-fns/locale/en-US";
const locales = {
  "en-US": enUS,
};
export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
