import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
// Import your own reducer
import settings from 'store/settings/reducer';
import auth from 'store/auth/reducer';

function render(
  ui,
  {
    preloadedState,
    store = configureStore({ 
      reducer: { settings, auth },  
      middleware: (getDefaultMiddleware) => getDefaultMiddleware({ 
        immutableCheck: false,
        serializableCheck: false,}),
      preloadedState }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>
      <BrowserRouter>
      {children}
      </BrowserRouter> </Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };
