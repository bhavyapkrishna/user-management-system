import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { MuiTable } from './MuiTable'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

//import { ToastContainer, toast } from 'react-toastify'; //TODO: import react toastify
//<ToastContainer position="bottom-right" hideProgressBar />
//import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [open, setOpen] = useState(false)

  function handleClose() {
    //
  }

  function handleAdd() {
    //
  }

  function handleEdit() {

  }
  return (
    <MuiTable />
  );
}

export default App;
