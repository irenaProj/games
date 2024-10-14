import _ from "lodash";

const CHECK_STATE_MACHINE_COLUMNS = [
    {
        type: 3,
        columns: [
            "a_000",
            "a_100",
            "a_010",
            "a_001",
            "a_110",
            "a_101",
            "a_011",
            "a_111"
        ]
    }, {
        type: 4,
        columns: [
            "b_0000",
            "b_1000",
            "b_0100",
            "b_0010",
            "b_0001",
            "b_1100",
            "b_1010",
            "b_1001",
            "b_0110",
            "b_0101",
            "b_0011",
            "b_1110",
            "b_1101",
            "b_1011",
            "b_0111",
            "b_1111",
        ]
    }, {
        type: 5,
        columns: [
            "c_10000",
            "c_11000",
            "c_10100",
            "c_10010",
            "c_10001",
            "c_11100",
            "c_11010",
            "c_11001",
            "c_10110",
            "c_10101",
            "c_10011",
            "c_11110",
            "c_11101",
            "c_11011",
            "c_10111",
            "c_11111",
            "c_01000",
            "c_00100",
            "c_00010",
            "c_00001",
            "c_01100",
            "c_01010",
            "c_01001",
            "c_00110",
            "c_00101",
            "c_00011",
            "c_01110",
            "c_01101",
            "c_01011",
            "c_00111",
            "c_01111",
        ]
    },
];

const getItemPreviousCurrentState = ({ numbersStateMachineData, currentType, number }) => {
    const siPreviousStateMachineData = _.find(numbersStateMachineData[currentType - 1], (stateMachineData => stateMachineData.number === number));

    return siPreviousStateMachineData.currentState;
}

export const getSuggestedItemsWithStateMachines = ({ markedSuggestedItems, dataStats, settings }) => {
    const { numbersStateMachineData } = dataStats;

    const markedSuggestedItemsWithStateMachines = markedSuggestedItems.map(si => {
        const siWithStateMachine = { ...si };

        CHECK_STATE_MACHINE_COLUMNS.forEach(machineType => {
            const type = machineType.type;
            const previousState = getItemPreviousCurrentState({ numbersStateMachineData, currentType: type, number: si.number });
            const currentStateWithHit = previousState.slice(1) + "1";
            const currentStateWithNoHit = previousState.slice(1) + "0";

            machineType.columns.forEach(column => {
                const siStateMachineData = _.find(numbersStateMachineData[type], (stateMachineData => stateMachineData.number === si.number));

                switch (column.slice(1)) {
                    case currentStateWithHit:
                        siWithStateMachine[column] = {
                            value: siStateMachineData[column],
                            style: {
                                backgroundColor: "#b8ffb8"
                            }
                        };

                        break;

                    case currentStateWithNoHit:
                        siWithStateMachine[column] = {
                            value: siStateMachineData[column],
                            style: {
                                backgroundColor: "#ffd8d8"
                            }
                        };
                        break;

                    case currentStateWithHit:
                    default:
                        siWithStateMachine[column] = {
                            value: siStateMachineData[column],
                            style: {
                                backgroundColor: si.Hit ? "#c8defe" : "white"
                            }
                        }

                }
            })

            return siWithStateMachine;
        })

        return siWithStateMachine;
    })

    return markedSuggestedItemsWithStateMachines.sort((ms1, ms2) => ms1.number - ms2.number);
}

