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

export const generateTickets = ({ suggestedItems, targetEntry, frequencyFactorsData, ticketsNumber, itemsCount, useSupplemental }) => {
    const tickets = [];
    const maxTicketsCount = Math.min(ticketsNumber, selectors.length)

    for (let i = 0; i < maxTicketsCount; i += 1) {
        const ticket = selectors[i].selector({ suggestedItems, itemsCount });
       
        ticket.sort((t1, t2) => t1 - t2);
        const hits = checkTicket(ticket, targetEntry, useSupplemental);

        tickets.push({
            ticket: ticket.join(", "),
            "Hits number": hits.length,
            "Hits": hits.join(", "),
            "By": selectors[i].name
        });
    }

    return tickets.sort((t1, t2) => t2["Hits number"] - t1["Hits number"]);
}