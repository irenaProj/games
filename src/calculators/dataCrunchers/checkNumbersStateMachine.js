import _ from "lodash";
import { getSortedByDate } from "../../utils/getSortedByDate";
import { getItemsInEntries } from "../../utils/getItemsInEntries";
import { getNumbers } from "../../utils/getNumbers";


const TWO_ENTRIES_STATES = {
    "00": "a_00",
    "10": "a_10",
    "01": "a_01",
    "11": "a_11"
};

const THREE_ENTRIES_STATES = {
    "000": "a_000",
    "100": "a_100",
    "010": "a_010",
    "001": "a_001",
    "110": "a_110",
    "101": "a_101",
    "011": "a_011",
    "111": "a_111",
}

const FOUR_ENTRIES_STATES = {
    "0000": "a_0000",
    "1000": "a_1000",
    "0100": "a_0100",
    "0010": "a_0010",
    "0001": "a_0001",
    "1100": "a_1100",
    "1010": "a_1010",
    "1001": "a_1001",
    "0110": "a_0110",
    "0101": "a_0101",
    "0011": "a_0011",
    "1110": "a_1110",
    "1101": "a_1101",
    "1011": "a_1011",
    "0111": "a_0111",
    "1111": "a_1111"
}

const FIVE_ENTRIES_STATES = {
    "00000": "a_00000",
    "01000": "a_01000",
    "00100": "a_00100",
    "00010": "a_00010",
    "00001": "a_00001",
    "01100": "a_01100",
    "01010": "a_01010",
    "01001": "a_01001",
    "00110": "a_00110",
    "00101": "a_00101",
    "00011": "a_00011",
    "01110": "a_01110",
    "01101": "a_01101",
    "01011": "a_01011",
    "00111": "a_00111",
    "01111": "a_01111",
    "10000": "a_10000",
    "11000": "a_11000",
    "10100": "a_10100",
    "10010": "a_10010",
    "10001": "a_10001",
    "11100": "a_11100",
    "11010": "a_11010",
    "11001": "a_11001",
    "10110": "a_10110",
    "10101": "a_10101",
    "10011": "a_10011",
    "11110": "a_11110",
    "11101": "a_11101",
    "11011": "a_11011",
    "10111": "a_10111",
    "11111": "a_11111"
}

const ENTRIES_COUNT_TO_STATES_MACHINE_MAP = {
    2: TWO_ENTRIES_STATES,
    3: THREE_ENTRIES_STATES,
    4: FOUR_ENTRIES_STATES,
    5: FIVE_ENTRIES_STATES
}

export const checkNumbersStateMachine = ({
    entriesInStateMachineCount,
    dataGroup,
    useSupplemental,
    gameItemsCount
}) => {
    const dataSortedAsc = getSortedByDate(dataGroup, true);
    const statesCount = dataSortedAsc.length;

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

    for (let i = 0; i < statesCount; i += 1) {
        const entryItems = getItemsInEntries([dataSortedAsc[i]], useSupplemental);

        gameItems.forEach(item => {
            itemsToEntriesStatesMap[item] += entryItems.indexOf(item) > -1 ? "1" : "0";
        })
    }

    gameItems.forEach(item => {
        const itemStates = itemsToEntriesStatesMap[item];

        for (let i = entriesInStateMachineCount; i <= statesCount; i += 1) {
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