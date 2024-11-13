
// Date formatter
export const formatDateToYYYYMMDD = (dateString?: Date | string): string => {

    let date;
    if (dateString) {
        date = new Date(dateString);
    } else {
        date = new Date();
    }
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

// Amount format
export const amountFormater = (num: number): string => {
    console.log(num)
    if (num >= 10000000) {
        return (num / 10000000).toFixed(2) + ' Cr';
    } else if (num >= 100000) {
        return (num / 100000).toFixed(2) + ' L';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + ' K';
    } else {
        return num.toString();
    }
}