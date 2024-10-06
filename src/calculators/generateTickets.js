import { getItemsInEntries } from "../utils/getItemsInEntries";

const checkTicket = (ticket, targetEntry, useSupplemental) => {
    if (!targetEntry || !ticket) {
        return []
    }
    const targetEntryItems = getItemsInEntries([targetEntry], useSupplemental);
    const hits = [];

    targetEntryItems.forEach(targetEntryItem => {
        const itemIndex = ticket.indexOf(targetEntryItem);

        if (itemIndex > -1) {
            hits.push(targetEntryItem)
        }
    })

    return hits;
}

export const generateTickets = ({ suggestedItems, targetEntry, frequencyFactorsData, ticketsNumber, itemsCount, useSupplemental }) => {

}