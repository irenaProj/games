import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getSortedByDate } from '../../utils/getSortedByDate';
import { getItemsInEntries } from '../../utils/getItemsInEntries';
import { LINE_COLORS } from '../../constants';

export const ItemsHistoryPlot = ({ itemNameInEntry, dataGroup }) => {
    const plotData = [];
    // const dataGroupSortedAsc = getSortedByDate(getSortedByDate(dataGroup, false).slice(0, 200), true)
    const dataGroupSortedAsc = getSortedByDate(dataGroup, true);

    dataGroupSortedAsc.forEach((entry) => {
        const plotDataEntry = {
            Date: entry.Date,
            item: entry[itemNameInEntry]
        };

        plotData.push(plotDataEntry);
    })

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const payloadItem = payload[0];

            return (
                <div className="custom-tooltip">
                    <p className="label">
                        <span className='custom-tooltip-span'>Date: {label}</span>
                        <span className='custom-tooltip-span' key={payloadItem.dataKey} style={{ color: 'black' }}>{payloadItem.payload.item}</span>
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
                        <BarChart
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
                            <Bar dataKey="item" fill={LINE_COLORS[4]} />
                        </BarChart >
                    </ResponsiveContainer>
                </div>
            </div>
        </React.Fragment>
    );
}