import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import Main from 'components/base/main';
import Sidebar from 'components/base/sidebar';
import Header from 'components/base/header';
import * as signalR from '@microsoft/signalr';

import { theme } from './theme';

function App() {
  console.log('App');
  useEffect(() => {
    var endpoint = 'https://api.bitgo.press/api/iplatform';
    endpoint = 'https://localhost:64403';
    // endpoint = 'https://jk-iplatform-api-dev.azurewebsites.net';
    // endpoint = 'https://quang-dev.azurewebsites.net';
    var connection = new signalR.HubConnectionBuilder()
      .withUrl(`${endpoint}/plan-order-hub`, {
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () =>
          'eyJhbGciOiJIUzI1NiIsImtpZCI6ImJvZGVmaS5iaXRnby5wcmVzcyIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxNjYyNzIwMjI4MTY0IiwiZW1haWwiOiJzdW5saWdodDQ3OUB5YWhvby5jb20iLCJzaWQiOiJlMzk2YTdiZC0wMTU3LTRmOTktOWRhYi1jMGFlY2U3YzY0NDQiLCJkX2lkIjoiQnJvd3NlciBvbiBXaW5kb3dzIDEwLzY1NDMxYjYyLWJhODgtNDFkYS1hZWU1LWUxZTQ5NjY5YzQ3NSIsIm5pY2tfbmFtZSI6InN1bmxpZ2h0NDc5Iiwic19ncm91cCI6IjAiLCJzeXN0ZW0iOiJib2RlZmktd2ViIiwiZXhwIjoxNjk1NDY4OTcyLCJpc3MiOiJib2RlZmkuYml0Z28ucHJlc3MiLCJhdWQiOiJib2RlZmktd2ViIn0.IUgdkZVdk3jst1ptOMnYwD8AJbaQmaijy4vOb5gD8Lc',
      })
      .withAutomaticReconnect([0, 1000, 5000, 5000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on('ReceiveMessage', function (message: any) {
      console.log(message);
    });

    connection
      .start()
      .then(function () {
        console.log('connected');
        connection.invoke('GetLastMessages').then(function (data: any) {
          console.log(`Last Message: ${data.length}`);

          data
            .map(function (x: any) {
              return JSON.parse(x);
            })
            .sort((a: any, b: any) => a.time - b.time)
            .forEach((x: any) => console.log(new Date(x.time)));
        });
      })
      .catch(function (err: any) {
        return console.error(err.toString());
      });
  });
  return (
    <div style={{ display: 'flex' }}>
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', flex: 1 }}>
          <BrowserRouter>
            <CssBaseline />
            <Header />
            <Sidebar />
            <Main />
          </BrowserRouter>
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default App;
