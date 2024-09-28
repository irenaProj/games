import React from 'react';
import { getLastEntryDateIndex } from '../utils/sortEntriestIntoDataAndTargetEntry';
import { occuranceFrequency } from '../calculators/occuranceFrequency';
import { consecutiveFrequency } from '../calculators/consecutiveFrequency';
import { checkGapFrequency } from '../calculators/checkGapFrequency';
import { checkEntriesRepeatability } from '../calculators/checkEntriesRepeatability';
import { TargetEntryAnalysisTab } from './targetEntryAnalysisTab';
import { getSortedByDate } from '../utils/getSortedByDate';

export const LaterEntriesAnalysisTab = ({
    data,
    lastEntriesCount,
    lastEntryDate,
    consecutiveWeeksCount,
    minItem,
    maxItem
}) => {
    const sortedDesc = getSortedByDate(data, false);
    const lastEntryDateIndex = getLastEntryDateIndex({
        data,
        lastEntryDate,
    });

    if (!lastEntryDateIndex || lastEntryDateIndex < 0) {
        return "No data";
    }

    const content = [];

    for (let i = lastEntryDateIndex; i > 0; i -= 1) {
        const targetEntry = sortedDesc[i - 1];
        const dataGroup = sortedDesc.slice(i, i + lastEntriesCount);
        const occuranceFrequencyData = occuranceFrequency(dataGroup);
        const strictConsecutiveFrequencyData = consecutiveFrequency(dataGroup, consecutiveWeeksCount);
        const gapFrequencyData = checkGapFrequency(dataGroup, consecutiveWeeksCount);
        const entiesRepeatabilityData = checkEntriesRepeatability(dataGroup, consecutiveWeeksCount);

        content.push((
            <TargetEntryAnalysisTab
                key={i}
                targetEntry={targetEntry}
                dataGroup={dataGroup}
                occuranceFrequencyData={occuranceFrequencyData}
                entiesRepeatabilityData={entiesRepeatabilityData}
                strictConsecutiveFrequencyData={strictConsecutiveFrequencyData}
                gapFrequencyData={gapFrequencyData}
                consecutiveWeeksCount={consecutiveWeeksCount}
                minItem={minItem}
                maxItem={maxItem}
            />
        ))
    }

    return content;
}