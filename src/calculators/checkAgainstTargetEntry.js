import { findIndex } from "lodash";
import { getItemsInEntries } from "../utils/getItemsInEntries"

export const checkAgainstTargetEntry = ({
    suggestedItems,
    targetEntry
}) => {
    if (!targetEntry || !suggestedItems) {
        return []
    }
    const targetEntryItems = getItemsInEntries([targetEntry]);
    const hits = [];

    targetEntryItems.forEach(targetEntryItem => {
        const suggestedItem = suggestedItems.find(si => si.number === targetEntryItem)
        const suggestionIndex = findIndex(suggestedItems, si => si.number === targetEntryItem)
        
        if (suggestedItem) {
            hits.push({
                "Suggestion Index": suggestionIndex,
                ...suggestedItem,
            })
        }
    })

    return hits;
}