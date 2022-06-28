export async function getDateFromChatString(date: string): Promise<Date> {
    return new Promise((resolvePromise, rejectPromise) => {
        try {
            if (typeof date === 'string') {
                const YYYY = date.match(/[0-9][0-9][0-9][0-9]/)!.toString();
                const DD = date.match(/[0-9][0-9]/)!.toString();
                const monthList = [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                ];
                let MM: number = monthList.indexOf(
                    date
                        .match(/January|February|March|April|May|June|July|August|September|October|November|December/)!
                        .toString()
                );
                if (MM.toString().length == 1) MM = parseInt(`0${MM}`);
                let time: string;
                let hours: number;
                let minutes: number;
                let seconds: number;
                // regex source: https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s06.html
                time = date.match(/(1[0-2]|0?[1-9]):([0-5]?[0-9]):([0-5]?[0-9])/)!.toString();
                const hoursWithoutPM = parseInt(
                    time
                        .match(/^(1[0-2]|0?[1-9])/)!
                        .toString()
                        .replace(':', '')
                );
                if (date.match('PM')) {
                    hours = hoursWithoutPM + 12;
                } else {
                    hours = hoursWithoutPM;
                }
                time = time.replace(/^(1[0-2]|0?[1-9]):/, '');
                minutes = parseInt(time.match(/^([0-5]?[0-9])/)!.toString());
                time = time.replace(/^([0-5]?[0-9]):/, '');
                seconds = parseInt(time.toString()!);
                const finalDate: Date = new Date(Date.UTC(parseInt(YYYY), MM, parseInt(DD), hours, minutes, seconds, 0));
                resolvePromise(finalDate);
            } else {
                throw new TypeError(`Expected date to be type of string!`);
            }
        } catch (error) {
            rejectPromise(error);
        }
    });
}
