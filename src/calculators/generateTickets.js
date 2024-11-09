import _ from "lodash";
import { getItemsInEntries } from "../utils/getItemsInEntries";
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


const getLowestAndHighestSelectedItems = ({ ticketsStatsMap, itemsPerTicketCustom, selectedItemsRequiredOccuranceMap, thresholdItem }) => {
    // Transform map into array sorted by the number the item appears in tickets, ascending
    const arr = [];

    Object.keys(ticketsStatsMap).forEach(key => {
        if (key > thresholdItem) {
            arr.push({ number: key, occurancesMissing: selectedItemsRequiredOccuranceMap[key] - ticketsStatsMap[key] })
        }
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

const selectTicketsWithFirstItem = async ({
    item,
    ticketsCountPerFirstItem,
    ticketsStatsMap,
    itemsPerTicketCustom,
    selectedItemsRequiredOccuranceMap,
    allCombinations,
    itemCombinationsInfo,
    usedCombinationsIndex,
    tickets,
    ticketsNumber,
    delay
}) => {
    const { firstIndex, lastIndex, count } = itemCombinationsInfo;
    const itemTicketsRequired = Math.min(selectedItemsRequiredOccuranceMap[item] - ticketsStatsMap[item], ticketsCountPerFirstItem);
    let usedCombinationsWithFirstItem = 0;

    if (itemTicketsRequired <= 0) {
        return;
    }

    for (let i = 0; i < itemTicketsRequired && usedCombinationsWithFirstItem < count;) {
        const checkLowestHighest = tickets.length > ticketsNumber * 0.7;
        const { lowestNumbers, highestNumbers } = checkLowestHighest ? getLowestAndHighestSelectedItems({
            ticketsStatsMap,
            itemsPerTicketCustom,
            selectedItemsRequiredOccuranceMap,
            thresholdItem: item
        }) : { lowestNumbers: [], highestNumbers: [] };

        const combinationIndex = firstIndex + Math.floor(Math.random() * count)
        console.log(`firstIndex ${firstIndex}; lastIndex=${lastIndex} index ${combinationIndex} `);

        if (usedCombinationsIndex.indexOf(combinationIndex) < 0) {
            const combination = allCombinations[combinationIndex];
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
                    i = itemTicketsRequired;
                } else {
                    i += 1;
                    usedCombinationsWithFirstItem += 1;
                }

                console.log(`${i} tickets ready ${new Date().toISOString()} `);
                await sleep(delay)
            }
        }
    }
}


const generateUniformDistributionTickets = async ({
    selectedSuggestedItemsSorted,
    itemsPerTicketCustom,
    allCombinations,
    allCombinationsInfo,
    selectedItemsRequiredOccuranceMap,
    ticketsCountsPerItemInfo,
    ticketsNumber,
}) => {
    const ticketsStatsMap = {};
    const tickets = [];
    const allCombinationsCount = allCombinations.length;
    const usedCombinationsIndex = [];
    const delay = 50;
    const { firstItems, initialSelectionCount, ticketsCountPerFirstItemMap } = ticketsCountsPerItemInfo

    selectedSuggestedItemsSorted.forEach(item => {
        ticketsStatsMap[item] = 0;
    });

    // Select the tickets where the first number is repeated less than 10 times - latest tickets in allCombinations
    for (let i = 1; i <= initialSelectionCount; i += 1) {
        const index = allCombinationsCount - i;
        console.log(`index ${index}`);
        const combination = allCombinations[index];

        for (let k = 0; k < itemsPerTicketCustom; k += 1) {
            ticketsStatsMap[combination[k]] += 1;
        }

        tickets.push(combination)
        console.log(`${i} tickets ready`)
    }

    // For the rest of the tickets: starting with the lowest selected item, select the
    // required number of tickets where the selected item is the first item
    for (let i = 0; i < firstItems.length; i += 1) {
        const item = parseInt(firstItems[i]);

        await selectTicketsWithFirstItem({
            item,
            ticketsCountPerFirstItem: ticketsCountPerFirstItemMap[item],
            ticketsStatsMap,
            itemsPerTicketCustom,
            selectedItemsRequiredOccuranceMap,
            allCombinations,
            itemCombinationsInfo: allCombinationsInfo.itemsMap[item],
            usedCombinationsIndex,
            tickets,
            ticketsNumber,
            delay
        });
    }


    return {
        tickets,
        ticketsStatsMap,
    };
}

const buildRelativePrioritySettingsByMannualSetting = ({
    ticketsNumber,
    priorityPerSelectedSuggestedItem,
    itemsPerTicketCustom,
}) => {
    const selectedSuggestedItemsCount = priorityPerSelectedSuggestedItem.length;
    const minTicketsCount = selectedSuggestedItemsCount / itemsPerTicketCustom;
    const normalPriorityOccurancesPerSelectedSuggestedItem = Math.ceil(ticketsNumber / minTicketsCount);
    const selectedItemsRequiredOccuranceMap = {}

    priorityPerSelectedSuggestedItem.forEach(suggestedItem => {
        const number = suggestedItem.number;
        const itemPriority = _.find(priorityPerSelectedSuggestedItem, (prsi) => prsi.number === number).itemPriority;

        selectedItemsRequiredOccuranceMap[number] = itemPriority * normalPriorityOccurancesPerSelectedSuggestedItem;
    })

    return selectedItemsRequiredOccuranceMap;
}

const buildTicketsNumbersForFirstItems = ({
    allCombinationsInfo,
    priorityPerSelectedSuggestedItem,
    ticketsNumber,
    highestFirstItem
}) => {
    const firstItems = [];
    const ticketsCountPerFirstItemMap = {};

    const initialSelectionCount = Object.keys(allCombinationsInfo.itemsMap).reduce((total, key) => {
        // Sum up the number of tickets where the first number is repeated less than 10 times - latest tickets in allCombinations

        if (key <= highestFirstItem) {
            const itemCount = allCombinationsInfo.itemsMap[key].count;

            if (itemCount < 10) {

                return total + itemCount;
            }

            firstItems.push(parseInt(key));
        }

        return total;
    }, 0);

    const ticketsCountPerFirstItemNoPriority = calculateTicketsCountPerDistinctFirstItem({ ticketsNumber, firstItems });

    firstItems.forEach(item => {
        const itemInfo = priorityPerSelectedSuggestedItem.find(p => p.number === item);

        ticketsCountPerFirstItemMap[item] = itemInfo.itemPriority * ticketsCountPerFirstItemNoPriority;
    })

    return {
        initialSelectionCount,
        firstItems,
        ticketsCountPerFirstItemMap
    }
}

const getAllCombinationsInfo = ({ allCombinations, selectedSuggestedItemsSorted }) => {
    const combinationsCount = allCombinations.length;
    const itemsCount = selectedSuggestedItemsSorted.length;
    const allCombinationsInfo = {
        combinationsCount,
        itemsCount,
        itemsMap: {}
    };
    let itemIndex = 0;
    const itemsMap = allCombinationsInfo.itemsMap;

    for (let i = 0; i < combinationsCount && itemIndex < itemsCount;) {
        const item = selectedSuggestedItemsSorted[itemIndex];

        itemsMap[item] = {
            firstIndex: i
        };

        while (i < combinationsCount && allCombinations[i][0] === item) {
            i += 1;
        }

        itemsMap[item].lastIndex = i - 1;
        itemsMap[item].count = i - itemsMap[item].firstIndex;
        itemIndex += 1;
    }


    return allCombinationsInfo;
}

/**
 * Get the number of ticket per each first number
 * 
 * @param {*} param0 
 */
const calculateTicketsCountPerDistinctFirstItem = ({ ticketsNumber, firstItems }) => {
    const firsItemsCount = firstItems.length;

    return Math.round(ticketsNumber / firsItemsCount)
}

const filterOutByMinDiffBetweenFirstAndLast = (allCombinations, minDiffBetweenFirstAndLast, useNumberAttribute) => {
    const remaining = [];
    if (!allCombinations || !allCombinations.length) {
        return {
            remaining: [],
            dropped: 0
        }
    }
    
    const length = allCombinations[0].length;
    let dropped = 0;

    allCombinations.forEach(combination => {
        let diff = 0;

        if (useNumberAttribute) {
            diff = combination[length - 1].number - combination[0].number;
        } else {
            diff = combination[length - 1] - combination[0]
        }

        if (diff >= minDiffBetweenFirstAndLast) {
            remaining.push(combination)
        } else {
            dropped += 1;
        }
    })

    return {
        remaining,
        dropped
    };
}

const prepareAllValidCombinations = (selectedSuggestedItemsSorted, itemsPerTicketCustom, minDiffBetweenFirstAndLast, useNumberAttribute = false) => {
    const allCombinations = combinationsRecursive(selectedSuggestedItemsSorted, itemsPerTicketCustom);
    const {
        remaining,
        dropped
    } = filterOutByMinDiffBetweenFirstAndLast(allCombinations, minDiffBetweenFirstAndLast, useNumberAttribute);

    console.log(`Dropped due to min/max diff: ${dropped}`)
    return remaining;
}

export const getAllValidCombinationsStatistics = (selectedSuggestedItemsSorted, itemsPerTicketCustom, minDiffBetweenFirstAndLast) => {
    const allCombinations = prepareAllValidCombinations(selectedSuggestedItemsSorted, itemsPerTicketCustom, minDiffBetweenFirstAndLast, true);
    const selectedSuggestedItemsSortedInfo = {};

    selectedSuggestedItemsSorted.forEach(si => {
        selectedSuggestedItemsSortedInfo[si.number] = {
            ticketsWithItem: 0,
            ticketsWithFirstItem: 0,
            inPool: 0,
            notInPool: 0
        };
    });


    allCombinations.forEach(combination => {

        for (let k = 0; k < itemsPerTicketCustom; k += 1) {
            const item = combination[k].number;
            selectedSuggestedItemsSortedInfo[item].ticketsWithItem += 1;

            if (combination[k].isInPool) {
                selectedSuggestedItemsSortedInfo[item].inPool += 1;
            } else {
                selectedSuggestedItemsSortedInfo[item].notInPool += 1;
            }
        }

        selectedSuggestedItemsSortedInfo[combination[0].number].ticketsWithFirstItem += 1;
    })


    return {
        totalTicketsCount: allCombinations.length,
        selectedSuggestedItemsSortedInfo
    }
}

export const generateTickets = async ({
    targetEntry,
    settings,
    ticketsSettings: {
        ticketsNumber,
        priorityPerSelectedSuggestedItem,
        itemsPerTicketCustom,
        highestFirstItem,
        minDiffBetweenFirstAndLast
    }
}) => {
    const {
        useSupplemental,
        gameItemsCount,
        maxItem
    } = settings;
    const selectedSuggestedItemsSorted = getItemsSortedAsc(priorityPerSelectedSuggestedItem);
    const allCombinations = prepareAllValidCombinations(selectedSuggestedItemsSorted, itemsPerTicketCustom, minDiffBetweenFirstAndLast)
    const selectedItemsRequiredOccuranceMap = buildRelativePrioritySettingsByMannualSetting({
        ticketsNumber,
        priorityPerSelectedSuggestedItem,
        itemsPerTicketCustom
    })
    const allCombinationsInfo = getAllCombinationsInfo({
        allCombinations,
        selectedSuggestedItemsSorted,
    });

    // Priority is taken into account in 2 different ways:
    // 1. for tickets first items
    // 2. general number of item used in tickets (first and non first)
    const ticketsCountsPerItemInfo = buildTicketsNumbersForFirstItems({
        allCombinationsInfo,
        priorityPerSelectedSuggestedItem,
        ticketsNumber,
        highestFirstItem
    })

    const {
        tickets,
        ticketsStatsMap
    } = await generateUniformDistributionTickets({
        selectedSuggestedItemsSorted,
        itemsPerTicketCustom,
        allCombinations,
        allCombinationsInfo,
        selectedItemsRequiredOccuranceMap,
        ticketsCountsPerItemInfo,
        ticketsNumber,
    });

    const nonRepeatedTickets = findRepeatedTickets(tickets, itemsPerTicketCustom);


    if (targetEntry) {
        const checkedTickets = nonRepeatedTickets.map((ticket) => ({
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