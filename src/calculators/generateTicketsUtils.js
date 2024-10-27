import { getNumbers } from "../utils/getNumbers"
import { sleep } from "../utils/sleep";

const getUnselectedItems = ({ gameItemsCount, priorityPerSelectedSuggestedItem }) => {
    const unselectedItems = [];
    const selectedItems = priorityPerSelectedSuggestedItem.map(pi => pi.number);

    getNumbers(gameItemsCount).forEach(item => {
        if (selectedItems.indexOf(item) < 0) {
            unselectedItems.push(item);
        }
    })

    return unselectedItems;
}

const replaceItemInTicket = (ticket, replacementItem, itemsPerTicketCustom) => {
    let replacementIndex = -10;
    let index = 0;
    let updatedTicket = null;

    if (replacementItem < ticket[0]) {
        replacementIndex = 0;
    } else if (replacementItem > ticket[itemsPerTicketCustom - 1]) {
        replacementIndex = itemsPerTicketCustom - 1;
    } else {
        while (index < itemsPerTicketCustom - 1) {
            if (replacementItem > ticket[index] && replacementItem < ticket[index + 1]) {
                replacementIndex = index
            }

            index += 1;
        }
    }

    if (replacementIndex > -10) {
        updatedTicket = [...ticket];

        updatedTicket[replacementIndex] = replacementItem;
    }

    return updatedTicket;
}

/**
 * Function removes updated tickets from the original tickets list
 * 
 * @param {*} param0 
 */
export const addUnselectedItemsToTickets = async ({
    updatedTicketsPercentage,
    tickets,
    gameItemsCount,
    itemsPerTicketCustom,
    priorityPerSelectedSuggestedItem,
}) => {
    let ticketsCount = tickets.length;
    const updateCount = Math.floor(updatedTicketsPercentage * ticketsCount);
    const unselectedItems = getUnselectedItems({ gameItemsCount, priorityPerSelectedSuggestedItem });
    const unselectedItemsCount = unselectedItems.length;
    const updatedTickets = [];
    const delay = 50;

    for (let i = 0; i < updateCount; i += 1) {
        const ticketIndex = Math.floor(Math.random() * ticketsCount);
        const replacementItemIndex = Math.floor(Math.random() * unselectedItemsCount);
        const replacementItem = unselectedItems[replacementItemIndex]
        const updatedTicket = replaceItemInTicket(tickets[ticketIndex], replacementItem, itemsPerTicketCustom);

        if (updatedTicket) {
            updatedTickets.push(updatedTicket);
            tickets.splice(ticketIndex, 1)
            ticketsCount -= 1;
        }

        await sleep(delay);
    }

    return {
        ticketsWithUnselectedItems:updatedTickets,
        tickets,
    }
}