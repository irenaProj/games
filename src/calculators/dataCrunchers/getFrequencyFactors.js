import { getSortedByDate } from "../../utils/getSortedByDate";
import { isInEntry } from "../../utils/isInEntry";

export const getFrequencyFactors = (
    data,
    occuranceFrequencyData,
    useSupplemental
) => {
    const dataSortedDesc = getSortedByDate(data, false);
    const frequencyFactorsList = [];
    const entriesCount = dataSortedDesc.length;

    occuranceFrequencyData.forEach(itemOccuranceFrequency => {
       const {number, freq} = itemOccuranceFrequency;
        const expectedNumberOfGapEntries = freq ? entriesCount / freq : 10000;

       // How many entries ago occurred last time
       const lastOccuranceIndex = _.findIndex(dataSortedDesc, (entry) => isInEntry(number, entry, useSupplemental));
       const occuranceExpectancy = lastOccuranceIndex > -1 ? lastOccuranceIndex / expectedNumberOfGapEntries : 0;

       frequencyFactorsList.push({
        number,
        occuranceExpectancy,
        meta: JSON.stringify({
            expectedNumberOfGapEntries,
            lastOccuranceIndex
        })
       })
    })

    return frequencyFactorsList.sort((li1, li2) => li2.occuranceExpectancy - li1.occuranceExpectancy);
}