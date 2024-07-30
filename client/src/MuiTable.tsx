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
    //const [id, setId] = useState<String>("");
    const [firstName, setFirstName] = useState<String>("");
    const [lastName, setLastName] = useState<String>("");
    const [email, setEmail] = useState<String>("");
    const [verified, setVerified] = useState<boolean>(false);
    const [displayName, setDisplayName] = useState<String>("");
    const [title, setTitle] = useState<String>("");
    const [organization, setOrganization] = useState<String>("");
    const [admin, setAdmin] = useState<boolean>(false);
    const [update, setUpdate] = useState(false);


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
                const response = await fetch(`http://localhost:5000/edit-user`, { //`http://localhost:5000/edit-user/${id}`
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        //id,
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

                const updatedData = await response.json();
                //let ind = data.findIndex((usr) => usr.id === id);

                setFirstName(updatedData.firstName);
                setLastName(updatedData.lastName);
                setEmail(updatedData.email);
                setVerified(updatedData.verified);
                setDisplayName(updatedData.displayName);
                setTitle(updatedData.title);
                setOrganization(updatedData.organization);
                setAdmin(updatedData.admin);

                /*const updatedUserDoc = {
                    id,
                    firstName,
                    lastName,
                    email,
                    verified,
                    displayName,
                    title,
                    organization,
                    admin
                };*/

                //data[ind] = updatedUserDoc;
                console.log("update successful");

                handleClose();

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
                    const id = newData.id;

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
        /*console.log("user id", usrId);

        setId(usrId);
        let ind = data.findIndex((usr) => usr.id === usrId);

        console.log("index", ind);
        let selectedUser = data[ind];*/

        let selectedUser = data[index];

        //setId(selectedUser.id);
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

    const handleDelete = async (usrId: String) => {
        //setId(usrId);

        try {
            const response = await fetch(`http://localhost:5000/delete-user/`, { //http://localhost:5000/delete-user/${id}
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    //id
                })
            });

            await response.json();

            if (response.ok) {
                let temp = [...data];
                //let ind = data.findIndex((usr) => usr.id === id);
                //temp.splice(ind, 1);
                //setData(temp);
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
                            <Button variant="contained" onClick={handleOpen}>Delete All</Button>
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
                                            onClick={() => handleDelete(row.id)}
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