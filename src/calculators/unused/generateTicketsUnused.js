const getLowestFreqValueSelector = ({ suggestedItems, itemsCount }) => {
    const sorted = suggestedItems.sort((si1, si2) => si1["Freq Value"] - si2["Freq Value"]);
    const items = []

    for (let i = 0; i < itemsCount; i += 1) {
        items.push(sorted[i].number);
    }

    return items;
}

const getHighestFreqValueSelector = ({ suggestedItems, itemsCount }) => {
    const sorted = suggestedItems.sort((si1, si2) => si2["Freq Value"] - si1["Freq Value"]);
    const items = []

    for (let i = 0; i < itemsCount; i += 1) {
        items.push(sorted[i].number);
    }

    return items;
}



const getLowestOccuranceIndexSelector = ({ suggestedItems, itemsCount }) => {
    const sorted = suggestedItems.sort((si1, si2) => si1["Occurance Index"] - si2["Occurance Index"]);
    const items = []

    for (let i = 0; i < itemsCount; i += 1) {
        items.push(sorted[i].number);
    }

    return items;
}

const getHighestOccuranceIndexSelector = ({ suggestedItems, itemsCount }) => {
    const sorted = suggestedItems.sort((si1, si2) => si2["Occurance Index"] - si1["Occurance Index"]);
    const items = []

    for (let i = 0; i < itemsCount; i += 1) {
        items.push(sorted[i].number);
    }

    return items;
}
/**
 *      "Occurance Index": ratingByOccurance,
        "Freq Value": ratingByFreq,
        "Freq Meta": listByFrequency[ratingByFreq].meta,
        "Averaged Rating": averagedRating
 */
const selectors = [
    {
        selector:getLowestFreqValueSelector,
        name: "Lowest freq"
    },
    {
        selector:getHighestFreqValueSelector,
        name: "Highest freq"
    },
    {
        selector:getLowestOccuranceIndexSelector,
        name: "Lowest occurance index"
    },
    {
        selector:getHighestOccuranceIndexSelector,
        name: "Highest occurance index"
    }
]