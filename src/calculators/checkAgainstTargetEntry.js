import { getItemsInEntries } from "../utils/getItemsInEntries"

export const checkAgainstTargetEntry = ({
    suggestedItems,
    targetEntry,
    useSupplemental
}) => {
    if (!targetEntry || !suggestedItems) {
        return []
    }
    const targetEntryItems = getItemsInEntries([targetEntry], useSupplemental);
    const hits = [];

    targetEntryItems.forEach(targetEntryItem => {
        const suggestedItem = suggestedItems.find(si => si.number === targetEntryItem)
        
        if (suggestedItem) {
            hits.push({
                "Suggestion Index": "TBD",
                ...suggestedItem,
            })
        }
    })

    return hits;
}