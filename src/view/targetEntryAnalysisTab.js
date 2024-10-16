import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { TargetEntryStats } from './targetEntryStats';

export const TargetEntryAnalysisTab = ({
    targetEntry,
    dataGroup,
    dataStats,
    settings
}) => {

    return (
        <Container>
            <Row className="justify-content-center spaced-vertically">
                Target entry is: {targetEntry ? JSON.stringify(targetEntry) : "Next entry"}
            </Row>


            <Row>
                {TargetEntryStats({
                    targetEntry,
                    dataGroup,
                    dataStats,
                    settings
                })}
            </Row>

        </Container>
    )
}