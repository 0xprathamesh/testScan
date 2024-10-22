export const parseAddress = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};
export const parseHash = (hash: string) => {
  return hash.slice(0, 6) + "...";
};
export const parseData = (data: string) => {
  return data.slice(0);
};
export const formatNumber = (num: any) => {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M"; // Millions
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K"; // Thousands
  }
  return num; // Less than 1000
};
export const formatUSDValue = (value: number | undefined) => {
  if (value === undefined) return "USD value unavailable";

  // Ensure all values are shown in decimal format (8 decimal places)
  return `$${value.toFixed(8)}`;
};
