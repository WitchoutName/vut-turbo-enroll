import React, { FC } from 'react';
import { Button } from 'react-bootstrap';
import Card from './Card';

interface Block {
  subject: string;
  day: string;
  time: string;
}

interface BlockSelectionCardProps {
  handleToggleSelectBlock: () => void;
  isSelectingBlock: boolean;
  selectedBlock: Block | null;
  isScheduled: boolean;
}

const BlockSelectionCard: FC<BlockSelectionCardProps> = ({ handleToggleSelectBlock, isSelectingBlock, selectedBlock, isScheduled }) => (
  <Card className="card-container">
    <div>Pick a time block to register</div>
    <Button
      onClick={handleToggleSelectBlock}
      className={isSelectingBlock ? "btn-secondary mb-4" : "mb-4"}
      disabled={isScheduled}>
      Select
    </Button>
    { 
      selectedBlock && (
        <>
          <div><b>Selected block</b></div>
          <p>{selectedBlock.subject}, {selectedBlock.day}, {selectedBlock.time}</p>
        </>
      )
    }
  </Card>
);

export default BlockSelectionCard;