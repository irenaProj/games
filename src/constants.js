
export const GANE_NAMES = {
    "PB": "PB",
    "SL": "SL",
    "OL": "OL",
    "WF-Mon": "WF-Mon",
    "WF-Wed": "WF-Wed",
    "WF-Fri": "WF-Fri",
    "WF": "WF",
}

export const GAME_NAME_MAP = {
    "/": GANE_NAMES.PB,
    "/pb": GANE_NAMES.PB,
    "/sl": GANE_NAMES.SL,
    "/ol": GANE_NAMES.OL,
    "/wf-mon": GANE_NAMES["WF-Mon"],
    "/wf-wed": GANE_NAMES["WF-Wed"],
    "/wf-fri": GANE_NAMES["WF-Fri"],
    "/wf": GANE_NAMES.WF
}

export const GAME_ITEMS = {
    [GANE_NAMES.PB]: 35,
    [GANE_NAMES.SL]: 45,
    [GANE_NAMES.OL]: 47,
    [GANE_NAMES["WF-Mon"]]: 45,
    [GANE_NAMES["WF-Wed"]]: 45,
    [GANE_NAMES["WF-Fri"]]: 45,
    [GANE_NAMES.WF]: 45,
}

export const ITEMS_PER_TICKET = {
    [GANE_NAMES.PB]: 7,
    [GANE_NAMES.PB]: 7,
    [GANE_NAMES.SL]: 6,
    [GANE_NAMES.OL]: 7,
    [GANE_NAMES["WF-Mon"]]: 6,
    [GANE_NAMES["WF-Wed"]]: 6,
    [GANE_NAMES["WF-Fri"]]: 6,
    [GANE_NAMES.WF]: 6
}

export const ITEM_PRIORITY_TYPES = {
    HIGHEST: 1.75,
    HIGHER: 1.5,
    HIGH: 1.25,
    NORMAL: 1,
    LOW: 0.75,
    LOWER: 0.5,
    LOWEST: 0.25
}

export const LINE_COLORS = [
    "#44FFD2",
    "#87F6FF",
    "#FFBFA0",
    "#99C2A2",
    "#aa2993",
    "#f550fe",
    "#9d9041",
    "#ce1743",
    "#3c82f7",
    "#712aba",
    "#8d2b7d",
    "#239e04",
    "#4a7452",
    "#2c4b10",
    "#74ee46",
    "#661f08",
    "#132d67",
    "#b88b20",
    "#88a447",
    "#bcca13",
    "#db2893",
    "#4287f5",
    "#f5b7b1",
    "#a9cce3",
    "#616163",
    "#DAF5FF",
    "#deb0f5",
]