import moment from "moment";
export const formatDate = (date: string | Date, format: string): string => {
  return moment(date).format(format);
};
export const commonDateFormatter = (date: string | Date): string => {
  return moment(formatDate(date, "YYYY-MM-DD HH:mm:ss")).fromNow();
};
