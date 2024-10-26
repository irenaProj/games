const generateEvenlySpacedDistributionTickets = async ({ selectedSuggestedItemsSorted,
    itemsPerTicketCustom,
    ticketsSettings: {
        ticketsNumber,
    },
    allCombinations,
}) => {
    const ticketsStatsMap = {};
    const tickets = [];
    const allCombinationsCount = allCombinations.length;
    const usedCombinationsIndex = [];
    const delay = 500;
    const gap = allCombinationsCount / ticketsNumber;

    selectedSuggestedItemsSorted.forEach(item => {
        ticketsStatsMap[item] = 0;
    });


    for (let i = 0; i < ticketsNumber;) {
        const combinationIndex = Math.random() < 0.5 ? Math.floor(i * gap) : Math.ceil(i * gap);
        console.log(`total ${allCombinationsCount} index ${combinationIndex} `);

        if (usedCombinationsIndex.indexOf(combinationIndex) < 0) {
            const combination = allCombinations[combinationIndex];

            for (let k = 0; k < itemsPerTicketCustom; k += 1) {
                ticketsStatsMap[combination[k]] += 1;
            }

            tickets.push(combination)
            i += 1;

            // await sleep(delay)
            console.log(`${i} tickets ready: ${JSON.stringify(combination)}`)
        }
    }

    return {
        tickets,
        ticketsStatsMap,
    };
}
