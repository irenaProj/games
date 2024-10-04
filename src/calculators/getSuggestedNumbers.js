import { getItemsInEntries } from "../utils/getItemsInEntries";
import { getSortedByDate } from "../utils/getSortedByDate";

const initializeList = (lastConsecutiveEntries, useSupplemental) => {
    const items = getItemsInEntries(lastConsecutiveEntries, useSupplemental);
    const list = items.map(item => {
        return {
            number: item
        }
    })

    return list;
}

export const getSuggestedNumbers = ({
    data,
    dataStats: {
        occuranceFrequencyData,
        entiesRepeatabilityData,
        strictConsecutiveFrequencyData,
        gapFrequencyData,
        frequencyFactorsData
    },
    settings: { 
        consecutiveWeeksCount,
        minItem,
        maxItem,
        useSupplemental 
    }
}) => {
    // Get last entries sorted from the oldest up
    const dataSortedDesc = getSortedByDate(data, false); // All entries sorted from last, descending
    const lastConsecutiveEntries = getSortedByDate(dataSortedDesc.slice(0, consecutiveWeeksCount), true); // Recent entries, sorted from oldest up
    let list = initializeList(lastConsecutiveEntries, useSupplemental);
    const filteredList = [];

    list.forEach(listItem => {
        if (listItem.number >= minItem && listItem.number <= maxItem) {
            filteredList.push(listItem)
        }
    })

    return {
        suggestedItems: filteredList
    };
}