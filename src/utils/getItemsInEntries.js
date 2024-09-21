import { isItem } from "./isItem";

/**
 * Get non-repeating list of all items in entries
 * 
 * @param {
 * } data 
 */
export const getItemsInEntries = (data) => {
    const list = [];

    data.forEach(entry => {
        Object.keys(entry).forEach(key => {
            if (isItem(key) && list.indexOf(entry[key]) < 0) {
                list.push(entry[key]);
            }
        })
    })

    return list;
}