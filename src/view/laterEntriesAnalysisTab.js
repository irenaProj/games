import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { getLastEntryDateIndex } from '../utils/sortEntriestIntoDataAndTargetEntry';
import { TargetEntryAnalysisTab } from './targetEntryAnalysisTab';
import { getSortedByDate } from '../utils/getSortedByDate';
import { getNumbers } from '../utils/getNumbers';
import { calculateDataStats } from '../calculators/calculateDataStats';

export const LaterEntriesAnalysisTab = ({
    data,
    lastEntriesCount,
    lastEntryDate,
    consecutiveWeeksCount,
    minItem,
    maxItem,
    useSupplemental
}) => {
    const maxTicketsNumber = getNumbers(50);
    const [ticketsNumber, setTicketsNumber] = useState(3);

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
            useSupplemental,
        })

        content.push((
            <TargetEntryAnalysisTab
                key={i}
                targetEntry={targetEntry}
                dataGroup={dataGroup}
                dataStats={dataStats}
                consecutiveWeeksCount={consecutiveWeeksCount}
                minItem={minItem}
                maxItem={maxItem}
                useSupplemental={useSupplemental}
                ticketsNumber={ticketsNumber}
            />
        ))
    }

    return (
        <React.Fragment>
            <Row className="justify-content-center">
                <Col xs={4}>
                    <DropdownButton id="tickets-num" title="Select tickets number" >
                        {maxTicketsNumber.map(number => (<Dropdown.Item as="button" key={number} onClick={() => setTicketsNumber(number)}>{number}</Dropdown.Item>))}
                    </DropdownButton>
                    <p>{ticketsNumber} tickets</p>
                </Col>
            </Row>
            {content}
        </React.Fragment>
    );
}