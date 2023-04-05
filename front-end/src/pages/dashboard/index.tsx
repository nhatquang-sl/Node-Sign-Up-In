import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { AppDispatch } from 'store';
import { setHeader } from 'store/settings-slice';
import sessionsApi from 'store/sessions-api';
import { getPagination, selectSessions, setSessionsPage } from 'store/sessions-slice';
import { PAGE } from 'shared/utilities';
import { columns } from './type';
import SessionRow from './session-row';

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const sessions = useSelector(selectSessions);
  const pagination = useSelector(getPagination);
  const [isLoading, setIsLoading] = useState(false);

  console.log({ isLoading, sessions });
  const fetchSessions = useCallback(
    async (page: number = PAGE.START, size: number = PAGE.SIZE) => {
      setIsLoading(true);
      const result = await dispatch(sessionsApi.endpoints.getSessions.initiate({ page, size }));
      if (result.data) dispatch(setSessionsPage(result.data));
      setIsLoading(false);
    },
    [dispatch]
  );

  useEffect(() => {
    console.log('Dashboard');
    dispatch(setHeader(true));

    fetchSessions();
  }, [dispatch, fetchSessions]);

  const handleChangePage = async (_: any, newPage: number) => {
    await fetchSessions(newPage, pagination.size);
  };

  const handleChangeRowsPerPage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await fetchSessions(0, +event.target.value);
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
            {sessions.map((session) => {
              return <SessionRow key={session.id} session={session} />;
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={pagination?.total}
        rowsPerPage={pagination.size}
        page={pagination.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ alignSelf: 'normal' }}
      />

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Paper>
  );
};

export default Dashboard;
