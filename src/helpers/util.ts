export function isEmpty(variable: any) {
    if (variable === undefined || variable === null) {
        return true;
    }

    return false;
}

export function isInvalidNumber(variable: unknown) {
    return typeof variable !== 'number' || isNaN(variable);
}