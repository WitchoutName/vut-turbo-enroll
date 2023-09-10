import React, { FC } from 'react';
import { Button } from 'react-bootstrap';
import Card from './Card';

interface ScheduleCardProps {
  isScheduled: boolean;
  errorMessage: string;
  timeLeft: number;
  handleConfirm: () => void;
  handleCancel: () => void;
}

const ScheduleCard: FC<ScheduleCardProps> = ({ isScheduled, errorMessage, timeLeft, handleConfirm, handleCancel }) => (
  <Card className='m-0'>
    {!isScheduled ?
      <>
        <div><small className='text-danger'>{errorMessage}</small></div>
        <Button className="btn-success" disabled={!!errorMessage} onClick={handleConfirm}>Confirm</Button>
      </> :
      <>
        {timeLeft > 0 && <>
          <div>Registering selected block in:</div>
          <div><b style={{fontSize: 20}}>{timeLeft}</b>s</div>
        </>}
        <div className='text-warning'>⚠Keep the timetable tab open!⚠</div>
        <Button className="btn-danger" onClick={handleCancel}>Cancel</Button>
      </>
    }
  </Card>
);

export default ScheduleCard;