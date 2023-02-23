import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHeader } from 'store/settings-slice';
import { fetchUserSessions, getStatus, getSessions } from 'store/users-slice';
import { AppDispatch, RootState } from 'store';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { UserSession } from 'shared/user';
import { columns } from './type';

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(100);

  const sessionData = useSelector(getSessions);
  console.log({ sessions: sessionData });
  const sessionsStatus = useSelector(getStatus);

  useEffect(() => {
    dispatch(setHeader(true));
  }, [dispatch]);

  useEffect(() => {
    if (sessionsStatus === 'idle') {
      dispatch(fetchUserSessions({ accessToken, page, size: rowsPerPage }));
    }
  }, [sessionsStatus, accessToken, page, rowsPerPage, dispatch]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 640 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sessionData.sessions.map((row: UserSession) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format ? column.format((value ?? '').toString()) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={sessionData.total}
        rowsPerPage={sessionData.size}
        page={sessionData.page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default Dashboard;
