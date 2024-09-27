"use client"
import { useEffect, useState } from 'react';
import { getBlockDetails } from './newui/utils/apidata';

interface BlockDetails {
  blockNumber: number;
  blockReward: string;
  timeStamp: string;

}

const BlockInfo = () => {
  const [blockDetails, setBlockDetails] = useState<BlockDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlockDetails = async () => {
      try {
        const blockNumber = 80227493;
        const data = await getBlockDetails(blockNumber);
        setBlockDetails(data.result);  // Assuming `data.result` contains the block details
      } catch (error) {
        setError('Failed to fetch block details');
      }
    };

    fetchBlockDetails();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {blockDetails ? (
        <div>
          <h2>Block Details</h2>
          <p><strong>Block Number:</strong> {blockDetails.blockNumber}</p>
          <p><strong>Block Reward:</strong> {blockDetails.blockReward}</p>
          <p><strong>Timestamp:</strong> {blockDetails.timeStamp}</p>
      
        </div>
      ) : (
        <p>Loading block details...</p>
      )}
    </div>
  );
};

export default BlockInfo;
