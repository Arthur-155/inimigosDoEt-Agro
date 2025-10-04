# app.py
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import pandas as pd

DATA = Path(__file__).parent / "data"

FILES = {
    "ndvi": DATA / "MOD13A2-061-Statistics.csv",
    "soil": DATA / "SPL3SMP-E-006-Statistics.csv",
    "rootzone": DATA / "SPL4SMGP-008-Statistics.csv",
    "lst": DATA / "MOD11A2-061-Statistics.csv",
}

CANDS_DATE = ["time", "date", "DATE", "system:index"]
COLS = {
    "ndvi": ["1_km_16_days_NDVI", "NDVI", "ndvi"],
    "soil": [
        "Soil_Moisture_Retrieval_Data_AM_soil_moisture",
        "Soil_Moisture_Retrieval_Data_PM_soil_moisture_pm",
        "soil_moisture", "soil"
    ],
    "rootzone": ["Geophysical_Data_sm_rootzone", "sm_rootzone", "rootzone"],
    "lst_day": ["LST_Day_1km", "LST_Day", "lst_day"],
    "lst_night": ["LST_Night_1km", "LST_Night", "lst_night"],
}

app = FastAPI(title="AgriVision API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def load_csv(path: Path) -> pd.DataFrame:
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"arquivo não encontrado: {path.name}")
    return pd.read_csv(path)

def pick_col(df: pd.DataFrame, cands: list[str]) -> str:
    lmap = {c.lower(): c for c in df.columns}
    for c in cands:
        if c in df.columns: return c
        if c.lower() in lmap: return lmap[c.lower()]
    # fallback: primeira numérica
    for c in df.columns:
        if pd.api.types.is_numeric_dtype(df[c]): return c
    raise HTTPException(status_code=422, detail="coluna numérica não encontrada")

def pick_date_col(df: pd.DataFrame) -> str:
    lmap = {c.lower(): c for c in df.columns}
    for c in CANDS_DATE:
        if c in df.columns: return c
        if c.lower() in lmap: return lmap[c.lower()]
    raise HTTPException(status_code=422, detail="coluna de data não encontrada (time/date/system:index)")

def mean_in_range(df: pd.DataFrame, val_col: str, date_col: str, start: str, end: str):
    s = pd.to_datetime(df[date_col], errors="coerce")
    m = (s >= pd.to_datetime(start)) & (s <= pd.to_datetime(end))
    vals = pd.to_numeric(df.loc[m, val_col], errors="coerce").dropna()
    return (None if vals.empty else float(vals.mean()), int(vals.size))

@app.get("/health")
def health(): return {"ok": True}

@app.get("/ndvi")
def ndvi(start: str = Query(...), end: str = Query(...), col: str | None = None):
    df = load_csv(FILES["ndvi"])
    dcol = pick_date_col(df)
    vcol = col or pick_col(df, COLS["ndvi"])
    mean, n = mean_in_range(df, vcol, dcol, start, end)
    return {"dataset":"MOD13A2", "column": vcol, "date_col": dcol, "start": start, "end": end, "mean": mean, "samples": n}

@app.get("/soil")
def soil(start: str = Query(...), end: str = Query(...), col: str | None = None):
    df = load_csv(FILES["soil"])
    dcol = pick_date_col(df)
    vcol = col or pick_col(df, COLS["soil"])
    mean, n = mean_in_range(df, vcol, dcol, start, end)
    return {"dataset":"SPL3SMP_E", "column": vcol, "date_col": dcol, "start": start, "end": end, "mean": mean, "unit":"m3/m3", "samples": n}

@app.get("/rootzone")
def rootzone(start: str = Query(...), end: str = Query(...), col: str | None = None):
    df = load_csv(FILES["rootzone"])
    dcol = pick_date_col(df)
    vcol = col or pick_col(df, COLS["rootzone"])
    mean, n = mean_in_range(df, vcol, dcol, start, end)
    return {"dataset":"SPL4SMGP", "column": vcol, "date_col": dcol, "start": start, "end": end, "mean": mean, "unit":"m3/m3", "samples": n}

@app.get("/lst")
def lst(kind: str = Query("day", pattern="^(day|night)$"), start: str = Query(...), end: str = Query(...), col: str | None = None):
    df = load_csv(FILES["lst"])
    dcol = pick_date_col(df)
    cands = COLS["lst_day"] if kind == "day" else COLS["lst_night"]
    vcol = col or pick_col(df, cands)
    mean, n = mean_in_range(df, vcol, dcol, start, end)
    return {"dataset":"MOD11A2", "kind": kind, "column": vcol, "date_col": dcol, "start": start, "end": end, "mean": mean, "samples": n}
