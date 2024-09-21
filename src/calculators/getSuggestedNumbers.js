import _ from "lodash";
import { getItemsInEntries } from "../utils/getItemsInEntries";
import { getSortedByDate } from "../utils/getSortedByDate";
import { findItemIndexInFreqList } from "../utils/findItemIndexInFreqList";

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
    const sortedList = list.sort((listItem1, listItem2) => {
        const occuranceFreqIndex1 = findItemIndexInFreqList(occuranceFrequencyData, listItem1.number);
        const occuranceFreqIndex2 = findItemIndexInFreqList(occuranceFrequencyData, listItem2.number);

        return occuranceFreqIndex1 - occuranceFreqIndex2
    })

    return sortedList;
}

const rateByGapFrequency = ({
    list,
    data,
    gapFrequencyData,
}) => {

    list.forEach(listItem => {
        const number = listItem.number;


    })

    return list;
}

const getItemRatingInLists = ({ listItem, listByOccuranceFrequency, listByGapFrequency }) => {
    const item = listItem.number;
    const rating = findItemIndexInFreqList(listByOccuranceFrequency, item)
    
    return {
        number: item,
        "Occurance Index": rating
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
    const lastConsecutiveEntries = getSortedByDate(data.slice(0, consecutiveWeeksCount), true);
    let list = initializeList(lastConsecutiveEntries);

    const listByOccuranceFrequency = rateByOccuranceFrequency({ list, occuranceFrequencyData })
    const listByGapFrequency = rateByGapFrequency({
        list,
        data: lastConsecutiveEntries,
        gapFrequencyData,
    });
    const itemRatingsMap = [];

    list.forEach(listItem => {
        const itemRatings = getItemRatingInLists({
            listItem,
            listByOccuranceFrequency,
            listByGapFrequency
        });

        itemRatingsMap.push(itemRatings)
    });

    return itemRatingsMap.sort((l1, l2) => l1.number - l2.number);
}