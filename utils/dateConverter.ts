export const convertToDate = (seconds, nanoseconds) => {
  if (!seconds || !nanoseconds) return;
  const milliseconds = seconds * 1000 + nanoseconds / 1000000;
  return new Date(milliseconds);
};
