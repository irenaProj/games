import { isItem } from "./isItem";

export const isInEntry = (item, entry) => {
    const entryItems = [];

    Object.keys(entry).map(key => {
        if (isItem(key)) {
            entryItems.push(entry[key]) 
        }
    })

    return entryItems.indexOf(item) > -1;
}