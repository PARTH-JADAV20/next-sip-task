"use client";


import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import FundCard from '../components/FunCard';


export default function FundsPage() {
const [loading, setLoading] = useState(true);
const [schemes, setSchemes] = useState([]);
const [q, setQ] = useState('');


useEffect(() => {
let mounted = true;
async function fetchSchemes() {
setLoading(true);
try {
const res = await fetch('/api/mf');
const data = await res.json();
if (!mounted) return;
setSchemes(data || []);
} catch (err) {
console.error(err);
} finally {
if (mounted) setLoading(false);
}
}
fetchSchemes();
return () => { mounted = false; };
}, []);


const filtered = schemes.filter(s => s.schemeName.toLowerCase().includes(q.toLowerCase()));


return (
<div>
<div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:gap-4">
<TextField label="Search schemes" variant="outlined" fullWidth value={q} onChange={(e) => setQ(e.target.value)} />
</div>


{loading ? (
<div className="flex justify-center p-8"><CircularProgress /></div>
) : (
<Grid container spacing={2}>
{filtered.slice(0, 200).map((s) => (
<Grid key={s.schemeCode} item xs={12} sm={6} md={4} lg={3}>
<FundCard scheme={s} />
</Grid>
))}
</Grid>
)}
</div>
);
}