import {compareAsc, compareDesc} from "date-fns";

const toDate = (dateRaw) => {
    const dateArr = dateRaw.split("/");

    return new Date(2000 + parseInt(dateArr[2]), parseInt(dateArr[1]) - 1, parseInt(dateArr[0]));
}

export const getSortedByDate = (data, sortAsc) => {
    const result = data.sort((e1, e2) => {
        return !sortAsc ? compareAsc(toDate(e1.Date), toDate(e2.Date)) : compareDesc(toDate(e1.Date), toDate(e2.Date));
    });

    return result;
};
