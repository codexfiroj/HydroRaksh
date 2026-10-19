"""
Pan-India Administrative Geography Registry for JalSuraksha.
Covers all 28 Indian States and 8 Union Territories with official ISO 3166-2:IN / LGD identifiers,
administrative hierarchy terminologies (Tehsil, Taluka, Mandal, CD Block),
district relationships, spelling normalization, and reorganization historical mapping.
"""

from typing import List, Dict, Any, Optional
import unicodedata
import re

# 28 States and 8 Union Territories of India (36 Administrative Units)
INDIAN_STATES_AND_UTS: List[Dict[str, Any]] = [
    {
        "code": "IN-AP", "lgd_code": 28, "name": "Andhra Pradesh", "type": "State", "capital": "Amaravati",
        "subdistrict_term": "Mandal", "block_term": "Revenue Division",
        "primary_terrain": "Peninsular Crystalline Hard Rock & Coastal Alluvium",
        "major_basins": ["Godavari", "Krishna", "Pennar"],
        "center_lat": 15.9129, "center_lon": 79.7400, "district_count": 26
    },
    {
        "code": "IN-AR", "lgd_code": 12, "name": "Arunachal Pradesh", "type": "State", "capital": "Itanagar",
        "subdistrict_term": "Circle", "block_term": "Sub-Division",
        "primary_terrain": "Himalayan Metamorphic & Sedimentary",
        "major_basins": ["Brahmaputra", "Subansiri"],
        "center_lat": 28.2180, "center_lon": 94.7278, "district_count": 26
    },
    {
        "code": "IN-AS", "lgd_code": 18, "name": "Assam", "type": "State", "capital": "Dispur",
        "subdistrict_term": "Revenue Circle", "block_term": "Development Block",
        "primary_terrain": "Brahmaputra Alluvial Plain",
        "major_basins": ["Brahmaputra", "Barak"],
        "center_lat": 26.2006, "center_lon": 92.9376, "district_count": 35
    },
    {
        "code": "IN-BR", "lgd_code": 10, "name": "Bihar", "type": "State", "capital": "Patna",
        "subdistrict_term": "CD Block", "block_term": "Sub-Division",
        "primary_terrain": "Middle Gangetic Deep Alluvium",
        "major_basins": ["Ganga", "Gandak", "Kosi", "Son"],
        "center_lat": 25.0961, "center_lon": 85.3131, "district_count": 38
    },
    {
        "code": "IN-CT", "lgd_code": 22, "name": "Chhattisgarh", "type": "State", "capital": "Raipur",
        "subdistrict_term": "Tehsil", "block_term": "Development Block",
        "primary_terrain": "Chotanagpur Granitic Gneiss & Karst Limestones",
        "major_basins": ["Mahanadi", "Godavari (Indravati)"],
        "center_lat": 21.2787, "center_lon": 81.8661, "district_count": 33
    },
    {
        "code": "IN-GA", "lgd_code": 30, "name": "Goa", "type": "State", "capital": "Panaji",
        "subdistrict_term": "Taluka", "block_term": "Sub-Division",
        "primary_terrain": "Western Ghats Lateritic & Coastal Strip",
        "major_basins": ["Mandovi", "Zuari"],
        "center_lat": 15.2993, "center_lon": 74.1240, "district_count": 2
    },
    {
        "code": "IN-GJ", "lgd_code": 24, "name": "Gujarat", "type": "State", "capital": "Gandhinagar",
        "subdistrict_term": "Taluka", "block_term": "Sub-Division",
        "primary_terrain": "Deccan Trap Basalt, Coastal Saline & Cambay Alluvium",
        "major_basins": ["Narmada", "Tapi", "Sabarmati", "Mahi"],
        "center_lat": 22.2587, "center_lon": 71.1924, "district_count": 33
    },
    {
        "code": "IN-HR", "lgd_code": 6, "name": "Haryana", "type": "State", "capital": "Chandigarh",
        "subdistrict_term": "Tehsil", "block_term": "Development Block",
        "primary_terrain": "Indo-Gangetic Alluvial & Semi-Arid Sandy",
        "major_basins": ["Yamuna", "Ghaggar"],
        "center_lat": 29.0588, "center_lon": 76.0856, "district_count": 22
    },
    {
        "code": "IN-HP", "lgd_code": 2, "name": "Himachal Pradesh", "type": "State", "capital": "Shimla",
        "subdistrict_term": "Tehsil", "block_term": "Development Block",
        "primary_terrain": "Himalayan Crystalline & Valley Fill Deposits",
        "major_basins": ["Sutlej", "Beas", "Ravi", "Chenab", "Yamuna"],
        "center_lat": 31.1048, "center_lon": 77.1734, "district_count": 12
    },
    {
        "code": "IN-JH", "lgd_code": 20, "name": "Jharkhand", "type": "State", "capital": "Ranchi",
        "subdistrict_term": "Block", "block_term": "Sub-Division",
        "primary_terrain": "Chotanagpur Crystalline Granite-Gneiss & Gondwana Basins",
        "major_basins": ["Damodar", "Subarnarekha", "North Koel"],
        "center_lat": 23.6102, "center_lon": 85.2799, "district_count": 24
    },
    {
        "code": "IN-KA", "lgd_code": 29, "name": "Karnataka", "type": "State", "capital": "Bengaluru",
        "subdistrict_term": "Taluk", "block_term": "Hobli / Circle",
        "primary_terrain": "Deccan Crystalline Peninsular Gneiss & Deccan Basalt",
        "major_basins": ["Krishna", "Cauvery", "Godavari", "Pennar"],
        "center_lat": 15.3173, "center_lon": 75.7139, "district_count": 31
    },
    {
        "code": "IN-KL", "lgd_code": 32, "name": "Kerala", "type": "State", "capital": "Thiruvananthapuram",
        "subdistrict_term": "Taluk", "block_term": "Block Panchayat",
        "primary_terrain": "Western Ghats Charnockite & Coastal Sedimentary",
        "major_basins": ["Periyar", "Bharathapuzha", "Pamba"],
        "center_lat": 10.8505, "center_lon": 76.2711, "district_count": 14
    },
    {
        "code": "IN-MP", "lgd_code": 23, "name": "Madhya Pradesh", "type": "State", "capital": "Bhopal",
        "subdistrict_term": "Tehsil", "block_term": "Janpad Panchayat",
        "primary_terrain": "Vindhyan Sandstone, Deccan Basalt & Bundelkhand Granite",
        "major_basins": ["Narmada", "Chambal", "Betwa", "Son", "Tapi"],
        "center_lat": 22.9734, "center_lon": 78.6569, "district_count": 55
    },
    {
        "code": "IN-MH", "lgd_code": 27, "name": "Maharashtra", "type": "State", "capital": "Mumbai",
        "subdistrict_term": "Taluka", "block_term": "Panchayat Samiti",
        "primary_terrain": "Deccan Volcanic Basalt (Hard Rock)",
        "major_basins": ["Godavari", "Krishna", "Tapi", "Bhima"],
        "center_lat": 19.7515, "center_lon": 75.7139, "district_count": 36
    },
    {
        "code": "IN-MN", "lgd_code": 14, "name": "Manipur", "type": "State", "capital": "Imphal",
        "subdistrict_term": "Sub-Division", "block_term": "Block",
        "primary_terrain": "Indo-Burman Orogeny Folded Sedimentary",
        "major_basins": ["Barak", "Manipur (Chindwin)"],
        "center_lat": 24.6637, "center_lon": 93.9063, "district_count": 16
    },
    {
        "code": "IN-ML", "lgd_code": 17, "name": "Meghalaya", "type": "State", "capital": "Shillong",
        "subdistrict_term": "C&RD Block", "block_term": "Sub-Division",
        "primary_terrain": "Shillong Plateau Granitic Archaean & Karst Limestones",
        "major_basins": ["Brahmaputra", "Meghna (Barak)"],
        "center_lat": 25.4670, "center_lon": 91.3662, "district_count": 12
    },
    {
        "code": "IN-MZ", "lgd_code": 15, "name": "Mizoram", "type": "State", "capital": "Aizawl",
        "subdistrict_term": "RD Block", "block_term": "Sub-Division",
        "primary_terrain": "Tertiary Sandstone Ridges & Valley Sediments",
        "major_basins": ["Barak", "Kaladan"],
        "center_lat": 23.1645, "center_lon": 92.9376, "district_count": 11
    },
    {
        "code": "IN-NL", "lgd_code": 13, "name": "Nagaland", "type": "State", "capital": "Kohima",
        "subdistrict_term": "Circle", "block_term": "Sub-Division",
        "primary_terrain": "Naga Hills Folded Tertiary Sedimentary",
        "major_basins": ["Dhansiri", "Doyang"],
        "center_lat": 26.1584, "center_lon": 94.5624, "district_count": 16
    },
    {
        "code": "IN-OR", "lgd_code": 21, "name": "Odisha", "type": "State", "capital": "Bhubaneswar",
        "subdistrict_term": "Tahasil", "block_term": "Panchayat Samiti",
        "primary_terrain": "Eastern Ghats Charnockite & Coastal Deltaic Alluvium",
        "major_basins": ["Mahanadi", "Brahmani", "Baitarani"],
        "center_lat": 20.9517, "center_lon": 85.0985, "district_count": 30
    },
    {
        "code": "IN-PB", "lgd_code": 3, "name": "Punjab", "type": "State", "capital": "Chandigarh",
        "subdistrict_term": "Tehsil", "block_term": "Development Block",
        "primary_terrain": "Indus Deep Alluvial Plains",
        "major_basins": ["Sutlej", "Beas", "Ravi"],
        "center_lat": 31.1471, "center_lon": 75.3412, "district_count": 23
    },
    {
        "code": "IN-RJ", "lgd_code": 8, "name": "Rajasthan", "type": "State", "capital": "Jaipur",
        "subdistrict_term": "Tehsil", "block_term": "Panchayat Samiti",
        "primary_terrain": "Aravalli Metamorphic, Marwar Sandstone & Thar Desert Sands",
        "major_basins": ["Chambal", "Luni", "Banas", "Sabarmati"],
        "center_lat": 27.0238, "center_lon": 74.2179, "district_count": 50
    },
    {
        "code": "IN-SK", "lgd_code": 11, "name": "Sikkim", "type": "State", "capital": "Gangtok",
        "subdistrict_term": "Sub-Division", "block_term": "Revenue Block",
        "primary_terrain": "Higher Himalayan Gneiss & Glacial Moraines",
        "major_basins": ["Teesta", "Rangeet"],
        "center_lat": 27.5330, "center_lon": 88.5122, "district_count": 6
    },
    {
        "code": "IN-TN", "lgd_code": 33, "name": "Tamil Nadu", "type": "State", "capital": "Chennai",
        "subdistrict_term": "Taluk", "block_term": "Panchayat Union",
        "primary_terrain": "Peninsular Archaean Hard Rock & Cauvery Deltaic Sediments",
        "major_basins": ["Cauvery", "Vaigai", "Palar", "Thamirabarani"],
        "center_lat": 11.1271, "center_lon": 78.6569, "district_count": 38
    },
    {
        "code": "IN-TG", "lgd_code": 36, "name": "Telangana", "type": "State", "capital": "Hyderabad",
        "subdistrict_term": "Mandal", "block_term": "Revenue Division",
        "primary_terrain": "Granitic Hard Rock (Deccan Plateau)",
        "major_basins": ["Godavari", "Krishna"],
        "center_lat": 18.1124, "center_lon": 79.0193, "district_count": 33
    },
    {
        "code": "IN-TR", "lgd_code": 16, "name": "Tripura", "type": "State", "capital": "Agartala",
        "subdistrict_term": "Sub-Division", "block_term": "RD Block",
        "primary_terrain": "Folded Tertiary Sandstone & River Valley Alluvium",
        "major_basins": ["Gomati", "Howrah", "Manu"],
        "center_lat": 23.9408, "center_lon": 91.9882, "district_count": 8
    },
    {
        "code": "IN-UP", "lgd_code": 9, "name": "Uttar Pradesh", "type": "State", "capital": "Lucknow",
        "subdistrict_term": "Tehsil", "block_term": "Development Block",
        "primary_terrain": "Indo-Gangetic Deep Quaternary Alluvium & Bundelkhand Crystalline",
        "major_basins": ["Ganga", "Yamuna", "Gomti", "Ghaghara", "Betwa", "Son"],
        "center_lat": 26.8467, "center_lon": 80.9462, "district_count": 75
    },
    {
        "code": "IN-UT", "lgd_code": 5, "name": "Uttarakhand", "type": "State", "capital": "Dehradun",
        "subdistrict_term": "Tehsil", "block_term": "Development Block",
        "primary_terrain": "Shiwalik Sediments, Terai-Bhabar Gravels & Himalayan Hard Rock",
        "major_basins": ["Ganga", "Yamuna", "Alaknanda", "Bhagirathi", "Ramganga"],
        "center_lat": 30.0668, "center_lon": 79.0193, "district_count": 13
    },
    {
        "code": "IN-WB", "lgd_code": 19, "name": "West Bengal", "type": "State", "capital": "Kolkata",
        "subdistrict_term": "CD Block", "block_term": "Sub-Division",
        "primary_terrain": "Bengal Deltaic Deep Alluvium, Coastal Saline & Rarh Laterite",
        "major_basins": ["Ganga (Hooghly)", "Damodar", "Teesta"],
        "center_lat": 22.9868, "center_lon": 87.8550, "district_count": 23
    },
    # 8 Union Territories
    {
        "code": "IN-AN", "lgd_code": 35, "name": "Andaman and Nicobar Islands", "type": "Union Territory", "capital": "Port Blair",
        "subdistrict_term": "Tehsil", "block_term": "Sub-Division",
        "primary_terrain": "Ophiolite Suites & Marine Sedimentary Terraces",
        "major_basins": ["Island Streams"],
        "center_lat": 11.7401, "center_lon": 92.6586, "district_count": 3
    },
    {
        "code": "IN-CH", "lgd_code": 4, "name": "Chandigarh", "type": "Union Territory", "capital": "Chandigarh",
        "subdistrict_term": "Sub-Division", "block_term": "Sector",
        "primary_terrain": "Shiwalik Piedmont Alluvium",
        "major_basins": ["Ghaggar (Sukhna Choe)"],
        "center_lat": 30.7333, "center_lon": 76.7794, "district_count": 1
    },
    {
        "code": "IN-DH", "lgd_code": 26, "name": "Dadra and Nagar Haveli and Daman and Diu", "type": "Union Territory", "capital": "Daman",
        "subdistrict_term": "Taluka", "block_term": "Sub-Division",
        "primary_terrain": "Deccan Basalt & Coastal Alluvial",
        "major_basins": ["Daman Ganga"],
        "center_lat": 20.4283, "center_lon": 72.8397, "district_count": 3
    },
    {
        "code": "IN-DL", "lgd_code": 7, "name": "Delhi", "type": "Union Territory", "capital": "New Delhi",
        "subdistrict_term": "Tehsil", "block_term": "Sub-Division",
        "primary_terrain": "Yamuna Active/Older Alluvium & Delhi Quartzite Ridge",
        "major_basins": ["Yamuna Basin"],
        "center_lat": 28.7041, "center_lon": 77.1025, "district_count": 11
    },
    {
        "code": "IN-JK", "lgd_code": 1, "name": "Jammu and Kashmir", "type": "Union Territory", "capital": "Srinagar (Summer) / Jammu (Winter)",
        "subdistrict_term": "Tehsil", "block_term": "Block",
        "primary_terrain": "Karewa Sedimentary Formations & Himalayan Hard Rock",
        "major_basins": ["Jhelum", "Chenab", "Tawi"],
        "center_lat": 33.7782, "center_lon": 76.5762, "district_count": 20
    },
    {
        "code": "IN-LA", "lgd_code": 37, "name": "Ladakh", "type": "Union Territory", "capital": "Leh",
        "subdistrict_term": "Tehsil", "block_term": "Sub-Division",
        "primary_terrain": "High Altitude Cold Arid Crystalline & Glacial Deposits",
        "major_basins": ["Indus", "Zanskar", "Shyok"],
        "center_lat": 34.1526, "center_lon": 77.5771, "district_count": 2
    },
    {
        "code": "IN-LD", "lgd_code": 31, "name": "Lakshadweep", "type": "Union Territory", "capital": "Kavaratti",
        "subdistrict_term": "Sub-Division", "block_term": "Island Unit",
        "primary_terrain": "Coral Atoll Calcareous Sand & Ghyben-Herzberg Lens",
        "major_basins": ["Coastal Marine"],
        "center_lat": 10.5667, "center_lon": 72.6417, "district_count": 1
    },
    {
        "code": "IN-PY", "lgd_code": 34, "name": "Puducherry", "type": "Union Territory", "capital": "Puducherry",
        "subdistrict_term": "Taluk", "block_term": "Commune Panchayat",
        "primary_terrain": "Coastal Sedimentary & Tertiary Sandstone",
        "major_basins": ["Gingee", "Ponnaiyar", "Cauvery"],
        "center_lat": 11.9416, "center_lon": 79.8083, "district_count": 4
    }
]

# Canonical District Registry covering all States & UTs with real hydrogeological parameters,
# soil attributes, rainfall regimes, CGWB extraction stages, and historical reorganization aliases
# Full Uttar Pradesh Canonical 75 Districts Dataset
UP_DISTRICTS_RAW: List[Dict[str, Any]] = [
    # Saharanpur & Meerut (Upper Doab)
    {"id": "saharanpur", "name": "Saharanpur", "division": "Saharanpur", "region": "Upper Doab", "lat": 29.96, "lng": 77.55, "area": 3689, "basin": "Yamuna & Hindon", "gw": 14.2, "trend": -22, "cat": "Semi-Critical", "rain": 980, "soil": "Alluvial Sandy Loam", "slope": 1.4, "stage": 86.4, "demand": 412},
    {"id": "shamli", "name": "Shamli", "division": "Saharanpur", "region": "Upper Doab", "lat": 29.45, "lng": 77.31, "area": 1167, "basin": "Yamuna Basin", "gw": 24.8, "trend": -38, "cat": "Over-Exploited", "rain": 760, "soil": "Deep Sandy Alluvium", "slope": 1.1, "stage": 138.2, "demand": 380},
    {"id": "muzaffarnagar", "name": "Muzaffarnagar", "division": "Saharanpur", "region": "Upper Doab", "lat": 29.47, "lng": 77.70, "area": 2945, "basin": "Ganga & Kali", "gw": 22.1, "trend": -35, "cat": "Over-Exploited", "rain": 820, "soil": "Alluvial Silt Loam", "slope": 1.0, "stage": 124.5, "demand": 590},
    {"id": "baghpat", "name": "Baghpat", "division": "Meerut", "region": "Upper Doab", "lat": 28.94, "lng": 77.22, "area": 1321, "basin": "Yamuna Basin", "gw": 26.5, "trend": -42, "cat": "Over-Exploited", "rain": 690, "soil": "Sandy Loam Alluvium", "slope": 0.9, "stage": 145.8, "demand": 340},
    {"id": "meerut", "name": "Meerut", "division": "Meerut", "region": "Upper Doab", "lat": 28.98, "lng": 77.70, "area": 2559, "basin": "Hindon & Kali", "gw": 21.4, "trend": -31, "cat": "Critical", "rain": 840, "soil": "Fine Alluvial Silt", "slope": 1.2, "stage": 98.4, "demand": 620},
    {"id": "ghaziabad", "name": "Ghaziabad", "division": "Meerut", "region": "Upper Doab", "lat": 28.67, "lng": 77.45, "area": 777, "basin": "Hindon Basin", "gw": 29.2, "trend": -48, "cat": "Over-Exploited", "rain": 710, "soil": "Deep Sandy Alluvium", "slope": 0.8, "stage": 154.2, "demand": 480},
    {"id": "hapur", "name": "Hapur", "division": "Meerut", "region": "Upper Doab", "lat": 28.73, "lng": 77.78, "area": 1124, "basin": "Ganga Basin", "gw": 19.8, "trend": -28, "cat": "Critical", "rain": 790, "soil": "Alluvial Loam", "slope": 1.1, "stage": 94.6, "demand": 310},
    {"id": "gautam-buddha-nagar", "name": "Gautam Buddha Nagar", "division": "Meerut", "region": "Upper Doab", "lat": 28.35, "lng": 77.55, "area": 1442, "basin": "Yamuna Basin", "gw": 28.6, "trend": -45, "cat": "Over-Exploited", "rain": 680, "soil": "Sandy Alluvium", "slope": 0.7, "stage": 142.1, "demand": 510},
    {"id": "bulandshahr", "name": "Bulandshahr", "division": "Meerut", "region": "Upper Doab", "lat": 28.40, "lng": 77.85, "area": 4512, "basin": "Ganga Basin", "gw": 18.2, "trend": -25, "cat": "Semi-Critical", "rain": 750, "soil": "Alluvial Loam", "slope": 1.3, "stage": 88.5, "demand": 640},

    # Moradabad & Bareilly (Rohilkhand)
    {"id": "amroha", "name": "Amroha", "division": "Moradabad", "region": "Rohilkhand", "lat": 28.90, "lng": 78.47, "area": 2249, "basin": "Ganga & Ban", "gw": 15.6, "trend": -20, "cat": "Semi-Critical", "rain": 890, "soil": "Silt Loam", "slope": 1.2, "stage": 82.4, "demand": 390},
    {"id": "bijnor", "name": "Bijnor", "division": "Moradabad", "region": "Rohilkhand", "lat": 29.37, "lng": 78.13, "area": 4561, "basin": "Ganga & Malin", "gw": 11.2, "trend": -12, "cat": "Safe", "rain": 1050, "soil": "Coarse Alluvial Sand", "slope": 1.6, "stage": 64.2, "demand": 580},
    {"id": "moradabad", "name": "Moradabad", "division": "Moradabad", "region": "Rohilkhand", "lat": 28.83, "lng": 78.78, "area": 3718, "basin": "Ramganga Basin", "gw": 16.4, "trend": -24, "cat": "Semi-Critical", "rain": 920, "soil": "Ramganga Alluvium", "slope": 1.1, "stage": 86.8, "demand": 540},
    {"id": "rampur", "name": "Rampur", "division": "Moradabad", "region": "Rohilkhand", "lat": 28.81, "lng": 79.02, "area": 2367, "basin": "Kosi & Ramganga", "gw": 12.8, "trend": -15, "cat": "Safe", "rain": 960, "soil": "Fine Silt", "slope": 1.0, "stage": 68.5, "demand": 380},
    {"id": "sambhal", "name": "Sambhal", "division": "Moradabad", "region": "Rohilkhand", "lat": 28.58, "lng": 78.57, "area": 2453, "basin": "Sot & Ganga", "gw": 20.1, "trend": -32, "cat": "Critical", "rain": 810, "soil": "Sandy Loam", "slope": 1.1, "stage": 96.2, "demand": 410},
    {"id": "bareilly", "name": "Bareilly", "division": "Bareilly", "region": "Rohilkhand", "lat": 28.36, "lng": 79.41, "area": 4120, "basin": "Ramganga Basin", "gw": 13.9, "trend": -18, "cat": "Safe", "rain": 1020, "soil": "Fine Alluvial Silt", "slope": 1.3, "stage": 69.4, "demand": 620},
    {"id": "budaun", "name": "Budaun", "division": "Bareilly", "region": "Rohilkhand", "lat": 28.03, "lng": 79.12, "area": 5168, "basin": "Sot & Ganga", "gw": 17.5, "trend": -26, "cat": "Semi-Critical", "rain": 830, "soil": "Loamy Sand", "slope": 1.2, "stage": 87.1, "demand": 590},
    {"id": "pilibhit", "name": "Pilibhit", "division": "Bareilly", "region": "Rohilkhand", "lat": 28.63, "lng": 79.80, "area": 3686, "basin": "Gomti & Sharda", "gw": 7.4, "trend": -5, "cat": "Safe", "rain": 1250, "soil": "Terai Alluvium", "slope": 0.8, "stage": 48.6, "demand": 460},
    {"id": "shahjahanpur", "name": "Shahjahanpur", "division": "Bareilly", "region": "Rohilkhand", "lat": 27.88, "lng": 79.91, "area": 4388, "basin": "Garra & Ramganga", "gw": 12.1, "trend": -14, "cat": "Safe", "rain": 980, "soil": "Clayey Silt", "slope": 1.0, "stage": 65.3, "demand": 510},

    # Aligarh & Agra (Braj)
    {"id": "aligarh", "name": "Aligarh", "division": "Aligarh", "region": "Braj", "lat": 27.89, "lng": 78.08, "area": 3700, "basin": "Yamuna & Karwan", "gw": 23.4, "trend": -36, "cat": "Over-Exploited", "rain": 720, "soil": "Saline / Silt Loam", "slope": 1.2, "stage": 118.4, "demand": 560},
    {"id": "etah", "name": "Etah", "division": "Aligarh", "region": "Braj / Doab", "lat": 27.56, "lng": 78.66, "area": 2456, "basin": "Isan & Kali", "gw": 16.9, "trend": -22, "cat": "Semi-Critical", "rain": 740, "soil": "Alluvial Loam", "slope": 1.1, "stage": 84.2, "demand": 380},
    {"id": "hathras", "name": "Hathras", "division": "Aligarh", "region": "Braj", "lat": 27.60, "lng": 78.05, "area": 1840, "basin": "Karwan Basin", "gw": 24.1, "trend": -37, "cat": "Over-Exploited", "rain": 690, "soil": "Sandy Alluvium", "slope": 1.0, "stage": 128.6, "demand": 350},
    {"id": "kasganj", "name": "Kasganj", "division": "Aligarh", "region": "Braj / Doab", "lat": 27.80, "lng": 78.64, "area": 1955, "basin": "Ganga & Kali", "gw": 15.3, "trend": -19, "cat": "Safe", "rain": 780, "soil": "Alluvial Silt", "slope": 1.1, "stage": 69.8, "demand": 310},
    {"id": "agra", "name": "Agra", "division": "Agra", "region": "Braj", "lat": 27.18, "lng": 78.00, "area": 4041, "basin": "Yamuna & Utangan", "gw": 27.8, "trend": -44, "cat": "Over-Exploited", "rain": 670, "soil": "Alluvial Sandy Loam", "slope": 1.8, "stage": 134.5, "demand": 680},
    {"id": "firozabad", "name": "Firozabad", "division": "Agra", "region": "Braj", "lat": 27.15, "lng": 78.39, "area": 2407, "basin": "Yamuna & Sirsa", "gw": 25.6, "trend": -40, "cat": "Over-Exploited", "rain": 690, "soil": "Sandy Silt", "slope": 1.5, "stage": 126.8, "demand": 420},
    {"id": "mainpuri", "name": "Mainpuri", "division": "Agra", "region": "Braj / Doab", "lat": 27.23, "lng": 79.02, "area": 2760, "basin": "Isan & Arind", "gw": 17.2, "trend": -21, "cat": "Semi-Critical", "rain": 760, "soil": "Alluvial Loam", "slope": 1.2, "stage": 86.4, "demand": 390},
    {"id": "mathura", "name": "Mathura", "division": "Agra", "region": "Braj", "lat": 27.49, "lng": 77.67, "area": 3329, "basin": "Yamuna Basin", "gw": 22.9, "trend": -34, "cat": "Critical", "rain": 610, "soil": "Saline Sandy Loam", "slope": 1.4, "stage": 98.7, "demand": 540},

    # Kanpur & Central Doab
    {"id": "auraiya", "name": "Auraiya", "division": "Kanpur", "region": "Doab", "lat": 26.46, "lng": 79.51, "area": 2016, "basin": "Yamuna & Sengar", "gw": 16.5, "trend": -20, "cat": "Semi-Critical", "rain": 780, "soil": "Ravine Silt Alluvium", "slope": 2.2, "stage": 81.5, "demand": 320},
    {"id": "etawah", "name": "Etawah", "division": "Kanpur", "region": "Doab", "lat": 26.78, "lng": 79.03, "area": 2311, "basin": "Chambal & Yamuna", "gw": 18.4, "trend": -24, "cat": "Semi-Critical", "rain": 750, "soil": "Chambal Ravine Silt", "slope": 2.5, "stage": 84.8, "demand": 360},
    {"id": "farrukhabad", "name": "Farrukhabad", "division": "Kanpur", "region": "Doab", "lat": 27.38, "lng": 79.58, "area": 2183, "basin": "Ganga & Ramganga", "gw": 13.5, "trend": -16, "cat": "Safe", "rain": 820, "soil": "Alluvial Fine Sand", "slope": 1.1, "stage": 67.2, "demand": 370},
    {"id": "kannauj", "name": "Kannauj", "division": "Kanpur", "region": "Doab", "lat": 27.05, "lng": 79.91, "area": 2093, "basin": "Ganga & Kali", "gw": 14.8, "trend": -18, "cat": "Safe", "rain": 840, "soil": "Alluvial Loam", "slope": 1.2, "stage": 69.5, "demand": 350},
    {"id": "kanpur-dehat", "name": "Kanpur Dehat", "division": "Kanpur", "region": "Doab", "lat": 26.44, "lng": 79.95, "area": 3021, "basin": "Yamuna & Rind", "gw": 17.8, "trend": -23, "cat": "Semi-Critical", "rain": 810, "soil": "Indo-Gangetic Alluvium", "slope": 1.3, "stage": 86.0, "demand": 410},
    {"id": "kanpur-nagar", "name": "Kanpur Nagar", "division": "Kanpur", "region": "Doab", "lat": 26.45, "lng": 80.33, "area": 3155, "basin": "Ganga & Pandu", "gw": 24.3, "trend": -39, "cat": "Critical", "rain": 820, "soil": "Alluvial Heavy Clay", "slope": 1.1, "stage": 98.2, "demand": 780},

    # Lucknow & Awadh
    {"id": "hardoi", "name": "Hardoi", "division": "Lucknow", "region": "Awadh", "lat": 27.39, "lng": 80.13, "area": 5986, "basin": "Gomti & Sai", "gw": 11.9, "trend": -14, "cat": "Safe", "rain": 910, "soil": "Alluvial Loam", "slope": 1.0, "stage": 62.4, "demand": 620},
    {"id": "kheri", "name": "Lakhimpur Kheri", "division": "Lucknow", "region": "Terai / Awadh", "lat": 27.94, "lng": 80.77, "area": 7680, "basin": "Sharda & Ghaghara", "gw": 6.8, "trend": -4, "cat": "Safe", "rain": 1280, "soil": "Terai Clayey Loam", "slope": 0.6, "stage": 38.5, "demand": 590},
    {"id": "lucknow", "name": "Lucknow", "division": "Lucknow", "region": "Awadh", "lat": 26.84, "lng": 80.94, "area": 2528, "basin": "Gomti Basin", "gw": 21.6, "trend": -36, "cat": "Critical", "rain": 890, "soil": "Gomti Alluvial Silt", "slope": 1.1, "stage": 97.4, "demand": 690},
    {"id": "raebareli", "name": "Raebareli", "division": "Lucknow", "region": "Awadh", "lat": 26.22, "lng": 81.24, "area": 4609, "basin": "Ganga & Sai", "gw": 15.1, "trend": -19, "cat": "Semi-Critical", "rain": 870, "soil": "Alluvial Clay Loam", "slope": 1.2, "stage": 79.2, "demand": 480},
    {"id": "sitapur", "name": "Sitapur", "division": "Lucknow", "region": "Awadh", "lat": 27.56, "lng": 80.68, "area": 5743, "basin": "Gomti & Sarayan", "gw": 9.2, "trend": -8, "cat": "Safe", "rain": 1050, "soil": "Alluvial Silt", "slope": 0.9, "stage": 54.1, "demand": 560},
    {"id": "unnao", "name": "Unnao", "division": "Lucknow", "region": "Awadh", "lat": 26.54, "lng": 80.49, "area": 4558, "basin": "Ganga & Sai", "gw": 16.2, "trend": -21, "cat": "Semi-Critical", "rain": 850, "soil": "Alluvial Silt Loam", "slope": 1.1, "stage": 83.5, "demand": 510},

    # Ayodhya & Devipatan
    {"id": "amethi", "name": "Amethi", "division": "Ayodhya", "region": "Awadh", "lat": 26.15, "lng": 81.81, "area": 2329, "basin": "Gomti & Sai", "gw": 14.2, "trend": -17, "cat": "Safe", "rain": 930, "soil": "Alluvial Loam", "slope": 1.1, "stage": 68.2, "demand": 340},
    {"id": "ayodhya", "name": "Ayodhya", "division": "Ayodhya", "region": "Awadh", "lat": 26.79, "lng": 82.19, "area": 2341, "basin": "Saryu (Ghaghara)", "gw": 10.4, "trend": -10, "cat": "Safe", "rain": 1040, "soil": "Saryu Alluvium", "slope": 1.0, "stage": 58.4, "demand": 410},
    {"id": "barabanki", "name": "Barabanki", "division": "Ayodhya", "region": "Awadh", "lat": 26.92, "lng": 81.18, "area": 4402, "basin": "Ghaghara & Gomti", "gw": 12.4, "trend": -15, "cat": "Safe", "rain": 970, "soil": "Alluvial Loam", "slope": 1.0, "stage": 64.8, "demand": 490},
    {"id": "sultanpur", "name": "Sultanpur", "division": "Ayodhya", "region": "Awadh", "lat": 26.26, "lng": 82.07, "area": 2673, "basin": "Gomti Basin", "gw": 13.8, "trend": -16, "cat": "Safe", "rain": 950, "soil": "Gomti Alluvium", "slope": 1.1, "stage": 67.5, "demand": 390},
    {"id": "ambedkar-nagar", "name": "Ambedkar Nagar", "division": "Ayodhya", "region": "Awadh", "lat": 26.44, "lng": 82.69, "area": 2350, "basin": "Ghaghara & Majhoi", "gw": 11.5, "trend": -12, "cat": "Safe", "rain": 990, "soil": "Alluvial Silt", "slope": 1.0, "stage": 61.2, "demand": 360},
    {"id": "bahraich", "name": "Bahraich", "division": "Devipatan", "region": "Terai", "lat": 27.57, "lng": 81.59, "area": 4697, "basin": "Ghaghara & Saryu", "gw": 7.9, "trend": -6, "cat": "Safe", "rain": 1210, "soil": "Terai Silt", "slope": 0.7, "stage": 44.8, "demand": 470},
    {"id": "balrampur", "name": "Balrampur", "division": "Devipatan", "region": "Terai", "lat": 27.43, "lng": 82.18, "area": 3349, "basin": "Rapti Basin", "gw": 6.5, "trend": -4, "cat": "Safe", "rain": 1320, "soil": "Terai Clay", "slope": 0.8, "stage": 36.2, "demand": 380},
    {"id": "gonda", "name": "Gonda", "division": "Devipatan", "region": "Terai", "lat": 27.13, "lng": 81.96, "area": 3404, "basin": "Ghaghara & Kuwana", "gw": 9.8, "trend": -9, "cat": "Safe", "rain": 1100, "soil": "Alluvial Loam", "slope": 0.9, "stage": 52.6, "demand": 440},
    {"id": "shravasti", "name": "Shravasti", "division": "Devipatan", "region": "Terai", "lat": 27.50, "lng": 82.03, "area": 1640, "basin": "Rapti Basin", "gw": 6.9, "trend": -5, "cat": "Safe", "rain": 1290, "soil": "Terai Alluvium", "slope": 0.8, "stage": 39.4, "demand": 240},

    # Gorakhpur & Basti
    {"id": "basti", "name": "Basti", "division": "Basti", "region": "Purvanchal", "lat": 26.80, "lng": 82.76, "area": 2688, "basin": "Kuwano & Manorama", "gw": 10.6, "trend": -11, "cat": "Safe", "rain": 1060, "soil": "Alluvial Silt", "slope": 1.0, "stage": 56.8, "demand": 420},
    {"id": "sant-kabir-nagar", "name": "Sant Kabir Nagar", "division": "Basti", "region": "Purvanchal", "lat": 26.77, "lng": 83.03, "area": 1646, "basin": "Ami & Kuwano", "gw": 10.1, "trend": -9, "cat": "Safe", "rain": 1090, "soil": "Alluvial Loam", "slope": 0.9, "stage": 53.4, "demand": 280},
    {"id": "siddharthnagar", "name": "Siddharthnagar", "division": "Basti", "region": "Terai", "lat": 27.29, "lng": 82.81, "area": 2895, "basin": "Rapti & Banganga", "gw": 5.9, "trend": -3, "cat": "Safe", "rain": 1340, "soil": "Terai Clay", "slope": 0.7, "stage": 32.5, "demand": 360},
    {"id": "deoria", "name": "Deoria", "division": "Gorakhpur", "region": "Purvanchal", "lat": 26.50, "lng": 83.78, "area": 2540, "basin": "Ghaghara & Little Gandak", "gw": 8.7, "trend": -8, "cat": "Safe", "rain": 1140, "soil": "Gandak Alluvium", "slope": 0.9, "stage": 49.2, "demand": 440},
    {"id": "gorakhpur", "name": "Gorakhpur", "division": "Gorakhpur", "region": "Purvanchal", "lat": 26.76, "lng": 83.37, "area": 3321, "basin": "Rapti & Rohini", "gw": 8.1, "trend": -7, "cat": "Safe", "rain": 1210, "soil": "Rapti Silt Loam", "slope": 0.8, "stage": 46.5, "demand": 580},
    {"id": "kushinagar", "name": "Kushinagar", "division": "Gorakhpur", "region": "Purvanchal", "lat": 26.74, "lng": 83.89, "area": 2905, "basin": "Great Gandak & Little Gandak", "gw": 7.2, "trend": -5, "cat": "Safe", "rain": 1220, "soil": "Gandak Alluvium", "slope": 0.8, "stage": 42.1, "demand": 460},
    {"id": "maharajganj", "name": "Maharajganj", "division": "Gorakhpur", "region": "Terai", "lat": 27.14, "lng": 83.56, "area": 2952, "basin": "Rohini & Gandak", "gw": 6.1, "trend": -4, "cat": "Safe", "rain": 1390, "soil": "Terai Alluvium", "slope": 0.7, "stage": 34.0, "demand": 390},

    # Azamgarh & Varanasi
    {"id": "azamgarh", "name": "Azamgarh", "division": "Azamgarh", "region": "Purvanchal", "lat": 26.06, "lng": 83.18, "area": 4054, "basin": "Tons & Ghaghara", "gw": 12.7, "trend": -15, "cat": "Safe", "rain": 1010, "soil": "Alluvial Clay Loam", "slope": 1.0, "stage": 66.8, "demand": 590},
    {"id": "ballia", "name": "Ballia", "division": "Azamgarh", "region": "Purvanchal", "lat": 25.76, "lng": 84.15, "area": 2981, "basin": "Ganga & Ghaghara Confluence", "gw": 9.4, "trend": -9, "cat": "Safe", "rain": 1050, "soil": "Floodplain Silt", "slope": 0.8, "stage": 52.4, "demand": 470},
    {"id": "mau", "name": "Mau", "division": "Azamgarh", "region": "Purvanchal", "lat": 26.00, "lng": 83.56, "area": 1713, "basin": "Tons Basin", "gw": 11.2, "trend": -13, "cat": "Safe", "rain": 1030, "soil": "Alluvial Loam", "slope": 1.0, "stage": 59.8, "demand": 310},
    {"id": "chandauli", "name": "Chandauli", "division": "Varanasi", "region": "Purvanchal", "lat": 25.26, "lng": 83.27, "area": 2541, "basin": "Ganga & Karamnasa", "gw": 13.1, "trend": -16, "cat": "Safe", "rain": 1080, "soil": "Rice Bowl Heavy Clay", "slope": 1.3, "stage": 65.4, "demand": 410},
    {"id": "ghazipur", "name": "Ghazipur", "division": "Varanasi", "region": "Purvanchal", "lat": 25.58, "lng": 83.57, "area": 3377, "basin": "Ganga & Gomti", "gw": 11.8, "trend": -14, "cat": "Safe", "rain": 1030, "soil": "Ganga Alluvial Silt", "slope": 1.1, "stage": 62.0, "demand": 480},
    {"id": "jaunpur", "name": "Jaunpur", "division": "Varanasi", "region": "Purvanchal", "lat": 25.75, "lng": 82.68, "area": 4038, "basin": "Gomti & Sai", "gw": 14.5, "trend": -18, "cat": "Safe", "rain": 980, "soil": "Alluvial Silt", "slope": 1.1, "stage": 71.5, "demand": 560},
    {"id": "varanasi", "name": "Varanasi", "division": "Varanasi", "region": "Purvanchal", "lat": 25.32, "lng": 82.97, "area": 1535, "basin": "Ganga, Varuna & Assi", "gw": 18.9, "trend": -27, "cat": "Critical", "rain": 1010, "soil": "Ganga Silt Loam", "slope": 1.4, "stage": 92.4, "demand": 540},

    # Mirzapur & Vindhya
    {"id": "mirzapur", "name": "Mirzapur", "division": "Mirzapur", "region": "Vindhya", "lat": 25.15, "lng": 82.57, "area": 4405, "basin": "Ganga & Belan", "gw": 17.2, "trend": -21, "cat": "Semi-Critical", "rain": 940, "soil": "Vindhyan Red Clay & Rock", "slope": 3.4, "stage": 81.2, "demand": 460},
    {"id": "bhadohi", "name": "Sant Ravidas Nagar (Bhadohi)", "division": "Mirzapur", "region": "Purvanchal", "lat": 25.39, "lng": 82.57, "area": 1015, "basin": "Ganga & Varuna", "gw": 14.1, "trend": -17, "cat": "Safe", "rain": 970, "soil": "Alluvial Silt", "slope": 1.2, "stage": 69.8, "demand": 260},
    {"id": "sonbhadra", "name": "Sonbhadra", "division": "Mirzapur", "region": "Vindhya", "lat": 24.68, "lng": 83.06, "area": 6788, "basin": "Son & Rihand", "gw": 12.5, "trend": -14, "cat": "Safe", "rain": 1090, "soil": "Hard Rock Sandstone", "slope": 4.8, "stage": 58.2, "demand": 510},

    # Prayagraj & Chitrakoot
    {"id": "fatehpur", "name": "Fatehpur", "division": "Prayagraj", "region": "Doab", "lat": 25.93, "lng": 80.81, "area": 4152, "basin": "Ganga & Yamuna", "gw": 16.8, "trend": -22, "cat": "Semi-Critical", "rain": 860, "soil": "Doab Alluvium", "slope": 1.2, "stage": 83.1, "demand": 470},
    {"id": "kaushambi", "name": "Kaushambi", "division": "Prayagraj", "region": "Doab", "lat": 25.53, "lng": 81.38, "area": 2012, "basin": "Yamuna & Sasur Khaderi", "gw": 17.4, "trend": -23, "cat": "Semi-Critical", "rain": 890, "soil": "Sandy Alluvium", "slope": 1.3, "stage": 85.6, "demand": 330},
    {"id": "pratapgarh", "name": "Pratapgarh", "division": "Prayagraj", "region": "Awadh / Purvanchal", "lat": 25.90, "lng": 81.99, "area": 3717, "basin": "Sai & Bakulahi", "gw": 13.8, "trend": -16, "cat": "Safe", "rain": 940, "soil": "Alluvial Loam", "slope": 1.1, "stage": 68.4, "demand": 460},
    {"id": "prayagraj", "name": "Prayagraj", "division": "Prayagraj", "region": "Doab / Sangam", "lat": 25.43, "lng": 81.84, "area": 5482, "basin": "Ganga & Yamuna Confluence", "gw": 19.3, "trend": -29, "cat": "Critical", "rain": 960, "soil": "Sangam Silt Alluvium", "slope": 1.3, "stage": 94.2, "demand": 740},

    # Bundelkhand
    {"id": "banda", "name": "Banda", "division": "Chitrakoot", "region": "Bundelkhand", "lat": 25.48, "lng": 80.33, "area": 4408, "basin": "Ken & Baghein", "gw": 18.6, "trend": -24, "cat": "Critical", "rain": 870, "soil": "Mixed Red & Black Soil", "slope": 3.2, "stage": 91.5, "demand": 450},
    {"id": "chitrakoot", "name": "Chitrakoot", "division": "Chitrakoot", "region": "Bundelkhand", "lat": 25.20, "lng": 80.92, "area": 3216, "basin": "Mandakini & Paisuni", "gw": 15.4, "trend": -19, "cat": "Semi-Critical", "rain": 930, "soil": "Bundelkhand Gneiss / Granite", "slope": 3.6, "stage": 78.4, "demand": 340},
    {"id": "hamirpur", "name": "Hamirpur", "division": "Chitrakoot", "region": "Bundelkhand", "lat": 25.95, "lng": 80.15, "area": 4121, "basin": "Yamuna & Betwa Confluence", "gw": 19.1, "trend": -25, "cat": "Critical", "rain": 820, "soil": "Black Cotton Soil", "slope": 2.8, "stage": 92.8, "demand": 410},
    {"id": "mahoba", "name": "Mahoba", "division": "Chitrakoot", "region": "Bundelkhand", "lat": 25.29, "lng": 79.87, "area": 3144, "basin": "Dhasan & Chandela Lakes", "gw": 20.8, "trend": -31, "cat": "Critical", "rain": 810, "soil": "Granitic Hard Rock", "slope": 3.8, "stage": 96.0, "demand": 350},
    {"id": "jalaun", "name": "Jalaun", "division": "Jhansi", "region": "Bundelkhand", "lat": 26.15, "lng": 79.35, "area": 4565, "basin": "Yamuna & Betwa", "gw": 18.2, "trend": -23, "cat": "Semi-Critical", "rain": 770, "soil": "Mixed Red Soil", "slope": 2.6, "stage": 86.4, "demand": 430},
    {"id": "jhansi", "name": "Jhansi", "division": "Jhansi", "region": "Bundelkhand", "lat": 25.44, "lng": 78.56, "area": 5024, "basin": "Betwa & Pahuj", "gw": 21.2, "trend": -28, "cat": "Critical", "rain": 840, "soil": "Bundelkhand Granitic Complex", "slope": 4.5, "stage": 95.8, "demand": 560},
    {"id": "lalitpur", "name": "Lalitpur", "division": "Jhansi", "region": "Bundelkhand", "lat": 24.69, "lng": 78.41, "area": 5039, "basin": "Betwa & Jamni", "gw": 17.9, "trend": -22, "cat": "Semi-Critical", "rain": 880, "soil": "Hard Rock / Basalt", "slope": 4.1, "stage": 84.5, "demand": 480},
]

UP_ALIASES: Dict[str, List[str]] = {
    "agra": ["Akbarabad"],
    "aligarh": ["Koil"],
    "prayagraj": ["Allahabad", "Ilahabad"],
    "ayodhya": ["Faizabad"],
    "varanasi": ["Banaras", "Kashi", "Benares"],
    "lucknow": ["Lakshmanpuri"],
    "hapur": ["Panchsheel Nagar"],
    "sambhal": ["Bhimnagar"],
    "amroha": ["Jyotiba Phule Nagar"],
    "hathras": ["Mahamaya Nagar"],
    "kasganj": ["Kanshiram Nagar"],
    "shamli": ["Prabuddhanagar"],
    "kheri": ["Lakhimpur", "Lakhimpur Kheri"],
    "kanpur-nagar": ["Kanpur"],
    "kanpur-dehat": ["Ramabai Nagar"],
    "amethi": ["Chhatrapati Shahuji Maharaj Nagar"],
    "gautam-buddha-nagar": ["Noida", "Greater Noida", "GB Nagar"],
    "bhadohi": ["Sant Ravidas Nagar", "Bhadohi"],
}

UP_CODE_MAP: Dict[str, str] = {
    "agra": "IN-UP-AGR",
    "aligarh": "IN-UP-ALG",
    "ghaziabad": "IN-UP-GZB",
    "hapur": "IN-UP-HPR",
    "meerut": "IN-UP-MRT",
    "lucknow": "IN-UP-LKO",
    "prayagraj": "IN-UP-PRY",
    "varanasi": "IN-UP-VNS",
    "jhansi": "IN-UP-JHS",
    "kheri": "IN-UP-KHR",
    "ayodhya": "IN-UP-AYO",
}

UP_CANONICAL_DISTRICTS: List[Dict[str, Any]] = []
_used_up_codes = set(UP_CODE_MAP.values())

for d in UP_DISTRICTS_RAW:
    d_id = d["id"]
    if d_id in UP_CODE_MAP:
        code = UP_CODE_MAP[d_id]
    else:
        clean_id = d_id.replace("-", "").upper()
        code_cand = f"IN-UP-{clean_id[:3]}"
        if code_cand in _used_up_codes:
            code_cand = f"IN-UP-{clean_id[:2]}{clean_id[-1]}"
        code = code_cand
    _used_up_codes.add(code)

    soil = d.get("soil", "Alluvial Loam")
    if "Alluvial" in soil or "Silt" in soil or "Loam" in soil or "Terai" in soil:
        aquifer = "Indo-Gangetic Deep Alluvium"
    elif "Bundelkhand" in soil or "Granit" in soil or "Hard Rock" in soil or "Black" in soil:
        aquifer = "Bundelkhand Crystalline Gneiss"
    else:
        aquifer = "Quaternary Alluvial Aquifer"

    gw = float(d.get("gw", 18.0))
    trend = float(d.get("trend", -25.0))
    stage = float(d.get("stage", 85.0))
    stress = min(99.0, max(15.0, round(stage * 0.6 + abs(trend) * 0.8, 1)))

    UP_CANONICAL_DISTRICTS.append({
        "id": d_id,
        "code": code,
        "name": d["name"],
        "state_code": "IN-UP",
        "state_name": "Uttar Pradesh",
        "division": d.get("division", "Central"),
        "lat": float(d.get("lat", 26.85)),
        "lon": float(d.get("lng", 80.95)),
        "area_km2": int(d.get("area", 3000)),
        "population": int(d.get("demand", 450) * 8500),
        "soil_type": soil,
        "slope_pct": float(d.get("slope", 1.2)),
        "aquifer_type": aquifer,
        "avg_rainfall_mm": float(d.get("rain", 850.0)),
        "stage_extraction_pct": stage,
        "cgwb_category": d.get("cat", "Semi-Critical"),
        "depth_m": gw,
        "trend_cm_yr": trend,
        "stress_score": stress,
        "major_basin": d.get("basin", "Ganga Basin"),
        "aliases": UP_ALIASES.get(d_id, []),
        "subdistrict_term": "Tehsil"
    })

# Canonical District Registry covering all States & UTs with real hydrogeological parameters,
# soil attributes, rainfall regimes, CGWB extraction stages, and historical reorganization aliases
PAN_INDIA_DISTRICTS: List[Dict[str, Any]] = UP_CANONICAL_DISTRICTS + [
    # --- MAHARASHTRA (IN-MH) ---
    {
        "id": "pune", "code": "IN-MH-PUN", "name": "Pune", "state_code": "IN-MH", "state_name": "Maharashtra",
        "division": "Pune", "lat": 18.52, "lon": 73.85, "area_km2": 15643, "population": 9429408,
        "soil_type": "Medium Black Basaltic Soil", "slope_pct": 3.8, "aquifer_type": "Deccan Volcanic Basalt (Vesicular/Jointed)",
        "avg_rainfall_mm": 722.0, "stage_extraction_pct": 82.5, "cgwb_category": "Semi-Critical",
        "depth_m": 14.5, "trend_cm_yr": -22.0, "stress_score": 62.0, "major_basin": "Krishna / Bhima Basin",
        "aliases": ["Poona"], "subdistrict_term": "Taluka"
    },
    {
        "id": "mumbai_city", "code": "IN-MH-MMC", "name": "Mumbai City", "state_code": "IN-MH", "state_name": "Maharashtra",
        "division": "Konkan", "lat": 18.96, "lon": 72.82, "area_km2": 157, "population": 3085411,
        "soil_type": "Coastal Alluvial & Reclaimed", "slope_pct": 1.0, "aquifer_type": "Coastal Basalt & Colluvium",
        "avg_rainfall_mm": 2100.0, "stage_extraction_pct": 48.0, "cgwb_category": "Safe",
        "depth_m": 5.2, "trend_cm_yr": -6.0, "stress_score": 38.0, "major_basin": "West Flowing Coastal",
        "aliases": ["Bombay"], "subdistrict_term": "Taluka"
    },
    {
        "id": "nagpur", "code": "IN-MH-NGP", "name": "Nagpur", "state_code": "IN-MH", "state_name": "Maharashtra",
        "division": "Nagpur", "lat": 21.15, "lon": 79.08, "area_km2": 9892, "population": 4653570,
        "soil_type": "Deep Black Regur Soil", "slope_pct": 2.2, "aquifer_type": "Deccan Trap Basalt & Gondwana Sandstone",
        "avg_rainfall_mm": 1120.0, "stage_extraction_pct": 69.4, "cgwb_category": "Semi-Critical",
        "depth_m": 11.8, "trend_cm_yr": -16.0, "stress_score": 52.0, "major_basin": "Godavari (Wainganga) Basin",
        "aliases": [], "subdistrict_term": "Taluka"
    },
    {
        "id": "aurangabad_mh", "code": "IN-MH-AUR", "name": "Chhatrapati Sambhajinagar", "state_code": "IN-MH", "state_name": "Maharashtra",
        "division": "Marathwada", "lat": 19.88, "lon": 75.34, "area_km2": 10107, "population": 3701282,
        "soil_type": "Shallow to Medium Black Basalt", "slope_pct": 3.4, "aquifer_type": "Hard Rock Basalt (Drought Prone)",
        "avg_rainfall_mm": 680.0, "stage_extraction_pct": 104.8, "cgwb_category": "Over-Exploited",
        "depth_m": 19.2, "trend_cm_yr": -38.0, "stress_score": 83.0, "major_basin": "Godavari Basin",
        "aliases": ["Aurangabad", "Sambhajinagar"], "subdistrict_term": "Taluka"
    },

    # --- RAJASTHAN (IN-RJ) ---
    {
        "id": "jaipur", "code": "IN-RJ-JAI", "name": "Jaipur", "state_code": "IN-RJ", "state_name": "Rajasthan",
        "division": "Jaipur", "lat": 26.91, "lon": 75.79, "area_km2": 11143, "population": 6626178,
        "soil_type": "Arid Sandy Loam", "slope_pct": 1.6, "aquifer_type": "Quaternary Alluvium & Weathered Quartzite",
        "avg_rainfall_mm": 540.0, "stage_extraction_pct": 168.0, "cgwb_category": "Over-Exploited",
        "depth_m": 38.5, "trend_cm_yr": -68.0, "stress_score": 96.0, "major_basin": "Banas / Banganga",
        "aliases": [], "subdistrict_term": "Tehsil"
    },
    {
        "id": "jodhpur", "code": "IN-RJ-JOD", "name": "Jodhpur", "state_code": "IN-RJ", "state_name": "Rajasthan",
        "division": "Jodhpur", "lat": 26.24, "lon": 73.02, "area_km2": 22850, "population": 3687002,
        "soil_type": "Desert Sand & Calcareous", "slope_pct": 1.1, "aquifer_type": "Marwar Sandstone & Malani Rhyolite",
        "avg_rainfall_mm": 360.0, "stage_extraction_pct": 154.2, "cgwb_category": "Over-Exploited",
        "depth_m": 46.2, "trend_cm_yr": -58.0, "stress_score": 93.0, "major_basin": "Luni Basin",
        "aliases": ["Sun City"], "subdistrict_term": "Tehsil"
    },
    {
        "id": "udaipur", "code": "IN-RJ-UDA", "name": "Udaipur", "state_code": "IN-RJ", "state_name": "Rajasthan",
        "division": "Udaipur", "lat": 24.58, "lon": 73.68, "area_km2": 11727, "population": 3068420,
        "soil_type": "Hilly Red & Loamy", "slope_pct": 5.2, "aquifer_type": "Aravalli Metamorphic (Phyllite & Schist)",
        "avg_rainfall_mm": 630.0, "stage_extraction_pct": 98.4, "cgwb_category": "Critical",
        "depth_m": 22.0, "trend_cm_yr": -32.0, "stress_score": 76.0, "major_basin": "Sabarmati / Banas",
        "aliases": ["City of Lakes"], "subdistrict_term": "Tehsil"
    },

    # --- GUJARAT (IN-GJ) ---
    {
        "id": "ahmedabad", "code": "IN-GJ-AHM", "name": "Ahmedabad", "state_code": "IN-GJ", "state_name": "Gujarat",
        "division": "Ahmedabad", "lat": 23.02, "lon": 72.57, "area_km2": 8087, "population": 7214225,
        "soil_type": "Sandy Loam to Clayey Goradu", "slope_pct": 0.9, "aquifer_type": "Cambay Alluvial Multi-layered Aquifer",
        "avg_rainfall_mm": 750.0, "stage_extraction_pct": 112.0, "cgwb_category": "Over-Exploited",
        "depth_m": 31.4, "trend_cm_yr": -46.0, "stress_score": 86.0, "major_basin": "Sabarmati Basin",
        "aliases": ["Amdavad"], "subdistrict_term": "Taluka"
    },
    {
        "id": "surat", "code": "IN-GJ-SUR", "name": "Surat", "state_code": "IN-GJ", "state_name": "Gujarat",
        "division": "Surat", "lat": 21.17, "lon": 72.83, "area_km2": 4418, "population": 6081322,
        "soil_type": "Deep Black & Coastal Alluvium", "slope_pct": 1.2, "aquifer_type": "Tapi Delta Alluvial Aquifer",
        "avg_rainfall_mm": 1240.0, "stage_extraction_pct": 58.0, "cgwb_category": "Safe",
        "depth_m": 9.4, "trend_cm_yr": -10.0, "stress_score": 41.0, "major_basin": "Tapi Basin",
        "aliases": [], "subdistrict_term": "Taluka"
    },

    # --- PUNJAB (IN-PB) ---
    {
        "id": "ludhiana", "code": "IN-PB-LUD", "name": "Ludhiana", "state_code": "IN-PB", "state_name": "Punjab",
        "division": "Patiala", "lat": 30.90, "lon": 75.85, "area_km2": 3767, "population": 3498739,
        "soil_type": "Alluvial Sandy Silt", "slope_pct": 0.8, "aquifer_type": "Indus Deep Multi-aquifer System",
        "avg_rainfall_mm": 680.0, "stage_extraction_pct": 182.4, "cgwb_category": "Over-Exploited",
        "depth_m": 42.0, "trend_cm_yr": -74.0, "stress_score": 98.0, "major_basin": "Sutlej Basin",
        "aliases": [], "subdistrict_term": "Tehsil"
    },
    {
        "id": "amritsar", "code": "IN-PB-AMR", "name": "Amritsar", "state_code": "IN-PB", "state_name": "Punjab",
        "division": "Jalandhar", "lat": 31.63, "lon": 74.87, "area_km2": 2683, "population": 2490656,
        "soil_type": "Fertile Loamy Alluvium", "slope_pct": 0.7, "aquifer_type": "Indus Alluvium",
        "avg_rainfall_mm": 660.0, "stage_extraction_pct": 174.0, "cgwb_category": "Over-Exploited",
        "depth_m": 39.8, "trend_cm_yr": -66.0, "stress_score": 97.0, "major_basin": "Ravi-Beas Doab",
        "aliases": [], "subdistrict_term": "Tehsil"
    },

    # --- HARYANA (IN-HR) ---
    {
        "id": "gurugram", "code": "IN-HR-GUR", "name": "Gurugram", "state_code": "IN-HR", "state_name": "Haryana",
        "division": "Gurugram", "lat": 28.46, "lon": 77.03, "area_km2": 1258, "population": 1514432,
        "soil_type": "Sandy Loam & Quartzite Ridge", "slope_pct": 1.4, "aquifer_type": "Older Alluvium & Weathered Quartzite",
        "avg_rainfall_mm": 590.0, "stage_extraction_pct": 194.0, "cgwb_category": "Over-Exploited",
        "depth_m": 44.5, "trend_cm_yr": -82.0, "stress_score": 99.0, "major_basin": "Yamuna Basin / Sahibi",
        "aliases": ["Gurgaon"], "subdistrict_term": "Tehsil"
    },
    {
        "id": "karnal", "code": "IN-HR-KAR", "name": "Karnal", "state_code": "IN-HR", "state_name": "Haryana",
        "division": "Rohtak", "lat": 29.68, "lon": 76.99, "area_km2": 2520, "population": 1505324,
        "soil_type": "Deep Indo-Gangetic Alluvium", "slope_pct": 0.9, "aquifer_type": "Deep Alluvial Aquifer",
        "avg_rainfall_mm": 710.0, "stage_extraction_pct": 152.0, "cgwb_category": "Over-Exploited",
        "depth_m": 34.2, "trend_cm_yr": -54.0, "stress_score": 92.0, "major_basin": "Yamuna Basin",
        "aliases": [], "subdistrict_term": "Tehsil"
    },

    # --- KARNATAKA (IN-KA) ---
    {
        "id": "bengaluru_urban", "code": "IN-KA-BLR", "name": "Bengaluru Urban", "state_code": "IN-KA", "state_name": "Karnataka",
        "division": "Bangalore", "lat": 12.97, "lon": 77.59, "area_km2": 2196, "population": 9621551,
        "soil_type": "Red Sandy Loam & Lateritic", "slope_pct": 2.4, "aquifer_type": "Archaean Peninsular Gneiss & Granites",
        "avg_rainfall_mm": 920.0, "stage_extraction_pct": 141.0, "cgwb_category": "Over-Exploited",
        "depth_m": 41.5, "trend_cm_yr": -62.0, "stress_score": 95.0, "major_basin": "Ponnaiyar / Arkavathi (Cauvery)",
        "aliases": ["Bangalore Urban", "Bangalore", "Bengaluru"], "subdistrict_term": "Taluk"
    },
    {
        "id": "mysuru", "code": "IN-KA-MYS", "name": "Mysuru", "state_code": "IN-KA", "state_name": "Karnataka",
        "division": "Mysore", "lat": 12.30, "lon": 76.65, "area_km2": 6854, "population": 3001127,
        "soil_type": "Red Sandy & Loamy", "slope_pct": 2.8, "aquifer_type": "Crystalline Gneiss",
        "avg_rainfall_mm": 800.0, "stage_extraction_pct": 74.0, "cgwb_category": "Semi-Critical",
        "depth_m": 16.2, "trend_cm_yr": -18.0, "stress_score": 58.0, "major_basin": "Cauvery Basin",
        "aliases": ["Mysore"], "subdistrict_term": "Taluk"
    },

    # --- TAMIL NADU (IN-TN) ---
    {
        "id": "chennai", "code": "IN-TN-CHE", "name": "Chennai", "state_code": "IN-TN", "state_name": "Tamil Nadu",
        "division": "Chennai", "lat": 13.08, "lon": 80.27, "area_km2": 426, "population": 7088000,
        "soil_type": "Coastal Sand, Clay & Alluvium", "slope_pct": 0.8, "aquifer_type": "Coastal Multi-layered Sedimentary",
        "avg_rainfall_mm": 1400.0, "stage_extraction_pct": 128.0, "cgwb_category": "Over-Exploited",
        "depth_m": 12.8, "trend_cm_yr": -35.0, "stress_score": 87.0, "major_basin": "Cooum / Adyar / Palar",
        "aliases": ["Madras"], "subdistrict_term": "Taluk"
    },
    {
        "id": "coimbatore", "code": "IN-TN-COI", "name": "Coimbatore", "state_code": "IN-TN", "state_name": "Tamil Nadu",
        "division": "Coimbatore", "lat": 11.01, "lon": 76.96, "area_km2": 4723, "population": 3458045,
        "soil_type": "Red Calcareous & Black Cotton", "slope_pct": 3.6, "aquifer_type": "Charnockite & Hornblende Gneiss (Hard Rock)",
        "avg_rainfall_mm": 690.0, "stage_extraction_pct": 138.0, "cgwb_category": "Over-Exploited",
        "depth_m": 36.4, "trend_cm_yr": -55.0, "stress_score": 93.0, "major_basin": "Noyyal / Cauvery Basin",
        "aliases": ["Kovai"], "subdistrict_term": "Taluk"
    },

    # --- TELANGANA (IN-TG) ---
    {
        "id": "hyderabad", "code": "IN-TG-HYD", "name": "Hyderabad", "state_code": "IN-TG", "state_name": "Telangana",
        "division": "Hyderabad", "lat": 17.38, "lon": 78.48, "area_km2": 217, "population": 3943323,
        "soil_type": "Red Loamy (Dubba) & Mixed Gravel", "slope_pct": 2.1, "aquifer_type": "Archaean Pink & Grey Granite Gneiss",
        "avg_rainfall_mm": 820.0, "stage_extraction_pct": 124.0, "cgwb_category": "Over-Exploited",
        "depth_m": 24.5, "trend_cm_yr": -42.0, "stress_score": 88.0, "major_basin": "Musi / Krishna Basin",
        "aliases": ["Bhagyanagar"], "subdistrict_term": "Mandal"
    },

    # --- ANDHRA PRADESH (IN-AP) ---
    {
        "id": "visakhapatnam", "code": "IN-AP-VIS", "name": "Visakhapatnam", "state_code": "IN-AP", "state_name": "Andhra Pradesh",
        "division": "Visakhapatnam", "lat": 17.68, "lon": 83.21, "area_km2": 1048, "population": 2175000,
        "soil_type": "Red Sandy Loam & Coastal Saline", "slope_pct": 4.1, "aquifer_type": "Eastern Ghats Granulites (Khondalite)",
        "avg_rainfall_mm": 1090.0, "stage_extraction_pct": 62.0, "cgwb_category": "Safe",
        "depth_m": 8.4, "trend_cm_yr": -11.0, "stress_score": 45.0, "major_basin": "East Flowing Coastal Rivers",
        "aliases": ["Vizag", "Waltair"], "subdistrict_term": "Mandal"
    },
    {
        "id": "anantapur", "code": "IN-AP-ANA", "name": "Ananthapuramu", "state_code": "IN-AP", "state_name": "Andhra Pradesh",
        "division": "Rayalaseema", "lat": 14.68, "lon": 77.60, "area_km2": 10205, "population": 2241105,
        "soil_type": "Red Gravelly Sandy Soil (Drought Prone)", "slope_pct": 2.5, "aquifer_type": "Peninsular Crystalline Complex",
        "avg_rainfall_mm": 520.0, "stage_extraction_pct": 114.0, "cgwb_category": "Over-Exploited",
        "depth_m": 28.5, "trend_cm_yr": -46.0, "stress_score": 89.0, "major_basin": "Pennar Basin",
        "aliases": ["Anantapur"], "subdistrict_term": "Mandal"
    },

    # --- BIHAR (IN-BR) ---
    {
        "id": "patna", "code": "IN-BR-PAT", "name": "Patna", "state_code": "IN-BR", "state_name": "Bihar",
        "division": "Patna", "lat": 25.59, "lon": 85.13, "area_km2": 3202, "population": 5838465,
        "soil_type": "Gangetic Silty Clay Alluvium", "slope_pct": 0.6, "aquifer_type": "Deep Prolific Alluvial Aquifer",
        "avg_rainfall_mm": 1150.0, "stage_extraction_pct": 64.5, "cgwb_category": "Safe",
        "depth_m": 8.5, "trend_cm_yr": -12.0, "stress_score": 42.0, "major_basin": "Ganga Basin",
        "aliases": ["Pataliputra"], "subdistrict_term": "CD Block"
    },
    {
        "id": "gaya", "code": "IN-BR-GAY", "name": "Gaya", "state_code": "IN-BR", "state_name": "Bihar",
        "division": "Magadh", "lat": 24.79, "lon": 85.00, "area_km2": 4976, "population": 4391418,
        "soil_type": "Older Alluvium & Granitic Residual", "slope_pct": 2.2, "aquifer_type": "Alluvium over Archaean Floor",
        "avg_rainfall_mm": 980.0, "stage_extraction_pct": 84.0, "cgwb_category": "Semi-Critical",
        "depth_m": 16.8, "trend_cm_yr": -26.0, "stress_score": 67.0, "major_basin": "Falgu / Punpun Basin",
        "aliases": [], "subdistrict_term": "CD Block"
    },

    # --- WEST BENGAL (IN-WB) ---
    {
        "id": "kolkata", "code": "IN-WB-KOL", "name": "Kolkata", "state_code": "IN-WB", "state_name": "West Bengal",
        "division": "Presidency", "lat": 22.57, "lon": 88.36, "area_km2": 205, "population": 4496694,
        "soil_type": "Ganga Delta Deep Clayey Silt", "slope_pct": 0.5, "aquifer_type": "Bengal Basin Multi-aquifer System",
        "avg_rainfall_mm": 1680.0, "stage_extraction_pct": 88.0, "cgwb_category": "Critical",
        "depth_m": 15.2, "trend_cm_yr": -30.0, "stress_score": 68.0, "major_basin": "Hooghly / Ganga Delta",
        "aliases": ["Calcutta"], "subdistrict_term": "CD Block"
    },

    # --- MADHYA PRADESH (IN-MP) ---
    {
        "id": "bhopal", "code": "IN-MP-BHO", "name": "Bhopal", "state_code": "IN-MP", "state_name": "Madhya Pradesh",
        "division": "Bhopal", "lat": 23.25, "lon": 77.41, "area_km2": 2772, "population": 2371061,
        "soil_type": "Deep Black Basaltic Soil", "slope_pct": 2.8, "aquifer_type": "Vindhyan Sandstone & Deccan Basalt",
        "avg_rainfall_mm": 1050.0, "stage_extraction_pct": 89.0, "cgwb_category": "Critical",
        "depth_m": 18.2, "trend_cm_yr": -28.0, "stress_score": 69.0, "major_basin": "Betwa / Chambal Basin",
        "aliases": [], "subdistrict_term": "Tehsil"
    },
    {
        "id": "indore", "code": "IN-MP-IND", "name": "Indore", "state_code": "IN-MP", "state_name": "Madhya Pradesh",
        "division": "Indore", "lat": 22.71, "lon": 75.85, "area_km2": 3898, "population": 3276697,
        "soil_type": "Medium to Deep Black Clayey", "slope_pct": 2.1, "aquifer_type": "Malwa Plateau Deccan Basalt",
        "avg_rainfall_mm": 960.0, "stage_extraction_pct": 115.0, "cgwb_category": "Over-Exploited",
        "depth_m": 26.5, "trend_cm_yr": -42.0, "stress_score": 85.0, "major_basin": "Chambal (Khan) Basin",
        "aliases": [], "subdistrict_term": "Tehsil"
    },

    # --- KERALA (IN-KL) ---
    {
        "id": "thiruvananthapuram", "code": "IN-KL-TVM", "name": "Thiruvananthapuram", "state_code": "IN-KL", "state_name": "Kerala",
        "division": "South Kerala", "lat": 8.52, "lon": 76.93, "area_km2": 2189, "population": 3301427,
        "soil_type": "Laterite & Coastal Sandy Alluvium", "slope_pct": 4.5, "aquifer_type": "Western Ghats Weathered Crystalline Gneiss",
        "avg_rainfall_mm": 1820.0, "stage_extraction_pct": 52.0, "cgwb_category": "Safe",
        "depth_m": 6.8, "trend_cm_yr": -8.0, "stress_score": 35.0, "major_basin": "Karamana / Neyyar",
        "aliases": ["Trivandrum"], "subdistrict_term": "Taluk"
    },

    # --- ODISHA (IN-OR) ---
    {
        "id": "khordha", "code": "IN-OR-KHO", "name": "Khordha", "state_code": "IN-OR", "state_name": "Odisha",
        "division": "Central", "lat": 20.18, "lon": 85.62, "area_km2": 2813, "population": 1874693,
        "soil_type": "Lateritic & Deltaic Alluvium", "slope_pct": 1.9, "aquifer_type": "Archaean Charnockite & Mahanadi Delta",
        "avg_rainfall_mm": 1450.0, "stage_extraction_pct": 48.0, "cgwb_category": "Safe",
        "depth_m": 7.4, "trend_cm_yr": -9.0, "stress_score": 36.0, "major_basin": "Mahanadi / Daya Basin",
        "aliases": ["Khurda", "Bhubaneswar District"], "subdistrict_term": "Tahasil"
    },

    # --- ASSAM (IN-AS) ---
    {
        "id": "kamrup_metropolitan", "code": "IN-AS-KAM", "name": "Kamrup Metropolitan", "state_code": "IN-AS", "state_name": "Assam",
        "division": "Lower Assam", "lat": 26.14, "lon": 91.73, "area_km2": 1527, "population": 1253938,
        "soil_type": "Brahmaputra Alluvial Silt", "slope_pct": 1.8, "aquifer_type": "Prolific Valley Fill Alluvium",
        "avg_rainfall_mm": 1720.0, "stage_extraction_pct": 28.0, "cgwb_category": "Safe",
        "depth_m": 4.5, "trend_cm_yr": -3.0, "stress_score": 18.0, "major_basin": "Brahmaputra Basin",
        "aliases": ["Guwahati District", "Kamrup Metro"], "subdistrict_term": "Revenue Circle"
    },

    # --- DELHI UT (IN-DL) ---
    {
        "id": "new_delhi", "code": "IN-DL-NDL", "name": "New Delhi", "state_code": "IN-DL", "state_name": "Delhi",
        "division": "Delhi", "lat": 28.61, "lon": 77.20, "area_km2": 35, "population": 142004,
        "soil_type": "Yamuna Older Alluvium & Quartzite", "slope_pct": 1.1, "aquifer_type": "Alluvial Sand with Interbedded Clay",
        "avg_rainfall_mm": 714.0, "stage_extraction_pct": 134.0, "cgwb_category": "Over-Exploited",
        "depth_m": 29.8, "trend_cm_yr": -48.0, "stress_score": 90.0, "major_basin": "Yamuna Basin",
        "aliases": ["Delhi Central"], "subdistrict_term": "Tehsil"
    },
    {
        "id": "south_delhi", "code": "IN-DL-SDL", "name": "South Delhi", "state_code": "IN-DL", "state_name": "Delhi",
        "division": "Delhi", "lat": 28.53, "lon": 77.19, "area_km2": 247, "population": 2731929,
        "soil_type": "Sandy Silt over Quartzite Ridge", "slope_pct": 2.2, "aquifer_type": "Alluvial & Weathered Quartzite Hard Rock",
        "avg_rainfall_mm": 690.0, "stage_extraction_pct": 164.0, "cgwb_category": "Over-Exploited",
        "depth_m": 38.6, "trend_cm_yr": -72.0, "stress_score": 97.0, "major_basin": "Yamuna Basin",
        "aliases": [], "subdistrict_term": "Tehsil"
    },

    # --- JAMMU & KASHMIR (IN-JK) ---
    {
        "id": "srinagar", "code": "IN-JK-SRI", "name": "Srinagar", "state_code": "IN-JK", "state_name": "Jammu and Kashmir",
        "division": "Kashmir", "lat": 34.08, "lon": 74.79, "area_km2": 1979, "population": 1236829,
        "soil_type": "Karewa Lacustrine Clay & Valley Alluvium", "slope_pct": 2.0, "aquifer_type": "Karewa Silt & Jhelum Alluvium",
        "avg_rainfall_mm": 710.0, "stage_extraction_pct": 34.0, "cgwb_category": "Safe",
        "depth_m": 4.8, "trend_cm_yr": -4.0, "stress_score": 22.0, "major_basin": "Jhelum Basin",
        "aliases": [], "subdistrict_term": "Tehsil"
    },

    # --- LADAKH UT (IN-LA) ---
    {
        "id": "leh", "code": "IN-LA-LEH", "name": "Leh", "state_code": "IN-LA", "state_name": "Ladakh",
        "division": "Ladakh", "lat": 34.15, "lon": 77.57, "area_km2": 45110, "population": 133487,
        "soil_type": "High Altitude Mountain Glacial Scree", "slope_pct": 6.8, "aquifer_type": "Indus Valley Glacio-Fluvial Moraine",
        "avg_rainfall_mm": 115.0, "stage_extraction_pct": 24.0, "cgwb_category": "Safe",
        "depth_m": 6.2, "trend_cm_yr": -3.0, "stress_score": 30.0, "major_basin": "Indus River Basin",
        "aliases": ["Ladakh District"], "subdistrict_term": "Tehsil"
    },

    # --- CHANDIGARH UT (IN-CH) ---
    {
        "id": "chandigarh_ut", "code": "IN-CH-CHD", "name": "Chandigarh", "state_code": "IN-CH", "state_name": "Chandigarh",
        "division": "Chandigarh", "lat": 30.73, "lon": 76.77, "area_km2": 114, "population": 1055450,
        "soil_type": "Shiwalik Piedmont Alluvium", "slope_pct": 1.2, "aquifer_type": "Indo-Gangetic Deep Alluvium",
        "avg_rainfall_mm": 1070.0, "stage_extraction_pct": 82.0, "cgwb_category": "Semi-Critical",
        "depth_m": 18.5, "trend_cm_yr": -24.0, "stress_score": 62.0, "major_basin": "Ghaggar Basin",
        "aliases": ["City Beautiful"], "subdistrict_term": "Sub-Division"
    }
]


def clean_text(text: str) -> str:
    """Normalize text: strip accents, remove non-alphanumeric, lowercase."""
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("utf-8")
    return re.sub(r"[^a-zA-Z0-9]", "", text).lower()


HISTORICAL_ALIASES: Dict[str, str] = {
    "allahabad": "Prayagraj",
    "faizabad": "Ayodhya",
    "aurangabad": "Chhatrapati Sambhajinagar",
    "osmanabad": "Dharashiv",
    "bangalore": "Bengaluru Urban",
    "bengaluru": "Bengaluru Urban",
    "benares": "Varanasi",
    "banaras": "Varanasi",
    "kashi": "Varanasi",
    "calcutta": "Kolkata",
    "bombay": "Mumbai",
    "madras": "Chennai",
    "baroda": "Vadodara",
    "trivandrum": "Thiruvananthapuram",
    "cochin": "Ernakulam",
    "mysore": "Mysuru",
    "belgaum": "Belagavi",
    "gurgaon": "Gurugram",
    "mewat": "Nuh",
}


class AdministrativeGeographyRegistry:
    """Registry maintaining authoritative administrative divisions and fuzzy matching."""

    _states_by_code: Dict[str, Dict[str, Any]] = {s["code"]: s for s in INDIAN_STATES_AND_UTS}
    _states_by_name: Dict[str, Dict[str, Any]] = {clean_text(s["name"]): s for s in INDIAN_STATES_AND_UTS}
    _districts_by_id: Dict[str, Dict[str, Any]] = {d["id"]: d for d in PAN_INDIA_DISTRICTS}
    _districts_by_code: Dict[str, Dict[str, Any]] = {d["code"]: d for d in PAN_INDIA_DISTRICTS}

    @classmethod
    def list_states(cls) -> List[Dict[str, Any]]:
        return sorted(INDIAN_STATES_AND_UTS, key=lambda s: s["name"])

    @classmethod
    def get_state(cls, identifier: str) -> Optional[Dict[str, Any]]:
        """Get state by code ('IN-UP') or name ('Uttar Pradesh')."""
        upper = identifier.upper().strip()
        if upper in cls._states_by_code:
            return cls._states_by_code[upper]
        if not upper.startswith("IN-") and len(upper) == 2:
            in_code = f"IN-{upper}"
            if in_code in cls._states_by_code:
                return cls._states_by_code[in_code]
        cleaned = clean_text(identifier)
        return cls._states_by_name.get(cleaned)

    @classmethod
    def list_districts(cls, state_code: Optional[str] = None) -> List[Dict[str, Any]]:
        if not state_code:
            return sorted(PAN_INDIA_DISTRICTS, key=lambda d: (d["state_name"], d["name"]))
        state_code_upper = state_code.upper().strip()
        if not state_code_upper.startswith("IN-") and len(state_code_upper) == 2:
            state_code_upper = f"IN-{state_code_upper}"
        return [d for d in PAN_INDIA_DISTRICTS if d["state_code"] == state_code_upper]

    @classmethod
    def get_district(cls, identifier: str) -> Optional[Dict[str, Any]]:
        """Get district by id ('agra', 'pune'), code ('IN-UP-AGR'), or normalized name."""
        lowered = identifier.lower().strip()
        if lowered in cls._districts_by_id:
            return cls._districts_by_id[lowered]
        upper = identifier.upper().strip()
        if upper in cls._districts_by_code:
            return cls._districts_by_code[upper]
        
        # Match by name or historical alias
        cleaned_query = clean_text(identifier)
        if cleaned_query in HISTORICAL_ALIASES:
            canonical = HISTORICAL_ALIASES[cleaned_query]
            return cls.get_district(canonical)

        for dist in PAN_INDIA_DISTRICTS:
            if clean_text(dist["name"]) == cleaned_query:
                return dist
            for alias in dist.get("aliases", []):
                if clean_text(alias) == cleaned_query:
                    return dist
        return None

    @classmethod
    def search(cls, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Search across States and Districts supporting partial matches and aliases."""
        cleaned = clean_text(query)
        if not cleaned:
            return []

        results = []
        # Check states first
        for s in INDIAN_STATES_AND_UTS:
            if cleaned in clean_text(s["name"]) or cleaned == clean_text(s["code"]):
                results.append({
                    "type": "State" if s["type"] == "State" else "Union Territory",
                    "id": s["code"],
                    "name": s["name"],
                    "state_code": s["code"],
                    "state_name": s["name"],
                    "match_score": 100 if clean_text(s["name"]) == cleaned else 80
                })

        # Check districts and aliases
        for d in PAN_INDIA_DISTRICTS:
            score = 0
            d_name_clean = clean_text(d["name"])
            if d_name_clean == cleaned:
                score = 100
            elif d_name_clean.startswith(cleaned):
                score = 85
            elif cleaned in d_name_clean:
                score = 70
            else:
                for alias in d.get("aliases", []):
                    a_clean = clean_text(alias)
                    if a_clean == cleaned:
                        score = max(score, 95)
                    elif cleaned in a_clean:
                        score = max(score, 65)

            if score > 0:
                results.append({
                    "type": "District",
                    "id": d["id"],
                    "code": d["code"],
                    "name": d["name"],
                    "state_code": d["state_code"],
                    "state_name": d["state_name"],
                    "cgwb_category": d["cgwb_category"],
                    "match_score": score
                })

        results.sort(key=lambda x: x["match_score"], reverse=True)
        return results[:limit]

    @classmethod
    def normalize_name(cls, name: str) -> str:
        """Resolve historical aliases or alternate spellings to canonical official name."""
        dist = cls.get_district(name)
        if dist:
            return dist["name"]
        state = cls.get_state(name)
        if state:
            return state["name"]
        return name

    @classmethod
    def get_hierarchy(cls, district_id: str) -> Dict[str, Any]:
        """Return the official hierarchy: India -> State/UT -> District -> Subdistrict -> Block."""
        dist = cls.get_district(district_id)
        if not dist:
            return {
                "country": "India",
                "state": "Unknown",
                "district": district_id,
                "subdistrict_term": "Tehsil",
                "block_term": "Block"
            }
        state = cls.get_state(dist["state_code"]) or {}
        return {
            "country": "India",
            "country_code": "IN",
            "state_code": dist["state_code"],
            "state_name": dist["state_name"],
            "state_type": state.get("type", "State"),
            "district_id": dist["id"],
            "district_code": dist["code"],
            "district_name": dist["name"],
            "subdistrict_term": dist.get("subdistrict_term", state.get("subdistrict_term", "Tehsil")),
            "block_term": state.get("block_term", "Block"),
            "primary_terrain": state.get("primary_terrain", "Alluvial"),
            "major_basin": dist.get("major_basin", "Unknown")
        }
