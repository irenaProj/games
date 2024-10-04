import { findItemIndexInFreqList } from "../../utils/findItemIndexInFreqList";
import { isItem } from "../../utils/isItem";

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


// const listByOccuranceFrequency = rateByOccuranceFrequency({
//     filteredList,
//     occuranceFrequencyData,
// })
// const listByFrequency = rateByFrequency({
//     filteredList,
//     lastConsecutiveEntries,
//     strictConsecutiveFrequencyData,
//     gapFrequencyData,
//     consecutiveWeeksCount,
//     useSupplemental
// });
// const itemRatingsMap = [];

// filteredList.forEach(listItem => {
//     const itemRatings = getItemRatingInLists({
//         listItem,
//         listByOccuranceFrequency,
//         listByFrequency
//     });

//     itemRatingsMap.push(itemRatings)
// });