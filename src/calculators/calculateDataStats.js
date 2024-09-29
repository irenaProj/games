import { checkEntriesRepeatability } from "./checkEntriesRepeatability";
import { checkGapFrequency } from "./checkGapFrequency";
import { consecutiveFrequency } from "./consecutiveFrequency";
import { getFrequencyFactors } from "./getFrequencyFactors";
import { occuranceFrequency } from "./occuranceFrequency";

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