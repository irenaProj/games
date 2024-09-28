import _ from 'lodash';
import { getItemsInEntries } from "../utils/getItemsInEntries";
import { getSortedByDate } from "../utils/getSortedByDate";
import { findItemIndexInFreqList } from "../utils/findItemIndexInFreqList";
import { isItem } from "../utils/isItem";
import { isInEntry } from '../utils/isInEntry';


const initializeList = (lastConsecutiveEntries, useSupplemental) => {
    const items = getItemsInEntries(lastConsecutiveEntries, useSupplemental);
    const list = items.map(item => {
        return {
            number: item
        }
    })

    return list;
}

const rateByOccuranceFrequency = ({
    filteredList,
    occuranceFrequencyData,
}) => {
    const sortedList = filteredList.sort((listItem1, listItem2) => {
        const occuranceFreqIndex1 = findItemIndexInFreqList(occuranceFrequencyData, listItem1.number);
        const occuranceFreqIndex2 = findItemIndexInFreqList(occuranceFrequencyData, listItem2.number);

        return occuranceFreqIndex1 - occuranceFreqIndex2
    })

    return sortedList;
}

/**
 * For each of the recent entries check the distance to the first future entry.
 * Check strict and gap frequencies for __that distance__ and sum up the values.
 * 
 * Note: this does not sum up all gap and strict freq values, only the values that
 * match the entries distance to the first future entry
 * 
 * @param {*} param0 
 * @returns 
 */
const rateByFrequency = ({
    filteredList,
    lastConsecutiveEntries,
    strictConsecutiveFrequencyData,
    gapFrequencyData,
    consecutiveWeeksCount,
    useSupplemental
}) => {
    const freqMap = {}

    lastConsecutiveEntries.forEach((entry, index) => {
        Object.keys(entry).forEach(key => {
            if (isItem(key, useSupplemental)) {
                const item = entry[key];
                const distanceToNextEntry = consecutiveWeeksCount - index;
                const itemStrictFreqData = strictConsecutiveFrequencyData.find(listItem => listItem.number === item)
                const itemGapFreqyData = gapFrequencyData.find(listItem => listItem.number === item)

                if (!freqMap[item]) {
                    freqMap[item] = []
                }

                if (itemStrictFreqData[distanceToNextEntry]) {
                    freqMap[item].push({
                        type: "strict",
                        distance: distanceToNextEntry,
                        value: itemStrictFreqData[distanceToNextEntry]
                    })
                }

                if (itemGapFreqyData[distanceToNextEntry]) {
                    freqMap[item].push({
                        type: "gap",
                        distance: distanceToNextEntry,
                        value: itemGapFreqyData[distanceToNextEntry]
                    })
                }
            }
        })
    });

    const resultList = filteredList.map(listItem => {
        const item = listItem.number;
        const itemData = freqMap[item];
        const meta = JSON.stringify(freqMap[item])
        const value = itemData.reduce((total, { type, distance, value }) => total + value, 0,)

        return {
            number: item,
            value,
            meta
        }
    })

    return resultList.sort((r1, r2) => r2.value - r1.value);
}

const rateAllItemsByLatestOccurance = ({
    filteredList,
    occuranceFrequencyData,
}) => {

}

const getItemRatingInLists = ({ listItem, listByOccuranceFrequency, listByFrequency }) => {
    const item = listItem.number;
    const ratingByOccurance = findItemIndexInFreqList(listByOccuranceFrequency, item)
    const ratingByFreq = findItemIndexInFreqList(listByFrequency, item);
    const averagedRating = (ratingByOccurance + ratingByFreq) / 2;

    return {
        number: item,
        "Occurance Index": ratingByOccurance,
        "Freq Value": ratingByFreq,
        "Freq Meta": listByFrequency[ratingByFreq].meta,
        "Averaged Rating": averagedRating
    };
};

export const getSuggestedNumbers = ({
    data,
    occuranceFrequencyData,
    frequencyFactorsData,
    strictConsecutiveFrequencyData,
    entiesRepeatabilityData,
    gapFrequencyData,
    consecutiveWeeksCount,
    minItem,
    maxItem,
    useSupplemental
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

    const listByOccuranceFrequency = rateByOccuranceFrequency({
        filteredList,
        occuranceFrequencyData,
    })
    const listByFrequency = rateByFrequency({
        filteredList,
        lastConsecutiveEntries,
        strictConsecutiveFrequencyData,
        gapFrequencyData,
        consecutiveWeeksCount,
        useSupplemental
    });
    const listByOverallOccurance = rateAllItemsByLatestOccurance({
        filteredList,
        frequencyFactorsData,
    });
    const itemRatingsMap = [];

    filteredList.forEach(listItem => {
        const itemRatings = getItemRatingInLists({
            listItem,
            listByOccuranceFrequency,
            listByFrequency
        });

        itemRatingsMap.push(itemRatings)
    });

    return {
        suggestedItems: itemRatingsMap.sort((l1, l2) => l1["Averaged Rating"] - l2["Averaged Rating"])
    };
}