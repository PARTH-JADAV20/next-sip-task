"use client";

import React from 'react';
import './globals.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from '../app/components/NavBar';


const theme = createTheme({
palette: {
mode: 'light',
},
components: {
MuiButton: {
defaultProps: {
disableElevation: true,
},
},
},
});


import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
return (
<html lang="en">
<head />
<body>
<ThemeProvider theme={theme}>
<CssBaseline />
<div className="min-h-screen flex flex-col">
<Navbar />
<main className="container mx-auto p-4 w-full flex-1">{children}</main>
<footer className="bg-gray-50 border-t p-4 text-center text-sm">Mutual Fund Explorer — Demo</footer>
</div>
</ThemeProvider>
</body>
</html>
);
}