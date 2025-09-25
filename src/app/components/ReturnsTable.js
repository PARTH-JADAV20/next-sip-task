"use client";
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

export default function ReturnsTable({ code }) {
    const [rows, setRows] = useState([]);


    useEffect(() => {
        let mounted = true;
        async function load() {
            try {
                const res = await fetch(`/api/scheme/${code}/returns?period=1m`);
                const r1 = await res.json();
                const r3 = await (await fetch(`/api/scheme/${code}/returns?period=3m`)).json();
                const r6 = await (await fetch(`/api/scheme/${code}/returns?period=6m`)).json();
                const r1y = await (await fetch(`/api/scheme/${code}/returns?period=1y`)).json();
                if (!mounted) return;
                setRows([
                    { label: '1 month', ...r1 },
                    { label: '3 months', ...r3 },
                    { label: '6 months', ...r6 },
                    { label: '1 year', ...r1y },
                ]);
            } catch (err) {
                console.error(err);
            }
        }
        if (code) load();
        return () => { mounted = false; };
    }, [code]);


    return (
        <Paper className="p-4">
            <Typography variant="h6" gutterBottom>Precomputed returns</Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Period</TableCell>
                        <TableCell>Start</TableCell>
                        <TableCell>End</TableCell>
                        <TableCell>Start NAV</TableCell>
                        <TableCell>End NAV</TableCell>
                        <TableCell>Simple %</TableCell>
                        <TableCell>Annualized %</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((r) => {
                        const simple = Number(r.simpleReturn);
                        const annualized = Number(r.annualizedReturn);

                        return (
                            <TableRow key={r.label}>
                                <TableCell>{r.label}</TableCell>
                                <TableCell>{r.startDate || '-'}</TableCell>
                                <TableCell>{r.endDate || '-'}</TableCell>
                                <TableCell>{r.startNAV || '-'}</TableCell>
                                <TableCell>{r.endNAV || '-'}</TableCell>
                                <TableCell>
                                    {!isNaN(simple) ? `${simple.toFixed(2)}%` : '-'}
                                </TableCell>
                                <TableCell>
                                    {!isNaN(annualized) ? `${(annualized * 100).toFixed(2)}%` : '-'}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>

            </Table>
        </Paper>
    );
}