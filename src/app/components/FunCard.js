"use client";


import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';


export default function FundCard({ scheme }) {
const { schemeCode, schemeName, fundHouse } = scheme;
return (
<Card className="h-full flex flex-col justify-between">
<CardContent>
<Typography variant="subtitle2" color="textSecondary">{fundHouse}</Typography>
<Typography variant="h6" className="mb-2">{schemeName}</Typography>
<Typography variant="caption" color="textSecondary">Code: {schemeCode}</Typography>
</CardContent>
<div className="p-4 pt-0">
<Button component={Link} href={`/scheme/${schemeCode}`} variant="contained" size="small" fullWidth>
View
</Button>
</div>
</Card>
);
}