import _ from "lodash";
import { getItemsInEntries } from "../utils/getItemsInEntries";
import { getSortedByDate } from "../utils/getSortedByDate";
import { sleep } from "../utils/sleep";

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

const getLowestAndHighestSelectedItems = (ticketsStatsMap, itemsPerTicketCustom, selectedItemsRequiredOccuranceMap) => {
    // Transform map into array sorted by the number the item appears in tickets, ascending
    const arr = [];

    Object.keys(ticketsStatsMap).forEach(key => {
        arr.push({ number: key, occurancesMissing: selectedItemsRequiredOccuranceMap[key] - ticketsStatsMap[key] })
    })

    const arrSorted = arr.sort((m1, m2) => m2.occurancesMissing - m1.occurancesMissing);
    const lowestItemsCount = Math.floor(itemsPerTicketCustom / 2);
    const highestItemsCount = Math.floor(itemsPerTicketCustom / 3);
    const arrNegatives = [];

    arrSorted.forEach(content => {
        if (content.occurancesMissing < 0) {
            arrNegatives.push(content);
        }
    })

    return {
        lowestNumbers: arrSorted.slice(0, lowestItemsCount).map(i => parseInt(i.number)),
        highestNumbers: arrNegatives.slice(-highestItemsCount).map(i => parseInt(i.number))
    };
}

const findRepeatedTickets = (tickets, itemsPerTicketCustom) => {
    const nonRepeatedTickets = [];
    const ticketsCount = tickets.length;

    for (let i = 0; i < ticketsCount - 1; i += 1) {
        let uniqueTicket = true;

        for (let j = i + 1; j < ticketsCount && uniqueTicket; j += 1) {
            let repeated = true;

            for (let m = 0; m < itemsPerTicketCustom && repeated; m += 1) {
                if (tickets[j].indexOf(tickets[i][m]) < 0) {
                    repeated = false;
                }
            }

            if (repeated) {
                uniqueTicket = false;
            }
        }

        if (uniqueTicket) {
            nonRepeatedTickets.push(tickets[i])
        }

    }

    return nonRepeatedTickets;
}

const generateUniformDistributionTickets = async ({ selectedSuggestedItemsSorted,
    itemsPerTicketCustom,
    ticketsSettings: {
        ticketsNumber,
    },
    allCombinations,
    selectedItemsRequiredOccuranceMap
}) => {
    const ticketsStatsMap = {};
    const tickets = [];
    const randomSelectionCount = Math.max(1, Math.floor(ticketsNumber / 10));
    const allCombinationsCount = allCombinations.length;
    const usedCombinationsIndex = [];
    const delay = 500;

    selectedSuggestedItemsSorted.forEach(item => {
        ticketsStatsMap[item] = 0;
    });

    // Randomly select a portion of requested tickets
    for (let i = 0; i < randomSelectionCount;) {
        const randomCombinationIndex = Math.floor(Math.random() * allCombinationsCount);

        if (usedCombinationsIndex.indexOf(randomCombinationIndex) < 0) {
            const combination = allCombinations[randomCombinationIndex];

            for (let k = 0; k < itemsPerTicketCustom; k += 1) {
                ticketsStatsMap[combination[k]] += 1;
            }

            tickets.push(combination)
            i += 1;

            await sleep(delay)
            console.log(`${i} tickets ready`)
        }
    }

    // For the rest of the tickets: find the lowest used numbers and use them
    for (let i = randomSelectionCount; i < ticketsNumber;) {
        const { lowestNumbers, highestNumbers } = getLowestAndHighestSelectedItems(ticketsStatsMap, itemsPerTicketCustom, selectedItemsRequiredOccuranceMap);

        const randomCombinationIndex = Math.floor(Math.random() * allCombinationsCount);

        if (usedCombinationsIndex.indexOf(randomCombinationIndex) < 0) {
            const combination = allCombinations[randomCombinationIndex];
            let isContainsRequiredNumbers = true;
            let skipsOverusedNumbers = true;

            lowestNumbers.forEach(number => {
                if (combination.indexOf(number) < 0) {
                    isContainsRequiredNumbers = false;
                }
            });

            highestNumbers.forEach(number => {
                if (combination.indexOf(number) > -1) {
                    skipsOverusedNumbers = false;
                }
            })

            if (isContainsRequiredNumbers && skipsOverusedNumbers) {
                for (let k = 0; k < itemsPerTicketCustom; k += 1) {
                    ticketsStatsMap[combination[k]] += 1;
                }

                tickets.push(combination);

                let isOccurancesPerItemConditionSatisfied = true;

                Object.keys(ticketsStatsMap).forEach(key => {
                    if (ticketsStatsMap[key] < selectedItemsRequiredOccuranceMap[key]) {
                        isOccurancesPerItemConditionSatisfied = false;
                    }
                })

                if (isOccurancesPerItemConditionSatisfied) {
                    // Got enough occurances for each number, done
                    i = ticketsNumber;
                } else {
                    i += 1;
                }

                console.log(`${i} tickets ready ${new Date().toISOString()} `);
                await sleep(delay)
            }
        }
    }


    return {
        tickets,
        ticketsStatsMap,
    };
}

const buildPrioritySettingsByRelativePriority = ({
    selectedSuggestedItems,
    dataGroup,
    occurancesPerSelectedSuggestedItem,
    settings: { useSupplemental }
}) => {
    const dataSortedDesc = getSortedByDate(dataGroup, false); // All entries sorted from last, descending
    const last3WeeksItems = getItemsInEntries(getSortedByDate(dataSortedDesc.slice(0, 3), true), useSupplemental); // Recent entries, sorted from oldest up
    const last2WeeksItems = getItemsInEntries(getSortedByDate(dataSortedDesc.slice(0, 2), true), useSupplemental); // Recent entries, sorted from oldest up
    const selectedItemsRequiredOccuranceMap = {}

    selectedSuggestedItems.forEach(suggestedItem => {
        const number = suggestedItem.number;

        if (last2WeeksItems.indexOf(number) > -1) {
            selectedItemsRequiredOccuranceMap[number] = occurancesPerSelectedSuggestedItem * 1.4;
        } else if (last3WeeksItems.indexOf(number) > -1) {
            selectedItemsRequiredOccuranceMap[number] = occurancesPerSelectedSuggestedItem * 1.2;
        } else {
            selectedItemsRequiredOccuranceMap[number] = occurancesPerSelectedSuggestedItem
        }
    })

    return selectedItemsRequiredOccuranceMap;
}

const buildRelativePrioritySettingsByMannualSetting = ({
    selectedSuggestedItems,
    ticketsNumber,
    priorityPerSelectedSuggestedItem,
    itemsPerTicketCustom
}) => {
    const selectedSuggestedItemsCount = selectedSuggestedItems.length;
    const minTicketsCount = selectedSuggestedItemsCount / itemsPerTicketCustom;
    const normalPriorityOccurancesPerSelectedSuggestedItem = Math.ceil(ticketsNumber / minTicketsCount);
    const selectedItemsRequiredOccuranceMap = {}

    selectedSuggestedItems.forEach(suggestedItem => {
        const number = suggestedItem.number;
        const itemPriority = _.find(priorityPerSelectedSuggestedItem, (prsi) => prsi.number === number).itemPriority;

        selectedItemsRequiredOccuranceMap[number] = itemPriority * normalPriorityOccurancesPerSelectedSuggestedItem;
    })

    return selectedItemsRequiredOccuranceMap;
}

export const generateTickets = async ({ selectedSuggestedItems, targetEntry, dataStats, settings,
    dataGroup,
    ticketsSettings: {
        ticketsNumber,
        occurancesPerSelectedSuggestedItem,
        useRelativePriority,
        priorityPerSelectedSuggestedItem,
        itemsPerTicketCustom,
    } }) => {
    const {
        useSupplemental
    } = settings;
    const selectedSuggestedItemsSorted = getItemsSortedAsc(selectedSuggestedItems);
    const allCombinations = combinationsRecursive(selectedSuggestedItemsSorted, itemsPerTicketCustom);
    const selectedItemsRequiredOccuranceMap = useRelativePriority ? buildPrioritySettingsByRelativePriority({
        selectedSuggestedItems,
        dataGroup,
        occurancesPerSelectedSuggestedItem,
        settings
    }) : buildRelativePrioritySettingsByMannualSetting({
        selectedSuggestedItems,
        ticketsNumber,
        priorityPerSelectedSuggestedItem,
        itemsPerTicketCustom
    })

    const {
        tickets,
        ticketsStatsMap
    } = await generateUniformDistributionTickets({
        selectedSuggestedItemsSorted, itemsPerTicketCustom, ticketsSettings: {
            ticketsNumber,
            occurancesPerSelectedSuggestedItem
        },
        allCombinations,
        selectedItemsRequiredOccuranceMap
    });

    const nonRepeatedTickets = findRepeatedTickets(tickets, itemsPerTicketCustom)

    if (targetEntry) {
        const checkedTickets = nonRepeatedTickets.map((ticket, index) => ({
            hits: JSON.stringify(checkTicket(ticket, targetEntry, useSupplemental)),
            ...ticket,
        }));


        return {
            tickets: checkedTickets.sort((ch1, ch2) => ch2.hits.length - ch1.hits.length).map((ticket, index) => ({ ...ticket, index: index + 1 })),
            ticketsStatsMap,
        };
    }

    return {
        tickets: nonRepeatedTickets.map((ticket, index) => ({
            index: index + 1,
            ...ticket,
        })),
        ticketsStatsMap,
    };
}