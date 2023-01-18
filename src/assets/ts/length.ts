export const LengthCheck = (string:string, targetlen:number, surpass:boolean) => {
    return surpass ? string.length >= targetlen : string.length === targetlen;
}