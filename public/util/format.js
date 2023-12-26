export function formatToVND(number) {
    const strNumber = String(number);
    const groups = [];
    for (let i = strNumber.length; i > 0; i -= 3) {
        groups.unshift(strNumber.substring(Math.max(i - 3, 0), i));
    }
    return groups.join('.') + ' vnđ';
}
