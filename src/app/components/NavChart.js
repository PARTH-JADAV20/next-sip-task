"use client";


import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Typography from '@mui/material/Typography';


export default function NavChart({ data }) {
// data expected: [{date: 'YYYY-MM-DD', nav: '12.3456'}, ...] reversed chronologically
const chartData = (data || []).map(d => ({ date: d.date, nav: parseFloat(d.nav) }));


return (
<div style={{ width: '100%', height: 300 }}>
<Typography variant="subtitle1" className="mb-2">NAV (last {chartData.length} points)</Typography>
<ResponsiveContainer>
<LineChart data={chartData}>
<XAxis dataKey="date" minTickGap={20} />
<YAxis domain={[dataMin => Math.floor(dataMin - 5), 'auto']} />
<Tooltip />
<Line type="monotone" dataKey="nav" stroke="#1976d2" dot={false} strokeWidth={2} />
</LineChart>
</ResponsiveContainer>
</div>
);
}