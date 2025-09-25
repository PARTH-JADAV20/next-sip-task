"use client";

import ReturnsTable from "../../components/ReturnsTable";
import SIPCalculator from "../../components/SIPCalculator";
import { useState, useEffect } from "react";
import { use } from "react";
import { CircularProgress, Paper, Grid, Typography } from "@mui/material";
import NavChart from "../../components/NavChart"; 

export default function SchemePage({ params }) {
  const { code } = use(params);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  const [navHistory, setNavHistory] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/scheme/${code}`);
        const data = await res.json();
        if (!mounted) return;
        setMeta(data.metadata || {});
        console.log("Meta:",data.metadata);
        setNavHistory(data.navHistory || []);
      } catch (err) {
        console.error("Error fetching scheme data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (code) load();
    return () => {
      mounted = false;
    };
  }, [code]);

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <CircularProgress />
      </div>
    );


  if (!meta) return <div>No scheme data found.</div>;

  return (
    <div className="space-y-4">
      <Paper className="p-4">
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5">{meta.scheme_category}</Typography>
            <Typography variant="subtitle2">
              {meta.fund_house} • {meta.scheme_category}
            </Typography>
            <Typography variant="body2" className="mt-2">
              ISINs: {meta.isin_div_reinvestment || "N/A"}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} className="flex items-center justify-end">
            <Typography variant="caption">Code: {meta.scheme_code}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper className="p-4 chart-card">
        <NavChart data={navHistory.slice(0, 365).reverse()} />
      </Paper>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <ReturnsTable code={meta.scheme_code} />
        </Grid>
        <Grid item xs={12} md={6}>
          <SIPCalculator code={meta.scheme_code} navHistory={navHistory} />
        </Grid>
      </Grid>
    </div>
  );
}
