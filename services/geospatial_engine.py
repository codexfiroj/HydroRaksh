"""
JalSuraksha Unified Geospatial Engine.
Manages spatial projections, interactive vector maps, river layers,
hotspot telemetry, and IoT monitoring coordinates for all 36 Indian States and Union Territories.
"""

from typing import Dict, List, Any, Optional
import json
import os
import math

class GeospatialEngine:
    _instance: Optional["GeospatialEngine"] = None

    # Curated river vector paths for all major states/UTs in SVG [0 0 920 760] viewport
    RIVER_LAYERS: Dict[str, List[Dict[str, Any]]] = {
        "UP": [
            {"name": "Ganga River Basin", "d": "M 120,110 Q 220,240 380,310 T 560,470 T 820,530", "color": "#38bdf8", "width": 3.0, "tx": 320, "ty": 270},
            {"name": "Yamuna River", "d": "M 95,115 Q 110,280 200,380 T 480,510 T 640,545", "color": "#0284c7", "width": 2.5, "tx": 145, "ty": 340},
            {"name": "Saryu (Ghaghara)", "d": "M 420,160 Q 560,260 670,360 T 840,490", "color": "#60a5fa", "width": 2.2, "tx": 590, "ty": 310},
            {"name": "Betwa River", "d": "M 230,680 Q 270,590 350,560 T 480,515", "color": "#0ea5e9", "width": 2.0, "tx": 260, "ty": 620},
        ],
        "MH": [
            {"name": "Godavari River Basin", "d": "M 180,240 Q 340,280 500,290 T 780,410", "color": "#38bdf8", "width": 3.0, "tx": 420, "ty": 265},
            {"name": "Krishna & Bhima River", "d": "M 220,520 Q 380,560 520,510 T 720,600", "color": "#0284c7", "width": 2.5, "tx": 350, "ty": 540},
            {"name": "Tapi River", "d": "M 220,130 Q 380,140 520,110 T 640,90", "color": "#60a5fa", "width": 2.0, "tx": 360, "ty": 115},
            {"name": "Wainganga River", "d": "M 720,120 Q 750,260 760,400 T 780,580", "color": "#0ea5e9", "width": 2.0, "tx": 740, "ty": 320},
        ],
        "RJ": [
            {"name": "Chambal River Basin", "d": "M 460,680 Q 560,610 680,520 T 850,440", "color": "#38bdf8", "width": 3.0, "tx": 620, "ty": 580},
            {"name": "Banas River", "d": "M 380,560 Q 480,480 610,430 T 740,410", "color": "#0284c7", "width": 2.5, "tx": 500, "ty": 460},
            {"name": "Luni River (Arid Flow)", "d": "M 440,320 Q 340,410 240,510 T 150,650", "color": "#eab308", "width": 2.2, "tx": 280, "ty": 460},
            {"name": "Sabarmati Basin Flank", "d": "M 320,680 Q 350,620 380,580", "color": "#60a5fa", "width": 1.8, "tx": 340, "ty": 640},
        ],
        "KA": [
            {"name": "Cauvery (Kaveri) Basin", "d": "M 220,590 Q 380,630 540,650 T 780,690", "color": "#38bdf8", "width": 3.0, "tx": 410, "ty": 615},
            {"name": "Krishna River", "d": "M 160,180 Q 340,160 520,140 T 820,120", "color": "#0284c7", "width": 2.8, "tx": 400, "ty": 145},
            {"name": "Tungabhadra River", "d": "M 250,380 Q 420,340 590,310 T 810,280", "color": "#60a5fa", "width": 2.4, "tx": 450, "ty": 330},
            {"name": "Sharavathi River", "d": "M 210,460 Q 180,470 140,480", "color": "#0ea5e9", "width": 2.0, "tx": 160, "ty": 455},
        ],
        "TN": [
            {"name": "Cauvery River Delta", "d": "M 210,340 Q 380,360 540,380 T 820,410", "color": "#38bdf8", "width": 3.0, "tx": 420, "ty": 345},
            {"name": "Vaigai River", "d": "M 260,560 Q 410,590 560,620 T 740,640", "color": "#0284c7", "width": 2.4, "tx": 430, "ty": 575},
            {"name": "Tamirabarani River", "d": "M 290,690 Q 400,705 520,710 T 680,720", "color": "#60a5fa", "width": 2.2, "tx": 410, "ty": 685},
            {"name": "Palar River", "d": "M 280,180 Q 440,195 620,205 T 790,220", "color": "#0ea5e9", "width": 2.2, "tx": 480, "ty": 175},
        ],
        "AP": [
            {"name": "Godavari River Basin", "d": "M 320,180 Q 520,220 680,260 T 840,310", "color": "#38bdf8", "width": 3.0, "tx": 540, "ty": 200},
            {"name": "Krishna River", "d": "M 280,380 Q 450,410 610,440 T 790,470", "color": "#0284c7", "width": 2.8, "tx": 460, "ty": 385},
            {"name": "Pennar River", "d": "M 210,580 Q 360,600 520,610 T 720,630", "color": "#60a5fa", "width": 2.4, "tx": 380, "ty": 575},
            {"name": "Tungabhadra Confluence", "d": "M 180,340 Q 240,360 300,380", "color": "#0ea5e9", "width": 2.0, "tx": 210, "ty": 335},
        ],
        "TS": [
            {"name": "Godavari River", "d": "M 180,140 Q 420,180 620,210 T 820,280", "color": "#38bdf8", "width": 3.0, "tx": 450, "ty": 165},
            {"name": "Krishna River Basin", "d": "M 240,620 Q 460,610 640,580 T 810,540", "color": "#0284c7", "width": 2.8, "tx": 480, "ty": 625},
            {"name": "Musi River", "d": "M 320,440 Q 480,460 620,470 T 750,490", "color": "#60a5fa", "width": 2.2, "tx": 500, "ty": 435},
        ],
        "GJ": [
            {"name": "Narmada River", "d": "M 780,510 Q 640,490 520,480 T 360,490", "color": "#38bdf8", "width": 3.0, "tx": 580, "ty": 465},
            {"name": "Sabarmati River", "d": "M 480,160 Q 470,280 440,380 T 410,480", "color": "#0284c7", "width": 2.5, "tx": 490, "ty": 290},
            {"name": "Tapi River", "d": "M 740,590 Q 610,570 480,560 T 380,570", "color": "#60a5fa", "width": 2.2, "tx": 560, "ty": 545},
            {"name": "Mahi River", "d": "M 620,320 Q 540,390 460,450", "color": "#0ea5e9", "width": 2.0, "tx": 550, "ty": 360},
        ],
        "MP": [
            {"name": "Narmada River Lifeline", "d": "M 210,480 Q 440,470 620,450 T 820,420", "color": "#38bdf8", "width": 3.2, "tx": 460, "ty": 445},
            {"name": "Chambal River", "d": "M 280,310 Q 340,190 480,130 T 640,110", "color": "#0284c7", "width": 2.6, "tx": 410, "ty": 160},
            {"name": "Betwa River", "d": "M 460,420 Q 520,320 590,220 T 680,160", "color": "#60a5fa", "width": 2.2, "tx": 550, "ty": 260},
            {"name": "Tapti River", "d": "M 320,620 Q 460,610 610,590", "color": "#0ea5e9", "width": 2.2, "tx": 420, "ty": 595},
        ],
        "PB": [
            {"name": "Sutlej River", "d": "M 680,410 Q 510,460 340,510 T 150,560", "color": "#38bdf8", "width": 3.0, "tx": 460, "ty": 440},
            {"name": "Beas River", "d": "M 590,210 Q 480,310 390,390 T 320,440", "color": "#0284c7", "width": 2.6, "tx": 490, "ty": 280},
            {"name": "Ravi River (Border)", "d": "M 440,140 Q 360,220 280,310 T 190,420", "color": "#60a5fa", "width": 2.2, "tx": 350, "ty": 210},
        ],
        "HR": [
            {"name": "Yamuna River (Eastern Border)", "d": "M 740,120 Q 720,340 730,520 T 750,710", "color": "#38bdf8", "width": 3.0, "tx": 700, "ty": 360},
            {"name": "Ghaggar River", "d": "M 720,110 Q 540,180 360,280 T 180,390", "color": "#0284c7", "width": 2.5, "tx": 460, "ty": 210},
        ],
        "BR": [
            {"name": "Ganga River (East Flow)", "d": "M 110,380 Q 320,390 540,380 T 840,410", "color": "#38bdf8", "width": 3.2, "tx": 420, "ty": 360},
            {"name": "Gandak River", "d": "M 260,140 Q 340,240 410,360", "color": "#0284c7", "width": 2.4, "tx": 310, "ty": 220},
            {"name": "Kosi River (Sorrow of Bihar)", "d": "M 620,120 Q 640,240 680,380", "color": "#60a5fa", "width": 2.4, "tx": 660, "ty": 210},
            {"name": "Son River", "d": "M 240,660 Q 310,540 390,410", "color": "#0ea5e9", "width": 2.4, "tx": 280, "ty": 560},
        ],
        "WB": [
            {"name": "Hooghly River (Ganga Delta)", "d": "M 420,160 Q 410,320 430,480 T 470,680", "color": "#38bdf8", "width": 3.0, "tx": 450, "ty": 380},
            {"name": "Teesta River (North Bengal)", "d": "M 440,60 Q 460,110 480,180", "color": "#0284c7", "width": 2.5, "tx": 490, "ty": 110},
            {"name": "Damodar River", "d": "M 180,410 Q 280,430 360,450 T 430,490", "color": "#60a5fa", "width": 2.2, "tx": 270, "ty": 405},
        ],
        "OD": [
            {"name": "Mahanadi River Basin", "d": "M 210,340 Q 410,360 590,380 T 810,410", "color": "#38bdf8", "width": 3.2, "tx": 440, "ty": 340},
            {"name": "Brahmani River", "d": "M 380,180 Q 520,240 660,320 T 780,360", "color": "#0284c7", "width": 2.4, "tx": 540, "ty": 225},
            {"name": "Baitarani River", "d": "M 520,160 Q 610,210 710,270", "color": "#60a5fa", "width": 2.0, "tx": 590, "ty": 185},
        ],
        "KL": [
            {"name": "Periyar River Basin", "d": "M 560,420 Q 440,430 320,440 T 210,450", "color": "#38bdf8", "width": 3.0, "tx": 420, "ty": 410},
            {"name": "Bharathappuzha River", "d": "M 580,310 Q 450,320 330,330 T 210,340", "color": "#0284c7", "width": 2.5, "tx": 430, "ty": 290},
            {"name": "Pamba River", "d": "M 550,560 Q 440,570 340,580 T 230,590", "color": "#60a5fa", "width": 2.2, "tx": 430, "ty": 545},
        ],
        "DL": [
            {"name": "Yamuna River (Delhi Corridor)", "d": "M 520,110 Q 560,320 540,510 T 560,700", "color": "#38bdf8", "width": 3.5, "tx": 580, "ty": 360},
            {"name": "Delhi Quartzite Ridge Watershed", "d": "M 320,140 Q 360,340 410,540 T 450,710", "color": "#eab308", "width": 2.0, "tx": 330, "ty": 380},
        ],
        "AS": [
            {"name": "Brahmaputra Great River", "d": "M 180,360 Q 410,310 620,290 T 840,240", "color": "#38bdf8", "width": 3.8, "tx": 480, "ty": 280},
            {"name": "Barak Valley River", "d": "M 340,640 Q 440,650 560,630", "color": "#0284c7", "width": 2.4, "tx": 410, "ty": 625},
        ],
        "JK": [
            {"name": "Jhelum River (Kashmir Valley)", "d": "M 610,360 Q 480,310 360,260 T 210,240", "color": "#38bdf8", "width": 3.0, "tx": 430, "ty": 285},
            {"name": "Chenab River", "d": "M 640,560 Q 480,540 340,560 T 210,610", "color": "#0284c7", "width": 2.6, "tx": 420, "ty": 525},
            {"name": "Tawi River (Jammu)", "d": "M 480,620 Q 410,630 350,650", "color": "#60a5fa", "width": 2.0, "tx": 390, "ty": 610},
        ],
        "LA": [
            {"name": "Indus River (Trans-Himalayan)", "d": "M 740,560 Q 520,440 340,310 T 180,180", "color": "#38bdf8", "width": 3.2, "tx": 490, "ty": 415},
            {"name": "Zanskar River Gorge", "d": "M 420,620 Q 440,520 460,420", "color": "#0284c7", "width": 2.4, "tx": 440, "ty": 540},
            {"name": "Shyok River", "d": "M 720,280 Q 580,240 480,210", "color": "#60a5fa", "width": 2.2, "tx": 610, "ty": 225},
        ],
        "UK": [
            {"name": "Ganga (Bhagirathi / Alaknanda)", "d": "M 610,180 Q 460,320 340,460 T 240,640", "color": "#38bdf8", "width": 3.2, "tx": 440, "ty": 320},
            {"name": "Yamuna Upper Gorge", "d": "M 320,160 Q 280,280 240,410", "color": "#0284c7", "width": 2.5, "tx": 260, "ty": 260},
        ],
    }

    # Hotspot points per state
    HOTSPOTS: Dict[str, List[Dict[str, float]]] = {
        "UP": [{"cx": 215, "cy": 385}, {"cx": 115, "cy": 275}, {"cx": 140, "cy": 235}, {"cx": 250, "cy": 580}],
        "MH": [{"cx": 220, "cy": 520}, {"cx": 450, "cy": 380}, {"cx": 320, "cy": 460}],
        "RJ": [{"cx": 540, "cy": 320}, {"cx": 360, "cy": 420}, {"cx": 480, "cy": 510}],
        "KA": [{"cx": 620, "cy": 610}, {"cx": 380, "cy": 320}],
        "TN": [{"cx": 520, "cy": 380}, {"cx": 680, "cy": 220}],
        "PB": [{"cx": 380, "cy": 420}, {"cx": 540, "cy": 410}],
        "DL": [{"cx": 480, "cy": 480}, {"cx": 360, "cy": 320}],
    }

    # IoT telemetry stations per state
    IOT_SENSORS: Dict[str, List[Dict[str, float]]] = {
        "UP": [{"cx": 485, "cy": 380}, {"cx": 585, "cy": 530}, {"cx": 340, "cy": 280}, {"cx": 690, "cy": 420}, {"cx": 120, "cy": 115}],
        "MH": [{"cx": 360, "cy": 340}, {"cx": 540, "cy": 440}, {"cx": 680, "cy": 260}, {"cx": 240, "cy": 480}],
        "RJ": [{"cx": 420, "cy": 380}, {"cx": 560, "cy": 440}, {"cx": 310, "cy": 480}],
        "KA": [{"cx": 450, "cy": 420}, {"cx": 580, "cy": 560}, {"cx": 380, "cy": 260}],
        "TN": [{"cx": 480, "cy": 460}, {"cx": 580, "cy": 320}, {"cx": 360, "cy": 590}],
        "PB": [{"cx": 440, "cy": 360}, {"cx": 560, "cy": 460}],
        "DL": [{"cx": 510, "cy": 390}, {"cx": 420, "cy": 460}, {"cx": 560, "cy": 520}],
    }

    @classmethod
    def get_instance(cls) -> "GeospatialEngine":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def get_rivers_for_state(self, state_code: str) -> List[Dict[str, Any]]:
        clean_code = state_code.upper().replace("IN-", "")
        return self.RIVER_LAYERS.get(clean_code, [
            {"name": "State Principal River Basin", "d": "M 180,280 Q 440,360 620,410 T 820,490", "color": "#38bdf8", "width": 2.8, "tx": 420, "ty": 340}
        ])

    def get_hotspots_for_state(self, state_code: str, districts: List[Dict[str, Any]]) -> List[Dict[str, float]]:
        clean_code = state_code.upper().replace("IN-", "")
        if clean_code in self.HOTSPOTS:
            return self.HOTSPOTS[clean_code]
        
        # Derive dynamically from highest stress districts
        spots = []
        sorted_dists = sorted(
            districts,
            key=lambda d: d.get("modernWaterMetrics", {}).get("waterStressScore", 0),
            reverse=True
        )
        for d in sorted_dists[:3]:
            proj = d.get("projected")
            if proj and len(proj) == 2:
                spots.append({"cx": proj[0], "cy": proj[1]})
        return spots or [{"cx": 460, "cy": 380}]

    def get_iot_sensors_for_state(self, state_code: str, districts: List[Dict[str, Any]]) -> List[Dict[str, float]]:
        clean_code = state_code.upper().replace("IN-", "")
        if clean_code in self.IOT_SENSORS:
            return self.IOT_SENSORS[clean_code]
            
        sensors = []
        for i, d in enumerate(districts[:5]):
            proj = d.get("projected")
            if proj and len(proj) == 2:
                # Slight offset from center for sensor placement
                sensors.append({"cx": proj[0] + 8, "cy": proj[1] - 8})
        return sensors or [{"cx": 460, "cy": 380}]


geospatial_engine = GeospatialEngine.get_instance()
