import { getItemsInEntries } from "../utils/getItemsInEntries";
import { getSortedByDate } from "../utils/getSortedByDate";

const initializeList = (lastConsecutiveEntries) => {
    const items = getItemsInEntries(lastConsecutiveEntries);
    const list = items.map(item => {
        return {
            number: item
        }
    })

    return list;
}

const filterByNonStrictConsecutiveFrequency = ({
    list,
    data,
    nonStrictConsecutiveFrequencyData,
}) => {

    list.forEach(listItem => {
        const number = listItem.number;


    })

    return list;
}

export const getSuggestedNumbers = ({
    data,
    occuranceFrequencyData,
    strictConsecutiveFrequencyData,
    nonStrictConsecutiveFrequencyData,
    consecutiveWeeksCount
}) => {
    // Get last entries sorted from the oldest up
    const lastConsecutiveEntries = getSortedByDate( data.slice(0, consecutiveWeeksCount), true);
    let list = initializeList(lastConsecutiveEntries);

    list = filterByNonStrictConsecutiveFrequency({
        list,
        data: lastConsecutiveEntries,
        nonStrictConsecutiveFrequencyData,
    })

    return list;
}