import { isItem } from "./isItem";

export const isInEntry = (item, entry, useSupplemental) => {
    const entryItems = [];

    Object.keys(entry).map(key => {
        if (isItem(key, useSupplemental)) {
            entryItems.push(entry[key]) 
        }
    })

    return entryItems.indexOf(item) > -1;
}