export async function getDateFromChatString(date: string): Promise<Date> {
    return new Promise((resolvePromise, rejectPromise) => {
        try {
            if (date) {
                const YYYY = date.match(/[0-9][0-9][0-9][0-9]/)!.toString();
                const DD = date.match(/[0-9][0-9]/)!.toString();
                const monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                let MM: string | number = monthList.indexOf(
                    date.match(/January|February|March|April|May|June|July|August|September|October|November|December/)!.toString()
                ) + 1;
                if (MM.toString().length == 1) MM = `0${MM}`;
                let time;
                // regex source: https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s06.html
                if (!date.match('PM')) {
                    time = date.match(/(1[0-2]|0?[1-9]):([0-5]?[0-9])/)!.toString();
                    if (time.length === 4) time = `0${time}`;
                } else {
                    time = date.match(/1[0-2]|0?[1-9]:[0-5]?[0-9]/)!.toString();
                    const hoursWithoutPM = date.match(/(1[0-2]|0?[1-9]):[0-5]?[0-9]/)![1].toString().replace(':', '');
                    time = time.replace(/1[0-2]|0?[1-9]/, hoursWithoutPM).toString();
                    if (time.length === 4) time = `0${time}`;
                }
                resolvePromise(new Date(`${YYYY}-${MM}-${DD}T${time}Z`));
            } else {
                throw new TypeError(`Expected date to be type of string!`);
            }

        } catch (error) {
            rejectPromise(error);
        }

    })
}