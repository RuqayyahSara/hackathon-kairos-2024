export const getFormattedTime = (milliseconds) => {
  const total_seconds = parseInt(Math.floor(milliseconds / 1000));
  const total_minutes = parseInt(Math.floor(total_seconds / 60));
  const total_hours = parseInt(Math.floor(total_minutes / 60));

  const seconds = parseInt(Math.floor(total_seconds % 60));
  const minutes = parseInt(Math.floor(total_minutes % 60));
  const hours = parseInt(Math.floor(total_hours % 24));

  return `${hours}: ${minutes}: ${seconds}`;
};

export const minutesRemain = (milliseconds) => {
  const total_seconds = parseInt(Math.floor(milliseconds / 1000));
  const total_minutes = parseInt(Math.floor(total_seconds / 60));

  const seconds = parseInt(Math.floor(total_seconds % 60));
  const minutes = parseInt(Math.floor(total_minutes % 60));
  return 20 - minutes;
};
