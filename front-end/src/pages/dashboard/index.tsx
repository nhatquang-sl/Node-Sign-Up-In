import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHeader } from 'store/settings-slice';
import { fetchUserSessions, getStatus, getSessions } from 'store/users-slice';
import { AppDispatch, RootState } from 'store';
import {
  Backdrop,
  CircularProgress,
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const sessionData = useSelector(getSessions);
  console.log({ sessions: sessionData });
  const sessionsStatus = useSelector(getStatus);

  useEffect(() => {
    dispatch(setHeader(true));
  }, [dispatch]);

  useEffect(() => {
    if (sessionsStatus === 'idle') {
      dispatch(fetchUserSessions({ accessToken, page: page, size: rowsPerPage }));
    }
  }, [sessionsStatus, accessToken, page, rowsPerPage, dispatch]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    console.log({ newPage });
    dispatch(fetchUserSessions({ accessToken, page: newPage, size: rowsPerPage }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
    dispatch(fetchUserSessions({ accessToken, page: 0, size: +event.target.value }));
  };
  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <TableContainer sx={{ flex: 1 }}>
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
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ alignSelf: 'normal' }}
      />

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
        open={sessionsStatus === 'loading'}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Paper>
  );
};

export default Dashboard;
