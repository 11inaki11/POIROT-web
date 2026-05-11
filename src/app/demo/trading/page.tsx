import CortexCaseSelector from '@/components/CortexCaseSelector';
import tradingData103 from '@/data/trading_103.json';
import tradingData107 from '@/data/trading_107.json';
import tradingData111 from '@/data/trading_111.json';
import tradingData113 from '@/data/trading_113.json';

export const metadata = {
    title: 'TradingAgents Demo — POIROT Protocol',
    description: 'POIROT error detection applied to the TradingAgents financial system',
};

const TRADING_CASES = [
    {
        id: '103',
        label: 'Case A: Market Analyst Error',
        hazard: 'Market Analyst (Inverted Reality)',
        errorType: 'Agent Analysis Error',
        groundTruth: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        numErrors: 1,
        data: tradingData103,
    },
    {
        id: '107',
        label: 'Case B: Market Analyst Error',
        hazard: 'Market Analyst (Inverted Reality)',
        errorType: 'Agent Analysis Error',
        groundTruth: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        numErrors: 1,
        data: tradingData107,
    },
    {
        id: '111',
        label: 'Case C: News Analyst Error',
        hazard: 'News Analyst (Hallucinating Scandal)',
        errorType: 'Data Integrity Error',
        groundTruth: [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        numErrors: 1,
        data: tradingData111,
    },
    {
        id: '113',
        label: 'Case D: Fundamentals Analyst Error',
        hazard: 'Fundamentals Analyst (Corrupted Data)',
        errorType: 'Data Corruption Error',
        groundTruth: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        numErrors: 1,
        data: tradingData113,
    },
];

export default function TradingDemo() {
    return <CortexCaseSelector cases={TRADING_CASES as any} />;
}
