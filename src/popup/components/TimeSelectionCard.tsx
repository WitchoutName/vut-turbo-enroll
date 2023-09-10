import React, { ChangeEvent, FC } from 'react';
import Card from './Card';
import { FormControl } from 'react-bootstrap';

interface TimeSelectionCardProps {
  handleChangeTime: (event: ChangeEvent<HTMLInputElement>) => void;
  selectedTime: string;
  isScheduled: boolean;
}

const TimeSelectionCard: FC<TimeSelectionCardProps> = ({ handleChangeTime, selectedTime, isScheduled }) => (
  <Card className="card-container">
    <div className="mb-2">Pick registration time</div>
    <FormControl
      type="text"
      placeholder="10:45"
      onChange={handleChangeTime}
      value={selectedTime || ""}
      disabled={isScheduled}
    />
  </Card>
);

export default TimeSelectionCard;