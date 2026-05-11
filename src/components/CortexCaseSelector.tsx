'use client';

import React, { useState } from 'react';
import DemoClient from './DemoClient';

export interface CortexCase {
    id: string;
    label: string;
    hazard: string;
    errorType: string;
    groundTruth: number[];
    numErrors: number;
    data: any;
}

interface CortexCaseSelectorProps {
    cases: CortexCase[];
}

export default function CortexCaseSelector({ cases }: CortexCaseSelectorProps) {
    const [selectedId, setSelectedId] = useState(cases[0]?.id ?? '');
    const selectedCase = cases.find(c => c.id === selectedId) ?? cases[0];

    return (
        <DemoClient
            key={selectedCase?.id}
            data={selectedCase?.data}
            cases={cases.map(c => ({ id: c.id, label: c.label }))}
            selectedCaseId={selectedId}
            onCaseChange={setSelectedId}
        />
    );
}
