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

const getItemsSortedAsc = (selectedSuggestedItems) => {
    const selectedSuggestedItemsSorted = []

    selectedSuggestedItems.forEach(si => {
        if (si.isPlotted) {
            selectedSuggestedItemsSorted.push(si.number)
        }
    })

    return selectedSuggestedItemsSorted.sort((s1, s2) => s1 - s2);
}

// See https://medium.com/nerd-for-tech/july-2-generating-k-combinations-with-recursion-in-javascript-71ef2b90b44b
const combinationsRecursive = (collection, combinationLength) => {
    let head, tail, result = [];
    if (combinationLength > collection.length || combinationLength < 1) { return []; }
    if (combinationLength === collection.length) { return [collection]; }
    if (combinationLength === 1) { return collection.map(element => [element]); }
    for (let i = 0; i < collection.length - combinationLength + 1; i++) {
        head = collection.slice(i, i + 1);
        tail = combinationsRecursive(collection.slice(i + 1), combinationLength - 1);
        for (let j = 0; j < tail.length; j++) { result.push(head.concat(tail[j])); }
    }
    return result;
}

const getLowestSelectedItems = (occurancesPerItemMap, itemsPerTicket) => {
    // Transform map into array sorted by the number the item appears in tickets, ascending
    const arr = [];

    Object.keys(occurancesPerItemMap).forEach(key => {
        arr.push({ number: key, occurances: occurancesPerItemMap[key] })
    })

    const arrSorted = arr.sort((m1, m2) => m1.occurances - m2.occurances);
    const lowestItemsCount = Math.floor(itemsPerTicket / 2);

    return arrSorted.slice(0, lowestItemsCount).map(i => parseInt(i.number));
}

const generateUniformDistributionTickets = ({ selectedSuggestedItemsSorted, settings: { itemsPerTicket }, ticketsSettings: {
    ticketsNumber,
    occurancesPerSelectedSuggestedItem
}, allCombinations }) => {
    const occurancesPerItemMap = {};
    const tickets = [];
    const randomSelectionCount = Math.max(1, Math.floor(ticketsNumber / 4));
    const allCombinationsCount = allCombinations.length;
    const usedCombinationsIndex = []

    selectedSuggestedItemsSorted.forEach(item => {
        occurancesPerItemMap[item] = 0;
    });

    // Randomly select a quater of requested tickets
    for (let i = 0; i < randomSelectionCount;) {
        const randomCombinationIndex = Math.floor(Math.random() * allCombinationsCount);

        if (usedCombinationsIndex.indexOf(randomCombinationIndex) < 0) {
            const combination = allCombinations[randomCombinationIndex];

            for (let k = 0; k < itemsPerTicket; k += 1) {
                occurancesPerItemMap[combination[k]] += 1;
            }

            tickets.push(combination)
            i += 1;
        }
    }

    // For the rest of the tickets: find the lowest used numbers and use them
    for (let i = randomSelectionCount; i < ticketsNumber;) {
        const lowestNumbers = getLowestSelectedItems(occurancesPerItemMap, itemsPerTicket);

        const randomCombinationIndex = Math.floor(Math.random() * allCombinationsCount);

        if (usedCombinationsIndex.indexOf(randomCombinationIndex) < 0) {
            const combination = allCombinations[randomCombinationIndex];
            let isContainsRequiredNumbers = true;

            lowestNumbers.forEach(number => {
                if (combination.indexOf(number) < 0) {
                    isContainsRequiredNumbers = false;
                }
            });

            if (isContainsRequiredNumbers) {
                for (let k = 0; k < itemsPerTicket; k += 1) {
                    occurancesPerItemMap[combination[k]] += 1;
                }

                tickets.push(combination);
                let isOccurancesPerItemConditionSatisfied = true;

                Object.keys(occurancesPerItemMap).forEach(key => {
                    if (occurancesPerItemMap[key] < occurancesPerSelectedSuggestedItem) {
                        isOccurancesPerItemConditionSatisfied = false;
                    }
                })

                if (isOccurancesPerItemConditionSatisfied) {
                    // Got enough occurances for each number, done
                    i = ticketsNumber;
                } else {
                    i += 1;
                }
            }
        }
    }

    return tickets;
}

export const generateTickets = ({ selectedSuggestedItems, targetEntry, dataStats, settings, ticketsSettings: {
    ticketsNumber,
    occurancesPerSelectedSuggestedItem
} }) => {
    const {
        itemsPerTicket,
        useSupplemental
    } = settings;
    const selectedSuggestedItemsSorted = getItemsSortedAsc(selectedSuggestedItems);
    const allCombinations = combinationsRecursive(selectedSuggestedItemsSorted, itemsPerTicket);

    const tickets = generateUniformDistributionTickets({
        selectedSuggestedItemsSorted, settings, ticketsSettings: {
            ticketsNumber,
            occurancesPerSelectedSuggestedItem
        }, allCombinations
    });

    if (targetEntry) {
        const checkedTickets = tickets.map((ticket, index) => ({
            index,
            hits: JSON.stringify(checkTicket(ticket, targetEntry, useSupplemental)),
            ...ticket,
        }));

        return checkedTickets.sort((ch1, ch2) => ch2.hits.length - ch1.hits.length).map((ticket, index) => ({...ticket, index}));
    }

    return tickets.map((ticket, index) => ({
        index,
        ...ticket,
    }));
}