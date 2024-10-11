import _ from "lodash";
import { getSortedByDate } from "../../utils/getSortedByDate";
import { getItemsInEntries } from "../../utils/getItemsInEntries";
import { getNumbers } from "../../utils/getNumbers";


const TWO_ENTRIES_STATES = {
    "00": "a_00",
    "10": "b_10",
    "01": "c_01",
    "11": "d_11"
};

const THREE_ENTRIES_STATES = {
    "000": "a_000",
    "100": "b_100",
    "010": "c_010",
    "001": "d_001",
    "110": "e_110",
    "101": "f_101",
    "011": "e_011",
    "111": "g_111",
}

const FOUR_ENTRIES_STATES = {
    "0000": "a_0000",
    "1000": "b_1000",
    "0100": "c_0100",
    "0010": "d_0010",
    "0001": "e_0001",
    "1100": "f_1100",
    "1010": "e_1010",
    "1001": "g_1001",
    "0110": "h_0110",
    "0101": "i_0101",
    "0011": "j_0011",
    "1110": "k_1110",
    "1101": "l_1101",
    "1011": "m_1011",
    "0111": "n_0111",
    "1111": "o_1111"
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

        Object.values(stateMachine).forEach(state => {
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