interface ValidateNumberErrors {
    baseError?: string
    maxValueError?: string
    minValueError?: string
    negativeError?: string
    wholeError?: string
}

export function validateIsNumber(value: string, setError: (value: string) => void, maxNumber: number, mustBeWhole?: boolean, errors?: ValidateNumberErrors, minNumber?: number): boolean {
    if (value == undefined || value.length == 0) {
        setError(""); 
        return true;
    }

    if(isNaN(Number(value))) {
        setError(errors?.baseError ?? "Zadejte číslo");
        return false;
    }

    if(Number(value) > maxNumber) {
        setError(errors?.maxValueError ?? `Číslo nesmí být větší než-li ${maxNumber}`);
        return false;
    }

    if(Number(value) < 0) {
        setError(errors?.negativeError ?? "Číslo nesmí být menší než-li 0");
        return false;
    }

    if(minNumber && Number(value) < minNumber) {
        setError(errors?.minValueError ?? `Číslo nesmí být menší než-li ${minNumber}`);
        return false;
    }

    if((String(value).indexOf(".") != -1) && mustBeWhole) {
        setError(errors?.wholeError ?? "Zadejte celé číslo");
        return false;
    }

    if (!mustBeWhole && Number(value) % 1 != 0) {
        setError(errors?.wholeError ?? "Na desetinném místě může být pouze číslo 5.");
        return false;
    }

    setError("");
    return true;
}