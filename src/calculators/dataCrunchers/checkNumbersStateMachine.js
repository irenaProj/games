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
    "0000": "b_0000",
    "1000": "b_1000",
    "0100": "b_0100",
    "0010": "b_0010",
    "0001": "b_0001",
    "1100": "b_1100",
    "1010": "b_1010",
    "1001": "b_1001",
    "0110": "b_0110",
    "0101": "b_0101",
    "0011": "b_0011",
    "1110": "b_1110",
    "1101": "b_1101",
    "1011": "b_1011",
    "0111": "b_0111",
    "1111": "b_1111"
}

const FIVE_ENTRIES_STATES = {
    "00000": "c_00000",
    "01000": "c_01000",
    "00100": "c_00100",
    "00010": "c_00010",
    "00001": "c_00001",
    "01100": "c_01100",
    "01010": "c_01010",
    "01001": "c_01001",
    "00110": "c_00110",
    "00101": "c_00101",
    "00011": "c_00011",
    "01110": "c_01110",
    "01101": "c_01101",
    "01011": "c_01011",
    "00111": "c_00111",
    "01111": "c_01111",
    "10000": "c_10000",
    "11000": "c_11000",
    "10100": "c_10100",
    "10010": "c_10010",
    "10001": "c_10001",
    "11100": "c_11100",
    "11010": "c_11010",
    "11001": "c_11001",
    "10110": "c_10110",
    "10101": "c_10101",
    "10011": "c_10011",
    "11110": "c_11110",
    "11101": "c_11101",
    "11011": "c_11011",
    "10111": "c_10111",
    "11111": "c_11111"
}

const ENTRIES_COUNT_TO_STATES_MACHINE_MAP = {
    2: TWO_ENTRIES_STATES,
    3: THREE_ENTRIES_STATES,
    4: FOUR_ENTRIES_STATES,
    5: FIVE_ENTRIES_STATES
}


const checkNumbersStateMachineWithAState = ({
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
        return {
            "number": index + 1,
            ...numbersStateMachineData[item]
        }
    });
}

export const checkNumbersStateMachine = ({
    dataGroup,
    useSupplemental,
    gameItemsCount
}) => {
    return {
        2: checkNumbersStateMachineWithAState({
            entriesInStateMachineCount: 2,
            dataGroup,
            useSupplemental,
            gameItemsCount
        }),
        3: checkNumbersStateMachineWithAState({
            entriesInStateMachineCount: 3,
            dataGroup,
            useSupplemental,
            gameItemsCount
        }),
        4: checkNumbersStateMachineWithAState({
            entriesInStateMachineCount: 4,
            dataGroup,
            useSupplemental,
            gameItemsCount
        }),
        5: checkNumbersStateMachineWithAState({
            entriesInStateMachineCount: 5,
            dataGroup,
            useSupplemental,
            gameItemsCount
        })
    }
}