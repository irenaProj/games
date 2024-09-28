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

export const getGenerateTickets = ({ suggestedItems, targetEntry, frequencyFactorsData, ticketsNumber, itemsCount, useSupplemental }) => {
    const tickets = [];

    for (let i = 0; i < ticketsNumber; i += 1) {
        let items = suggestedItems.map(si => si.number);
        const ticket = [];

        for (let j = 0; j < itemsCount; j += 1) {
            const count = items.length;
            const index = Math.floor(Math.random() * count)

            ticket.push(items[index]);
            items.splice(index, 1)
        }
        ticket.sort((t1, t2) => t1 - t2);
        const hits = checkTicket(ticket, targetEntry, useSupplemental);

        tickets.push({
            ticket: ticket.join(", "),
            "Hits number": hits.length,
            "Hits": hits.join(", ")
        });
    }

    return tickets;
}