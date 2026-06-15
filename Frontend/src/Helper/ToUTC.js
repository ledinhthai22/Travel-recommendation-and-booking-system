export const toUTC = (datetimeLocal) => {
  return new Date(datetimeLocal).toISOString();
};