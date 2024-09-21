import _ from "lodash";

export const findItemIndexInFreqList = (freqList, item) => _.findIndex(freqList, (freqEntryItem) => {
    const result = freqEntryItem.number === item

    // console.log(`freqEntryItem.number = ${freqEntryItem.number}, ${typeof freqEntryItem.number}; item = ${item},  ${typeof item}`)

    return result
});