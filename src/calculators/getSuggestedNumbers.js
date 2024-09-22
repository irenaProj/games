import _ from "lodash";
import { getItemsInEntries } from "../utils/getItemsInEntries";
import { getSortedByDate } from "../utils/getSortedByDate";
import { findItemIndexInFreqList } from "../utils/findItemIndexInFreqList";
import { isItem } from "../utils/isItem";

const initializeList = (lastConsecutiveEntries) => {
    const items = getItemsInEntries(lastConsecutiveEntries);
    const list = items.map(item => {
        return {
            number: item
        }
    })

    return list;
}

const rateByOccuranceFrequency = ({
    list,
    occuranceFrequencyData,
}) => {
    const sortedList = _.cloneDeep(list).sort((listItem1, listItem2) => {
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
    list,
    lastConsecutiveEntries,
    strictConsecutiveFrequencyData,
    gapFrequencyData,
    consecutiveWeeksCount
}) => {
    const freqMap = {}

    lastConsecutiveEntries.forEach((entry, index) => {
        Object.keys(entry).forEach(key => {
            if (isItem(key)) {
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

    const resultList = _.cloneDeep(list).map(listItem => {
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
    strictConsecutiveFrequencyData,
    entiesRepeatabilityData,
    gapFrequencyData,
    consecutiveWeeksCount
}) => {
    // Get last entries sorted from the oldest up
    const allDataSorted = getSortedByDate(data, false); // All entries sorted from last, descending
    const lastConsecutiveEntries = getSortedByDate(allDataSorted.slice(0, consecutiveWeeksCount), true); // Recent entries, sorted from oldest up
    let list = initializeList(lastConsecutiveEntries);

    const listByOccuranceFrequency = rateByOccuranceFrequency({ list, occuranceFrequencyData })
    const listByFrequency = rateByFrequency({
        list,
        lastConsecutiveEntries,
        strictConsecutiveFrequencyData,
        gapFrequencyData,
        consecutiveWeeksCount
    });
    const itemRatingsMap = [];

    list.forEach(listItem => {
        const itemRatings = getItemRatingInLists({
            listItem,
            listByOccuranceFrequency,
            listByFrequency
        });

        itemRatingsMap.push(itemRatings)
    });

    return itemRatingsMap.sort((l1, l2) => l1["Averaged Rating"] - l2["Averaged Rating"]);
}