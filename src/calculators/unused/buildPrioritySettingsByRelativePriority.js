
const buildPrioritySettingsByRelativePriority = ({
    selectedSuggestedItems,
    dataGroup,
    occurancesPerSelectedSuggestedItem,
    settings: { useSupplemental }
}) => {
    const dataSortedDesc = getSortedByDate(dataGroup, false); // All entries sorted from last, descending
    const last3WeeksItems = getItemsInEntries(getSortedByDate(dataSortedDesc.slice(0, 3), true), useSupplemental); // Recent entries, sorted from oldest up
    const last2WeeksItems = getItemsInEntries(getSortedByDate(dataSortedDesc.slice(0, 2), true), useSupplemental); // Recent entries, sorted from oldest up
    const selectedItemsRequiredOccuranceMap = {}

    selectedSuggestedItems.forEach(suggestedItem => {
        const number = suggestedItem.number;

        if (last2WeeksItems.indexOf(number) > -1) {
            selectedItemsRequiredOccuranceMap[number] = occurancesPerSelectedSuggestedItem * 1.4;
        } else if (last3WeeksItems.indexOf(number) > -1) {
            selectedItemsRequiredOccuranceMap[number] = occurancesPerSelectedSuggestedItem * 1.2;
        } else {
            selectedItemsRequiredOccuranceMap[number] = occurancesPerSelectedSuggestedItem
        }
    })

    return selectedItemsRequiredOccuranceMap;
}