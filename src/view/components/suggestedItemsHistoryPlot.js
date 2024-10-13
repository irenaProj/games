import _ from 'lodash';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getSortedByDate } from '../../utils/getSortedByDate';
import { getItemsInEntries } from '../../utils/getItemsInEntries';
import { LINE_COLORS } from '../../constants';

export const SuggestedItemsHistoryPlot = ({ selectedSuggestedItems, dataGroup, useSupplemental, entriesInPlots }) => {
    const plotData = [];
    const dataGroupSortedAsc = getSortedByDate(getSortedByDate(dataGroup, false).slice(0, entriesInPlots), true)

    dataGroupSortedAsc.forEach((entry) => {
        const items = getItemsInEntries([entry], useSupplemental);
        const plotDataEntry = {
            Date: entry.Date
        }

        items.forEach(item => {
            const foundItem = _.find(selectedSuggestedItems, ({ number }) => number === item);

            plotDataEntry[item] = foundItem && foundItem.isPlotted ? item : 0;
        })

        plotData.push(plotDataEntry)
    })

    const renderLines = () => selectedSuggestedItems && selectedSuggestedItems.map((si, index) => (<Line type="monotone" key={si.number} dataKey={si.number} stroke={LINE_COLORS[index]} />));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const items = payload.sort((p1, p2) => p2.dataKey - p1.dataKey)
            // `'${item.color}'`
            const content = items.map(item => (<span className='custom-tooltip-span' key={item.dataKey} style={{ color: `${item.color}` }}>{item.dataKey}</span>))

            return (
                <div className="custom-tooltip">
                    <p className="label">
                        <span className='custom-tooltip-span'>Date: {label}</span>
                        {content}
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <React.Fragment>
            <div className="plot-container overflow-x-scroll ">
                <div className="plot">
                    <ResponsiveContainer width="100%" height="100%" >
                        <LineChart
                            width={500}
                            height={300}
                            data={plotData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Date" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />

                            {renderLines()}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </React.Fragment>
    );
}