import React from 'react';
import Table from 'react-bootstrap/Table';

export const TabularData = ({ data }) => {
    const renderHeader = () => {
        const entry0 = data[0];

        return Object.keys(entry0).map(key => (<th key={`header-${key}`}>{key}</th>));
    }

    const renderCells = (row, rowIndex) => Object.values(row).map((data, cellIndex) => {

        if (data && data.style) {
            return (<td key={`row-${rowIndex}-${cellIndex}`} style={data.style}>{data.value}</td>)
        }

        return (<td key={`row-${rowIndex}-${cellIndex}`}>{data}</td>)
    });


    const renderRows = () => data.map((row, rowIndex) => (
        <tr key={`row-${rowIndex}`}>
            {renderCells(row, rowIndex)}
        </tr>
    ))

    if (!data || !data.length) {
        return "No data";
    }

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
