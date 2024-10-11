import React from 'react';
import { getLastEntryDateIndex } from '../utils/sortEntriestIntoDataAndTargetEntry';
import { TargetEntryAnalysisTab } from './targetEntryAnalysisTab';
import { getSortedByDate } from '../utils/getSortedByDate';
import { calculateDataStats } from '../calculators/calculateDataStats';

export const LaterEntriesAnalysisTab = ({
    data,
    settings
}) => {
    const {
        lastEntriesCount,
        lastEntryDate,
        consecutiveWeeksCount,
    } = settings;

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
        const dataStats = calculateDataStats({
            dataGroup,
            consecutiveWeeksCount,
            settings
        })

        content.push((
            <TargetEntryAnalysisTab
                key={i}
                targetEntry={targetEntry}
                dataGroup={dataGroup}
                dataStats={dataStats}
                settings={settings}
            />
        ))
    }

    return (
        <React.Fragment>
            {content}
        </React.Fragment>
    );
}