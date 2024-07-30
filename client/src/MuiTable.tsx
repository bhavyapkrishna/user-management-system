import React, { useState, useEffect } from 'react';

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

    const handleEdit = async (index: number) => {

        let selectedUser = data[index];

        setUserId(selectedUser.id);

        console.log("edit su id", selectedUser.id);
        console.log("edit user id", userId);

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

    const handleDelete = async (index: number) => {
        let selectedUser = data[index];
        setUserId(selectedUser.id);

        console.log("del index", index);
        console.log("user", selectedUser);

        console.log("id", selectedUser.id);
        console.log("user id", userId);

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

        } catch (err) {
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
                        <div className="add-btn-class">
                            <Button variant="contained" onClick={handleOpen}>Add User</Button>
                        </div>
                        <div className="del-all-btn-class">
                            <Button variant="contained" onClick={handleClearAll}>Delete All Users</Button>
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
                                            onClick={() => handleEdit(index)}
                                        >Update</Button>
                                    </div>
                                    <div>
                                        <Button
                                            className="delete-task"
                                            variant="contained"
                                            onClick={() => handleDelete(index)}
                                            color="error"
                                        >Delete</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            { /*dialog box*/}
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <Box>
                        <AppBar position="static">
                            <Toolbar sx={{ position: "relative" }}>
                                {update ? (
                                    <Typography variant="h6" component="div">Edit User</Typography>
                                ) : (
                                    <Typography variant="h6" component="div">Add User</Typography>
                                )}
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
                            <div>
                                <label htmlFor="verified">Verified:</label>
                                <input type="checkbox" id="verified" checked={verified} onChange={(e) => setVerified(e.target.checked)}></input>
                            </div>

                            <TextField label="Display Name" required id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)}></TextField>
                            <br />
                            <TextField label="Title" required id="title" value={title} onChange={(e) => setTitle(e.target.value)}></TextField>
                            <br />
                            <TextField label="Organization" required id="organization" value={organization} onChange={(e) => setOrganization(e.target.value)}></TextField>
                            <br />

                            <div>
                                <label htmlFor="admin">Admin:</label>
                                <input type="checkbox" id="admin" checked={admin} onChange={(e) => setAdmin(e.target.checked)}></input>
                            </div>
                        </Box>
                    </Box>

                    <Box>
                        {update ? (
                            <Button className="editBtn" variant="contained" onClick={handleAdd}>Update</Button>
                        ) : (
                            <Button className="addBtn" variant="contained" onClick={handleAdd}>Add</Button>
                        )}

                        <br />
                        <Button className="cancelBtn" variant="contained" onClick={handleClose}>Cancel</Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </div>

    )
}