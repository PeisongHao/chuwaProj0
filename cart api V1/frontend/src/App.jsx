import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./app/store";
import CartPage from "./pages/CartPage";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <div className="app">
          <header className="app-header">
            <h1>Cart API V1</h1>
            <p>Independent Development Environment</p>
          </header>
          <main className="app-main">
            <CartPage />
          </main>
          <footer className="app-footer">
            <p>&copy; 2024 Cart API V1 - Development Version</p>
          </footer>
        </div>
      </PersistGate>
    </Provider>
  );
}

// 加载屏幕组件
const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fa'
  }}>
    <div style={{
      textAlign: 'center'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
      }}></div>
      <p style={{
        color: '#666',
        fontSize: '16px'
      }}>
        Loading Cart API V1...
      </p>
    </div>
  </div>
);

export default App;
