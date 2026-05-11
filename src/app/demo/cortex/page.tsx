import CortexCaseSelector from '@/components/CortexCaseSelector';
import cortexData182 from '@/data/cortex_182.json';
import cortexData186 from '@/data/cortex_186.json';
import cortexData190 from '@/data/cortex_190.json';
import cortexData278 from '@/data/cortex_278.json';

export const metadata = {
    title: 'CORTEX Demo — POIROT Protocol',
    description: 'POIROT error detection applied to the CORTEX medical robotics system',
};

const CORTEX_CASES = [
    {
        id: '278',
        label: 'Case A: Multi-Component Failure (5 errors)',
        hazard: 'Doctor-X, Chief-X, Physio-X, Sensor-Broken, Parent-X',
        errorType: 'Multi-Component Failure',
        groundTruth: [1, 1, 1, 1, 0, 1, 0],
        numErrors: 5,
        data: cortexData278,
    },
    {
        id: '186',
        label: 'Case B: Medical Agent Error — Doctor-X',
        hazard: 'Doctor-X (Diagnosis Doctor)',
        errorType: 'Medical Agent Error',
        groundTruth: [1, 0, 0, 0, 0, 0, 0],
        numErrors: 1,
        data: cortexData186,
    },
    {
        id: '182',
        label: 'Case C: Equipment Failure — Sensor-Broken',
        hazard: 'Sensor-Broken (Discover2Walk Exoskeleton)',
        errorType: 'Equipment Failure',
        groundTruth: [0, 0, 0, 1, 0, 0, 0],
        numErrors: 1,
        data: cortexData182,
    },
    {
        id: '190',
        label: 'Case D: External Actor Error — Parent-X',
        hazard: 'Parent-X (Parent/Guardian)',
        errorType: 'External Actor Error',
        groundTruth: [0, 0, 0, 0, 0, 1, 0],
        numErrors: 1,
        data: cortexData190,
    },
];

export default function CortexDemo() {
    return <CortexCaseSelector cases={CORTEX_CASES as any} />;
}
