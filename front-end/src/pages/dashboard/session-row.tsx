import { useState } from 'react';
import { TableCell, TableRow } from '@mui/material';
import { columns } from './type';
import SessionDetail from './session-detail';
import { selectSessionById } from 'store/sessions-slice';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const SessionRow = (props: { sessionId: any }) => {
  const session = useSelector((state: RootState) => selectSessionById(state, props.sessionId));
  const [sessionSelected, setSessionSelected] = useState(0);

  const handleSelectSession = () => {
    setSessionSelected(props.sessionId);
  };

  const handleDeselectSession = () => {
    setSessionSelected(0);
  };

  return (
    <>
      <TableRow
        hover
        role="checkbox"
        tabIndex={-1}
        key={props.sessionId}
        onClick={() => handleSelectSession()}
      >
        {session &&
          columns.map((column) => {
            const value = session[column.id];
            return (
              <TableCell key={column.id} align={column.align} sx={{ cursor: 'pointer' }}>
                {column.format ? column.format((value ?? '').toString()) : value}
              </TableCell>
            );
          })}
      </TableRow>
      <SessionDetail sessionId={sessionSelected} onClose={handleDeselectSession} />
    </>
  );
};

export default SessionRow;
