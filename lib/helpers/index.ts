export const parseAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
};
export const parseHash = (hash:string) => {
    return hash.slice(0,6) + "...";
}
export const parseData = (data: string) => {
    return data.slice(0)
}