import React from 'react';
import logo from './logo.svg';
import './App.css';
import { QueryClient } from 'react-query';
import { QueryClientProvider } from 'react-query';
import Navbar from './Components/Navbar/Navbar';
import Content from './Components/Content/Content';
import Footer from './Components/Footer/Footer';
import { BrowserRouter as Router } from 'react-router-dom';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className='App'>
          <Router>
            <Navbar/>
            <div>
              <Content/>
            </div>
            <Footer/>
          </Router>
        </div>
      </QueryClientProvider>    
    </>
  );
}

export default App;
