"use client";


import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';


function formatCurrency(x) { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(x); }


export default function SIPCalculator({ code, navHistory }) {
    const [amount, setAmount] = useState(5000);
    const [freq, setFreq] = useState('monthly');
    const [from, setFrom] = useState('2020-01-01');
    const [to, setTo] = useState(new Date().toISOString().slice(0, 10));
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);


    async function calculate() {
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch(`/api/scheme/${code}/sip`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: Number(amount), frequency: freq, from, to })
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            setResult({ error: 'Failed to calculate' });
        } finally {
            setLoading(false);
        }
    }
    return (
        <Paper className="p-4">
            <Typography variant="h6">SIP Calculator</Typography>
            <div className="space-y-3 mt-3">
                <TextField label="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} fullWidth />
                <TextField select label="Frequency" value={freq} onChange={(e) => setFreq(e.target.value)} fullWidth>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="quarterly">Quarterly</MenuItem>
                </TextField>
                <div className="grid grid-cols-2 gap-2">
                    <TextField label="From" type="date" value={from} onChange={(e) => setFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
                    <TextField label="To" type="date" value={to} onChange={(e) => setTo(e.target.value)} InputLabelProps={{ shrink: true }} />
                </div>
                <Button variant="contained" onClick={calculate} disabled={loading}>{loading ? 'Calculating...' : 'Calculate Returns'}</Button>
            </div>


            {result && (
                <div className="mt-4">
                    {result.error ? (
                        <Typography color="error">{result.error}</Typography>
                    ) : (
                        <div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 border rounded">
                                    <Typography variant="caption">Total Invested</Typography>
                                    <Typography variant="h6">{formatCurrency(result.totalInvested)}</Typography>
                                </div>
                                <div className="p-3 border rounded">
                                    <Typography variant="caption">Current Value</Typography>
                                    <Typography variant="h6">{formatCurrency(result.currentValue)}</Typography>
                                </div>
                                <div className="p-3 border rounded">
                                    <Typography variant="caption">Absolute Return</Typography>
                                    <Typography variant="h6">{(result.absoluteReturn)}</Typography>
                                </div>
                                <div className="p-3 border rounded">
                                    <Typography variant="caption">Annualized Return</Typography>
                                    <Typography variant="h6">{Number(result.annualizedReturn).toFixed(2)}%</Typography>
                                </div>
                            </div>


                            {/* Growth chart */}
                            {result.timeline && (
                                <div style={{ width: '100%', height: 240 }} className="mt-4">
                                    <ResponsiveContainer>
                                        <AreaChart data={result.timeline}>
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip />
                                            <Area type="monotone" dataKey="value" stroke="#1976d2" fillOpacity={0.2} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </Paper>
    )
}