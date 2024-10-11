import React from 'react';
import Table from 'react-bootstrap/Table';

export const TabularData = ({ data }) => {
    if (!data || !data.length) {
        return "No data";
    }

    const entry0 = data[0];
    const keys = Object.keys(entry0).map(key => key.toLowerCase());
    const itemKeyIndex = keys.indexOf("number");

    const renderHeader = () => {
        let headerKeys = [];

        if (itemKeyIndex > -1) {
            headerKeys.push("number");

            keys.forEach((key, index) => {
                if (index !== itemKeyIndex) {
                    headerKeys.push(key)
                }
            });
        } else {
            headerKeys = keys;
        }

        return headerKeys.map(key => (<th key={`header-${key}`}>{key}</th>));
    }

    const renderCells = (row, rowIndex) => {
        let cells = [];

        if (itemKeyIndex > -1) {
            cells.push((<td key={`row-${rowIndex}-number`}>{row[itemKeyIndex]}</td>));

            Object.values(row).forEach((data, cellIndex) => {
                if (cellIndex !== itemKeyIndex) {
                    cells.push(<td key={`row-${rowIndex}-${cellIndex}`}>{data}</td>)
                }
            });
        } else {
            Object.values(row).forEach((data, cellIndex) => {
                cells.push(<td key={`row-${rowIndex}-${cellIndex}`}>{data}</td>)
            });
        }

        return cells;
    };


    const renderRows = () => data.map((row, rowIndex) => (
        <tr key={`row-${rowIndex}`}>
            {renderCells(row, rowIndex)}
        </tr>
    ))

    return (
        <div className="listRaw">
            <Table striped bordered hover>
                <thead>
                    <tr>
                        {renderHeader({ data })}
                    </tr>
                </thead>
                <tbody>
                    {renderRows()}
                </tbody>
            </Table>
        </div>
    );
}
