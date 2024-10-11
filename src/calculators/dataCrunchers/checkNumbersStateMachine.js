import _ from "lodash";
import { getSortedByDate } from "../../utils/getSortedByDate";
import { getItemsInEntries } from "../../utils/getItemsInEntries";
import { getNumbers } from "../../utils/getNumbers";


const TWO_ENTRIES_STATES = {
    "00": "00",
    "10": "10",
    "01": "01",
    "11": "11"
};

const THREE_ENTRIES_STATES = {
    "000": "000",
    "100": "100",
    "010": "010",
    "001": "001",
    "110": "110",
    "101": "101",
    "011": "011",
    "111": "111",
}

const FOUR_ENTRIES_STATES = {
    "0000": "0000",
    "1000": "1000",
    "0100": "0100",
    "0010": "0010",
    "0001": "0001",
    "1100": "1100",
    "1010": "1010",
    "1001": "1001",
    "0110": "0110",
    "0101": "0101",
    "0011": "0011",
    "1110": "1110",
    "1101": "1101",
    "1011": "1011",
    "0111": "0111",
    "1111": "1111"
}

const ENTRIES_COUNT_TO_STATES_MACHINE_MAP = {
    2: TWO_ENTRIES_STATES,
    3: THREE_ENTRIES_STATES,
    4: FOUR_ENTRIES_STATES
}

export const checkNumbersStateMachine = ({
    oldestEntryDate,
    newestEntryDate,
    entriesInStateMachineCount,
    dataGroup,
    useSupplemental,
    gameItemsCount
}) => {
    const dataSortedAsc = getSortedByDate(dataGroup, true);
    const oldestEntryDateIndex = _.findIndex(dataSortedAsc, (entry => entry.Date === oldestEntryDate));
    const newestEntryDateIndex = _.findIndex(dataSortedAsc, (entry => entry.Date === newestEntryDate));
    const statesCount = newestEntryDateIndex - oldestEntryDateIndex + 1;

    if (statesCount <= entriesInStateMachineCount) {
        return [];
    }

    const numbersStateMachineData = {};
    const stateMachine = ENTRIES_COUNT_TO_STATES_MACHINE_MAP[entriesInStateMachineCount];
    const gameItems = getNumbers(gameItemsCount);
    const itemsToEntriesStatesMap = {};

    gameItems.forEach(item => {
        itemsToEntriesStatesMap[item] = "";
        numbersStateMachineData[item] = {};

        Object.keys(stateMachine).forEach(state => {
            numbersStateMachineData[item][state] = 0;
        })
    })

    for (let i = oldestEntryDateIndex; i <= newestEntryDateIndex; i += 1) {
        const entryItems = getItemsInEntries([dataSortedAsc[i]], useSupplemental);

        gameItems.forEach(item => {
            itemsToEntriesStatesMap[item] += entryItems.indexOf(item) > -1 ? "1" : "0";
        })
    }

    gameItems.forEach(item => {
        const itemStates = itemsToEntriesStatesMap[item];

        for (let i = entriesInStateMachineCount; i < statesCount; i += 1) {
            const state = itemStates.slice(i - entriesInStateMachineCount, i);
            const stateName = stateMachine[state];

            if (!numbersStateMachineData[item][stateName]) {
                numbersStateMachineData[item][stateName] = 0;
            }

            numbersStateMachineData[item][stateName] += 1;
        }
    })

    return Object.keys(numbersStateMachineData).map((item, index) => {
        debugger
        return {
            "number": index + 1,
            ...numbersStateMachineData[item]
        }
    });
}