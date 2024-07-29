import React, { useState } from 'react';

import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    Dialog,
    DialogContent,
    Select,
    TextField,
    InputLabel,
    FormControl,
    MenuItem
} from '@mui/material'
//import { createNamedExports } from 'typescript';

const User = require("../server/models/Users");

export const MuiTable = () => {

    const [open, setOpen] = useState(false);

    //define field use states
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [verified, setVerified] = useState("yes");
    const [displayName, setDisplayName] = useState("");
    const [title, setTitle] = useState("");
    const [organization, setOrganization] = useState("");
    const [admin, setAdmin] = useState(false);

    //open dialog
    function handleOpen() {
        setOpen(true);
    }

    //close dialog
    function handleClose() {
        setOpen(false);
    }

    //add users
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/create-user", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    verified,
                    displayName,
                    organization,
                    admin
                })
            });

            const newUser = await response.json();
            const userDoc = new User(newUser);

            //TODO: fix this??
            userDoc.save(function (err: Error) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("group saved successfully");
                }
            })
        }
        /* check response status (200), if ok then insert into users --> list to table */

        catch (error) {
            console.log(error);
        }

    }

    //edit an existing note
    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/create-user", {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    verified,
                    displayName,
                    organization,
                    admin
                })
            });
        }

        catch (err) {
            console.log(err);
        }
    }


    return (
        <div>
            { /* page heading/app bar */}
            <Box>
                <AppBar position="static">
                    <Toolbar sx={{ position: "relative" }}>
                        <Typography variant="h6" component="div">Manage Users</Typography>{' '}
                        <div className="btn-class">
                            <Button variant="contained" onClick={handleOpen}>Add User</Button>
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>

            { /* data table displayed on the page*/}
            <TableContainer component={Paper} sx={{ maxHeight: '300px' }}>
                <Table aria-label='table' stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">ID</TableCell>
                            <TableCell align="right">First Name</TableCell>
                            <TableCell align="right">Last Name</TableCell>
                            <TableCell align="right">Email</TableCell>
                            <TableCell align="right">Verified</TableCell>
                            <TableCell align="right">Display Name</TableCell>
                            <TableCell align="right">Title</TableCell>
                            <TableCell align="right">Organization</TableCell>
                            <TableCell align="right">Current User Group</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* 
                        during refresh, fetch data from the db
                        normally just update use state and add into table when post req is successful
                        */}
                    </TableBody>
                </Table>
            </TableContainer>

            { /*dialog box*/}
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <Box>
                        <AppBar position="static">
                            <Toolbar sx={{ position: "relative" }}>
                                <Typography variant="h6" component="div">Add User</Typography>
                            </Toolbar>
                        </AppBar>
                    </Box>

                    <Box component="form" noValidate autoComplete="off">
                        <Box className="formBox">
                            <TextField label="First Name" required id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)}></TextField>
                            <br />
                            <TextField label="Last Name" required id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)}></TextField>
                            <br />
                            <TextField label="Email" required id="email" value={email} onChange={(e) => setEmail(e.target.value)}></TextField>
                            <br />
                            <FormControl>
                                <InputLabel id="verifiedLabel">Verified</InputLabel>
                                <Select labelId="verifiedLabel" id="vefiried" label="Select" value={verified} onChange={(e) => setVerified(e.target.value)}>
                                    <MenuItem id="yes" value="yes">Yes</MenuItem>
                                    <MenuItem id="no" value="no">No</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField label="Display Name" required id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)}></TextField>
                            <br />
                            <TextField label="Title" required id="title" value={title} onChange={(e) => setTitle(e.target.value)}></TextField>
                            <br />
                            <TextField label="Organization" required id="organization" value={organization} onChange={(e) => setOrganization(e.target.value)}></TextField>
                            <br />

                            <FormControl>
                                <InputLabel id="userGroupLabel">User Group</InputLabel>
                                <Select labelId="userGroupLabel" id="userGroup" label="Select" value={admin} onChange={(e) => { e.target.value == "admin" ? setAdmin(true) : setAdmin(false) }}>
                                    <MenuItem id="general" value="general">General</MenuItem>
                                    <MenuItem id="admin" value="admin">Administrator</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>

                    <Box>
                        <Button className="addBtn" variant="contained" onClick={handleAdd}>Add</Button>
                        <br />
                        <Button className="cancelBtn" variant="contained" onClick={handleClose}>Cancel</Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>

    )
}