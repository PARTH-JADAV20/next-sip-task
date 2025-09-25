"use client";


import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from 'next/link';


export default function Navbar() {
return (
<AppBar position="static" color="inherit" elevation={1}>
<Toolbar className="container mx-auto">
<Box className="flex items-center gap-4">
<Typography variant="h6" component={Link} href="/" style={{ textDecoration: 'none' }}>
MF Explorer
</Typography>
<Typography variant="body2" color="textSecondary">| SIP Calculator</Typography>
</Box>
<Box sx={{ flex: 1 }} />
<Button component={Link} href="/funds" color="primary" variant="outlined">Browse Funds</Button>
</Toolbar>
</AppBar>
);
}