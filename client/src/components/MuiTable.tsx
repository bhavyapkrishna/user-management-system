import React from 'react';

import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableCell,
    Paper,
} from '@mui/material'

export const MuiTable = () => {
    return (
        <TableContainer component={Paper} sx={{ maxHeight: '300px'}}>
            <Table aria-label='table' stickyHeader>
                <TableHead>
                    <TableCell align="right">ID</TableCell>
                    <TableCell align="right">First Name</TableCell>
                    <TableCell align="right">Last Name</TableCell>
                    <TableCell align="right">Email</TableCell>
                    <TableCell align="right">Current User Group</TableCell>
                    <TableCell align="right">Action</TableCell>
                </TableHead>
                <TableBody></TableBody>
            </Table>
        </TableContainer>
    )
}