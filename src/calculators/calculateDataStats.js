import { checkEntriesRepeatability } from "./dataCrunchers/checkEntriesRepeatability";
import { checkGapFrequency } from "./dataCrunchers/checkGapFrequency";
import { checkNumbersStateMachine } from "./dataCrunchers/checkNumbersStateMachine";
import { checkSequentialNumbers } from "./dataCrunchers/checkSequentialNumbers";
import { clusterBySameDraw } from "./dataCrunchers/clusterBySameDraw";
import { consecutiveFrequency } from "./dataCrunchers/consecutiveFrequency";
import { getEntryItemsFirstDigits } from "./dataCrunchers/getEntryItemsFirstDigits";
import { getFrequencyFactors } from "./dataCrunchers/getFrequencyFactors";
import { occuranceFrequency } from "./dataCrunchers/occuranceFrequency";
import { checkDiffBetweenFirstAndLastItems } from "./dataCrunchers/checkDiffBetweenFirstAndLastItems";

export const calculateDataStats = ({
    dataGroup,
    consecutiveWeeksCount,
    settings
}) => {
    const { useSupplemental, entriesInStateMachineCount, gameItemsCount } = settings;
    const occuranceFrequencyData = occuranceFrequency(dataGroup, useSupplemental);
    const frequencyFactorsData = getFrequencyFactors(dataGroup, occuranceFrequencyData, useSupplemental);
    const strictConsecutiveFrequencyData = consecutiveFrequency(dataGroup, consecutiveWeeksCount, useSupplemental);
    const gapFrequencyData = checkGapFrequency(dataGroup, consecutiveWeeksCount, useSupplemental);
    const entiesRepeatabilityData = checkEntriesRepeatability(dataGroup, consecutiveWeeksCount, useSupplemental);
    const entryItemsFirstDigitsData = getEntryItemsFirstDigits(dataGroup, useSupplemental);
    const itemsClustersData = clusterBySameDraw(dataGroup, useSupplemental);
    const coupleAndTrippleSequentialNumbersData = checkSequentialNumbers(dataGroup, useSupplemental)
    const numbersStateMachineData = checkNumbersStateMachine({
        entriesInStateMachineCount,
        dataGroup,
        useSupplemental,
        gameItemsCount
    });
    const diffBetweenFirstAndLastItemsData = checkDiffBetweenFirstAndLastItems(dataGroup, useSupplemental, gameItemsCount);

    return {
        occuranceFrequencyData,
        frequencyFactorsData,
        strictConsecutiveFrequencyData,
        gapFrequencyData,
        entiesRepeatabilityData,
        entryItemsFirstDigitsData,
        itemsClustersData,
        coupleAndTrippleSequentialNumbersData,
        numbersStateMachineData,
        diffBetweenFirstAndLastItemsData
    }
}