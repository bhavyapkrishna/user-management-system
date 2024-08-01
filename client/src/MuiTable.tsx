import React, { useState, useEffect } from 'react';
import './MuiTable.css'

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
    TextField,
    FormControlLabel,
    Checkbox
} from '@mui/material'


type User = {
    id: String,
    firstName: String,
    lastName: String,
    email: String,
    verified: boolean,
    displayName: String,
    title: String,
    organization: String,
    admin: boolean
}

export const MuiTable = () => {

    const [data, setData] = useState<User[]>([]);
    const [open, setOpen] = useState(false);

    //define field use states
    const [firstName, setFirstName] = useState<String>("");
    const [lastName, setLastName] = useState<String>("");
    const [email, setEmail] = useState<String>("");
    const [verified, setVerified] = useState<boolean>(false);
    const [displayName, setDisplayName] = useState<String>("");
    const [title, setTitle] = useState<String>("");
    const [organization, setOrganization] = useState<String>("");
    const [admin, setAdmin] = useState<boolean>(false);
    const [update, setUpdate] = useState(false);
    const [userId, setUserId] = useState<String>("");

    //at every refresh, repopulate the table with current users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:5000/current-users");
                const dataList: User[] = await response.json();
                setData(dataList);
            } catch (error) {
                console.log(error);
            }
        };

        fetchUsers();
    }, []);

    //open dialog
    function handleOpen() {
        setOpen(true);
    }

    //close dialog
    function handleClose() {
        setOpen(false);
        setUpdate(false);

        setFirstName("");
        setLastName("");
        setEmail("");
        setVerified(false);
        setDisplayName("");
        setTitle("");
        setOrganization("");
        setAdmin(false);
    };

    //add users
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();

        //if the user in the table is being edited
        if (update) {
            try {
                const response = await fetch(`http://localhost:5000/edit-user/${userId}`, {
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
                        title,
                        organization,
                        admin,
                    })
                });

                if (response.ok) {

                    const updatedUser = await response.json();
                    setData((prevData) =>
                        prevData.map((user) =>
                            user.id === updatedUser.id ? updatedUser : user
                        )
                    );

                    console.log("update successful");

                    handleClose();
                } else {
                    console.log("Failed to update user");
                }

            } catch (err) {
                console.log(err);
            }

        }

        else {
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
                        title,
                        organization,
                        admin
                    })
                });

                if (response.ok) {
                    const newData = await response.json();
                    let id = newData.id;

                    const userDoc = {
                        id,
                        firstName,
                        lastName,
                        email,
                        verified,
                        displayName,
                        title,
                        organization,
                        admin
                    };

                    setData((prevData) => [...prevData, userDoc]);

                    handleClose();

                } else {
                    console.log("Failed to create new user");
                }
            }

            catch (error) {
                console.log(error);
            }
        }
    }

    //set "update" to true and fill the dialog up with the values from the selected user
    const handleEdit = async (index: number) => {

        let selectedUser = data[index];

        setUserId(selectedUser.id);
        setFirstName(selectedUser.firstName);
        setLastName(selectedUser.lastName);
        setEmail(selectedUser.email);
        setVerified(selectedUser.verified);
        setDisplayName(selectedUser.displayName);
        setTitle(selectedUser.title);
        setOrganization(selectedUser.organization);
        setAdmin(selectedUser.admin);

        setUpdate(true);
        setOpen(true);
    }

    //send a request use the return value of the request to remove the correct user from the table
    const handleDelete = async (userId: String) => {
        try {
            const response = await fetch(`http://localhost:5000/remove-user/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                })
            });

            if (response.ok) {
                const delUser = await response.json();
                let temp = [...data];
                let ind = data.findIndex((usr) => usr.id === delUser.id);
                temp.splice(ind, 1);
                setData(temp);
            }

        } catch (err) {
            console.log(err);
        }
    }

    //send a request to wipe the entire database
    const handleClearAll = async () => {
        try {
            const response = await fetch(`http://localhost:5000/clear-all-users`, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json"
                }
            });

            if (response.ok) {
                console.log("all users deleted successfully");
            }

            setData([]);

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            { /* page heading/app bar */}
            <Box>
                <AppBar position="static">
                    <Toolbar sx={{ justifyContent: 'center', position: 'relative', bgcolor: "#7EA798" }}>
                        <Typography text-align="center" variant="h6" component="div">Manage Users</Typography>{' '}
                        <div className="add-btn-class">
                            <Button variant="contained" sx={{
                                justifyContent: 'center', bgcolor: "#7EA798", '&:hover': {
                                    bgcolor: '#5c7a6f',
                                }
                            }} onClick={handleOpen}>Add User</Button>
                        </div>
                        <div className="del-all-btn-class">
                            <Button variant="contained" sx={{
                                justifyContent: 'center', bgcolor: "#7EA798", '&:hover': {
                                    bgcolor: '#5c7a6f',
                                }
                            }} onClick={handleClearAll}>Delete All Users</Button>
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>

            { /* data table displayed on the page*/}
            <TableContainer component={Paper}>
                <Table aria-label='table' stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">First Name</TableCell>
                            <TableCell align="center">Last Name</TableCell>
                            <TableCell align="center">Email</TableCell>
                            <TableCell align="center">Verified</TableCell>
                            <TableCell align="center">Display Name</TableCell>
                            <TableCell align="center">Title</TableCell>
                            <TableCell align="center">Organization</TableCell>
                            <TableCell align="center">Current User Group</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row: User, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">{row.id}</TableCell>
                                <TableCell align="center">{row.firstName}</TableCell>
                                <TableCell align="center">{row.lastName}</TableCell>
                                <TableCell align="center">{row.email}</TableCell>
                                <TableCell align="center">{row.verified ? "Verified" : "Unverified"}</TableCell>
                                <TableCell align="center">{row.displayName}</TableCell>
                                <TableCell align="center">{row.title}</TableCell>
                                <TableCell align="center">{row.organization}</TableCell>
                                <TableCell align="center">{row.admin ? "Admin" : "General"}</TableCell>
                                <TableCell align="center">
                                    <div>
                                        <Button
                                            className="update-task"
                                            variant="contained"
                                            onClick={() => handleEdit(index)} sx={{
                                                justifyContent: 'center', bgcolor: "#7EA798", '&:hover': {
                                                    bgcolor: '#5c7a6f',
                                                }
                                            }}
                                        >Update</Button>
                                    </div>
                                    <div>
                                        <Button
                                            className="delete-task"
                                            variant="contained"
                                            onClick={() => handleDelete(row.id)}
                                            sx={{
                                                justifyContent: 'center', bgcolor: "#CC0000", '&:hover': {
                                                    bgcolor: '#a10202',
                                                }
                                            }}
                                        >Delete</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            { /*dialog box*/}
            <Dialog sx={{ padding: 3 }} open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogContent>
                    <Box>
                        <AppBar position="static">
                            <Toolbar sx={{ justifyContent: 'center', position: 'relative', bgcolor: "#7EA798" }}>
                                {update ? (
                                    <Typography variant="h6" component="div">Edit User</Typography>
                                ) : (
                                    <Typography variant="h6" component="div">Add User</Typography>
                                )}
                            </Toolbar>
                        </AppBar>
                    </Box>

                    <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
                        <Box className="formBox" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <TextField label="First Name" required id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth ></TextField>

                            <TextField label="Last Name" required id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth ></TextField>

                            <TextField label="Email" required id="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth ></TextField>

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={verified}
                                        onChange={(e) => setVerified(e.target.checked)}
                                        sx={{
                                            transform: 'scale(1.2)',
                                            color: '#B0B0B0',
                                            '&.Mui-checked': { color: '#B0B0B0' }
                                        }}
                                    />
                                }
                                label="Verified"
                            />
                            <TextField label="Display Name" required id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} fullWidth ></TextField>

                            <TextField label="Title" required id="title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth ></TextField>

                            <TextField label="Organization" required id="organization" value={organization} onChange={(e) => setOrganization(e.target.value)} fullWidth ></TextField>


                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={admin}
                                        onChange={(e) => setAdmin(e.target.checked)}
                                        sx={{
                                            transform: 'scale(1.2)',
                                            color: '#B0B0B0',
                                            '&.Mui-checked': { color: '#B0B0B0' }
                                        }}
                                    />
                                }
                                label="Admin"
                            />
                        </Box>
                    </Box>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                        {update ? (
                            <Button className="editBtn" variant="contained" sx={{
                                justifyContent: 'center', bgcolor: "#7EA798", '&:hover': {
                                    bgcolor: '#5c7a6f',
                                }
                            }} onClick={handleAdd}>Update</Button>
                        ) : (
                            <Button className="addBtn" variant="contained" sx={{
                                justifyContent: 'center', bgcolor: "#7EA798", '&:hover': {
                                    bgcolor: '#5c7a6f',
                                }
                            }} onClick={handleAdd}>Add</Button>
                        )}


                        <Button className="cancelBtn" variant="contained" sx={{
                            justifyContent: 'center', bgcolor: "#CC0000", '&:hover': {
                                bgcolor: '#a10202',
                            }
                        }} onClick={handleClose}>Cancel</Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>

    )
}