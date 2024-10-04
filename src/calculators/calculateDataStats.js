import { checkEntriesRepeatability } from "./dataCrunchers/checkEntriesRepeatability";
import { checkGapFrequency } from "./dataCrunchers/checkGapFrequency";
import { consecutiveFrequency } from "./dataCrunchers/consecutiveFrequency";
import { getFrequencyFactors } from "./dataCrunchers/getFrequencyFactors";
import { occuranceFrequency } from "./dataCrunchers/occuranceFrequency";

export const calculateDataStats = ({
    dataGroup,
    consecutiveWeeksCount,
    useSupplemental,
}) => {
    const occuranceFrequencyData = occuranceFrequency(dataGroup, useSupplemental);
    const frequencyFactorsData = getFrequencyFactors(dataGroup, occuranceFrequencyData, useSupplemental);
    const strictConsecutiveFrequencyData = consecutiveFrequency(dataGroup, consecutiveWeeksCount, useSupplemental);
    const gapFrequencyData = checkGapFrequency(dataGroup, consecutiveWeeksCount, useSupplemental);
    const entiesRepeatabilityData = checkEntriesRepeatability(dataGroup, consecutiveWeeksCount, useSupplemental);


    return {
        occuranceFrequencyData,
        frequencyFactorsData,
        strictConsecutiveFrequencyData,
        gapFrequencyData,
        entiesRepeatabilityData
    }
}