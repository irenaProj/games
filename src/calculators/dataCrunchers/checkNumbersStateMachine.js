import _ from "lodash";
import { getSortedByDate } from "../../utils/getSortedByDate";
import { getItemsInEntries } from "../../utils/getItemsInEntries";
import { getNumbers } from "../../utils/getNumbers";


const TWO_ENTRIES_STATES = {
    "00": "None",
    "10": "First",
    "01": "Second",
    "11": "Both"
};

const THREE_ENTRIES_STATES = {
    "000": "None",
    "100": "First",
    "010": "Second",
    "001": "Third",
    "110": "First and Second",
    "101": "First and Third",
    "011": "Second and Third",
    "111": "All",
}

const FOUR_ENTRIES_STATES = {
    "0000": "None",
    "1000": "First",
    "0100": "Second",
    "0010": "Third",
    "0001": "Fourth",
    "1100": "First and Second",
    "1010": "First and Third",
    "1001": "First and Fourth",
    "0110": "Second and Third",
    "0101": "Second and Fourth",
    "0011": "Third and Fourth",
    "1110": "First, Second and Third",
    "1101": "First, Second and Fourth",
    "1011": "First, Third and Fourth",
    "0111": "Second,Third and Fourth",
    "1111": "All"
}

const ENTRIES_COUNT_TO_STATES_MACHINE_MAP = {
    2: TWO_ENTRIES_STATES,
    3: THREE_ENTRIES_STATES,
    4: FOUR_ENTRIES_STATES
}

export const checkNumbersStateMachine = ({
    oldestEntry,
    newestEntry,
    entriesInStateMachine,
    dataGroup,
    useSupplemental,
    gameItemsCount
}) => {
    const dataSortedAsc = getSortedByDate(dataGroup, true);
    const oldestEntryIndex = _.findIndex(dataSortedAsc, (entry => entry.Date === oldestEntry));
    const newestEntryIndex = _.findIndex(dataSortedAsc, (entry => entry.Date === newestEntry));
    const statesCount = newestEntryIndex - oldestEntryIndex;

    if ( statesCount <= entriesInStateMachine) {
        return [];
    }

    const numbersStateMachineData = {};
    const stateMachine = ENTRIES_COUNT_TO_STATES_MACHINE_MAP[entriesInStateMachine];
    const gameItems = getNumbers(gameItemsCount);
    const itemsToEntriesStatesMap = {};

    gameItems.forEach(item => {
        itemsToEntriesStatesMap[item] = "";
        numbersStateMachineData[item] = {};
    })

    for (let i = oldestEntryIndex; i <= newestEntryIndex; i += 1) {
        const entryItems = getItemsInEntries([dataSortedAsc[i]], useSupplemental);
        
        gameItems.forEach(item => {
            itemsToEntriesStatesMap[item] += entryItems.indexOf(item) > -1 ? "1" : "0";
        })
    }

    gameItems.forEach(item => {
        const itemStates = itemsToEntriesStatesMap[item];

        for (let i = entriesInStateMachine; i < statesCount; i += 1) {
            const state = itemStates.slice(i - entriesInStateMachine, entriesInStateMachine);
            const stateName = stateMachine[state];

            if (!numbersStateMachineData[item][stateName]) {
                numbersStateMachineData[item][stateName] = 0;
            }

            numbersStateMachineData[item][stateName] += 1;
        }
    })

    return Object.keys(numbersStateMachineData).map((numberStateMachineData, index) => ({
        number: index + 1,
        ...numberStateMachineData
    }));
}