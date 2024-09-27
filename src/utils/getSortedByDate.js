import {compareAsc, compareDesc} from "date-fns";
import { cloneDeep } from "lodash";

export const toGameDate = (dateRaw) => {
    const dateArr = dateRaw.split("/");

    return new Date(2000 + parseInt(dateArr[2]), parseInt(dateArr[1]) - 1, parseInt(dateArr[0]));
}

export const getSortedByDate = (data, sortAsc) => {
    const result = cloneDeep(data).sort((e1, e2) => {
        return sortAsc ? compareAsc(toGameDate(e1.Date), toGameDate(e2.Date)) : compareDesc(toGameDate(e1.Date), toGameDate(e2.Date));
    });

    return result;
};
