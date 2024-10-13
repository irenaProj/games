import _ from "lodash";

const CHECK_STATE_MACHINE_COLUMNS = [

    { type: 3, column: "a_000" },
    { type: 3, column: "a_100" },
    { type: 3, column: "a_010" },
    { type: 3, column: "a_001" },
    { type: 3, column: "a_110" },
    { type: 3, column: "a_101" },
    { type: 3, column: "a_011" },
    { type: 3, column: "a_111" },
    { type: 4, column: "b_0000" },
    { type: 4, column: "b_1000" },
    { type: 4, column: "b_0100" },
    { type: 4, column: "b_0010" },
    { type: 4, column: "b_0001" },
    { type: 4, column: "b_1100" },
    { type: 4, column: "b_1010" },
    { type: 4, column: "b_1001" },
    { type: 4, column: "b_0110" },
    { type: 4, column: "b_0101" },
    { type: 4, column: "b_0011" },
    { type: 4, column: "b_1110" },
    { type: 4, column: "b_1101" },
    { type: 4, column: "b_1011" },
    { type: 4, column: "b_0111" },
    { type: 4, column: "b_1111" },
    { type: 5, column: "c_10000" },
    { type: 5, column: "c_11000" },
    { type: 5, column: "c_10100" },
    { type: 5, column: "c_10010" },
    { type: 5, column: "c_10001" },
    { type: 5, column: "c_11100" },
    { type: 5, column: "c_11010" },
    { type: 5, column: "c_11001" },
    { type: 5, column: "c_10110" },
    { type: 5, column: "c_10101" },
    { type: 5, column: "c_10011" },
    { type: 5, column: "c_11110" },
    { type: 5, column: "c_11101" },
    { type: 5, column: "c_11011" },
    { type: 5, column: "c_10111" },
    { type: 5, column: "c_11111" },
    { type: 5, column: "c_01000" },
    { type: 5, column: "c_00100" },
    { type: 5, column: "c_00010" },
    { type: 5, column: "c_00001" },
    { type: 5, column: "c_01100" },
    { type: 5, column: "c_01010" },
    { type: 5, column: "c_01001" },
    { type: 5, column: "c_00110" },
    { type: 5, column: "c_00101" },
    { type: 5, column: "c_00011" },
    { type: 5, column: "c_01110" },
    { type: 5, column: "c_01101" },
    { type: 5, column: "c_01011" },
    { type: 5, column: "c_00111" },
    { type: 5, column: "c_01111" },
];

export const getSuggestedItemsWithStateMachines = ({ markedSuggestedItems, dataStats, settings }) => {
    const { numbersStateMachineData } = dataStats;

    const markedSuggestedItemsWithStateMachines = markedSuggestedItems.map(si => {
        const siWithStateMachine = { ...si };

        CHECK_STATE_MACHINE_COLUMNS.forEach(column => {
            const siStateMachineData = _.find(numbersStateMachineData[[column.type]], (stateMachineData => stateMachineData.number === si.number));
            const currentState = siStateMachineData.currentState;
            const currentStateLessOne = currentState.slice(0, currentState.length - 1);
            const currentStateLessOneWithHit = currentStateLessOne + "1";
            const currentStateLessOneWithNoHit = currentStateLessOne + "0";

            switch (column.column) {
                case currentStateLessOneWithHit:
                    siWithStateMachine[column.column] = {
                        value: siStateMachineData[column.column],
                        style: {
                            backgroundColor: "#b8ffb8"
                        }
                    };

                    break;

                case currentStateLessOneWithNoHit:
                    siWithStateMachine[column.column] = {
                        value: siStateMachineData[column.column],
                        style: {
                            backgroundColor: "#ffd8d8"
                        }
                    };
                    break;

                case currentStateLessOneWithHit:
                default:
                    siWithStateMachine[column.column] = siStateMachineData[column.column]

            }
        })

        return siWithStateMachine;
    });

    return markedSuggestedItemsWithStateMachines.sort((ms1, ms2) => ms1.number - ms2.number);
}