import _ from 'lodash';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getSortedByDate } from '../utils/getSortedByDate';
import { getItemsInEntries } from '../utils/getItemsInEntries';

const LINE_COLORS = [
    "#44FFD2",
    "#87F6FF",
    "#DAF5FF",
    "#FFBFA0",
    "#99C2A2",
    "#aa2993",
    "#f550fe",
    "#9d9041",
    "#ce1743",
    "#3c82f7",
    "#712aba",
    "#8d2b7d",
    "#239e04",
    "#4a7452",
    "#deb0f5",
    "#2c4b10",
    "#74ee46",
    "#661f08",
    "#132d67",
    "#b88b20",
    "#88a447",
    "#bcca13",
    "#db2893",
    "#4287f5",
    "#f5b7b1",
    "#a9cce3",
    "#616163",
]


export const suggestedItemsHistoryPlot = ({ suggestedItems, dataGroup, useSupplemental }) => {
    const plotData = [];
    const dataGroupSortedAsc = getSortedByDate(getSortedByDate(dataGroup, false).slice(0, 200), true)

    dataGroupSortedAsc.forEach((entry) => {
        const items = getItemsInEntries([entry], useSupplemental);
        const plotDataEntry = {
            Date: entry.Date
        }

        items.forEach(item => {
            const foundItem = _.find(suggestedItems, ({ number }) => number === item);

            plotDataEntry[item] = foundItem ? item : 0;
        })

        plotData.push(plotDataEntry)
    })

    const renderLines = () => suggestedItems.map((si, index) => (<Line type="monotone" key={si.number} dataKey={si.number} stroke={LINE_COLORS[index]} />));


    return (
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
                    <Tooltip />
                    <Legend />

                    {renderLines()}
                </LineChart>
            </ResponsiveContainer>
            </div>
        </div>
    );
}