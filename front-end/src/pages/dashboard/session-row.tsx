import { useState } from 'react';
import { TableCell, TableRow } from '@mui/material';
import { Session } from 'shared/user';
import { columns } from './type';
import SessionDetail from './session-detail';

const SessionRow = (props: { session: Session }) => {
  const { session } = props;
  const [openDetail, setOpenDetail] = useState(false);

  const handleSelectSession = () => {
    setOpenDetail(true);
  };

  const handleDeselectSession = () => {
    setOpenDetail(false);
  };

  return (
    <>
      <TableRow
        hover
        role="checkbox"
        tabIndex={-1}
        key={session.id}
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
      <SessionDetail session={session} open={openDetail} onClose={handleDeselectSession} />
    </>
  );
};

export default SessionRow;
