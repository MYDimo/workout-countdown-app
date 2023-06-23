export default function formatDuration(milliseconds) {
  // const seconds = Math.floor((milliseconds/1000) % 60);
  const minutes = Math.floor((milliseconds/1000/60) % 60);
  const hours = Math.floor((milliseconds/1000/60/60) % 60);

  return `${hours.toString()}h and ${minutes.toString()}m`;
}