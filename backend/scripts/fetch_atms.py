import requests
import json
import os

# Ensure data directory exists
os.makedirs('../../data', exist_ok=True)

# Overpass API endpoint
OVERPASS_URL = "http://overpass-api.de/api/interpreter"

# Bounding box for Delhi (South, West, North, East)
# Approx: 28.4, 76.8, 28.9, 77.3
OVERPASS_QUERY = """
[out:json];
(
  node["amenity"="atm"](28.4, 76.8, 28.9, 77.3);
  node["amenity"="bank"](28.4, 76.8, 28.9, 77.3);
);
out body;
"""

def fetch_atms():
    print("Fetching ATM and Bank locations for Delhi via Overpass API...")
    response = requests.post(
        OVERPASS_URL, 
        data={'data': OVERPASS_QUERY},
        headers={'Accept': 'application/json', 'User-Agent': 'SIH-App-Bot/1.0'}
    )
    
    if response.status_code == 200:
        data = response.json()
        
        # Convert to GeoJSON
        features = []
        for element in data.get('elements', []):
            if element['type'] == 'node':
                tags = element.get('tags', {})
                name = tags.get('name', 'Unknown')
                operator = tags.get('operator', tags.get('network', 'Unknown Bank'))
                amenity = tags.get('amenity', 'atm')
                
                features.append({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [element['lon'], element['lat']]
                    },
                    "properties": {
                        "id": element['id'],
                        "name": name,
                        "operator": operator,
                        "amenity": amenity
                    }
                })
                
        geojson = {
            "type": "FeatureCollection",
            "features": features
        }
        
        output_path = '../../data/atm_locations.geojson'
        with open(output_path, 'w') as f:
            json.dump(geojson, f, indent=2)
            
        print(f"Successfully saved {len(features)} locations to {output_path}")
    else:
        print(f"Failed to fetch data: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    fetch_atms()
