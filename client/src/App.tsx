import React from 'react';
import logo from './logo.svg';
import './App.css';
import { MuiTable } from './components/MuiTable'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

//import { ToastContainer, toast } from 'react-toastify'; //TODOL: import react toastify
//<ToastContainer position="bottom-right" hideProgressBar />
//import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    MuiTable()
  );
}

export default App;
