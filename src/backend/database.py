import psycopg2
import json
import geopandas as gpd
import pandas as pd

# ✅ Database Connection Using psycopg2
POSTGIS_CONN = {
    "dbname": "crowdcounting",
    "user": "admin",
    "password": "admin",
    "host": "40.84.231.179",
    "port": "5434",
}

# ✅ Fetch Zones (Using psycopg2)
def get_zones():
    """Fetch zone polygons from the database."""
    try:
        conn = psycopg2.connect(**POSTGIS_CONN)
        sql = "SELECT zone_id, name, geom FROM zones;"
        zones_gdf = gpd.read_postgis(sql, conn, geom_col="geom")
        conn.close()

        if zones_gdf.empty:
            return {"error": "No zones found in database"}

        return zones_gdf
    except Exception as e:
        return {"error": f"Error fetching zones: {str(e)}"}

# ✅ Fetch Zone Transitions (Using psycopg2)
def get_zone_transitions():
    """Fetch movement transitions between zones."""
    try:
        conn = psycopg2.connect(**POSTGIS_CONN)
        sql = """
            SELECT origin_zone_id, destination_zone_id, COUNT(*) as weight
            FROM zone_transitions
            GROUP BY origin_zone_id, destination_zone_id;
        """
        transitions_df = pd.read_sql(sql, conn)
        conn.close()

        if transitions_df.empty:
            return {"error": "No transitions found in database"}

        return transitions_df
    except Exception as e:
        return {"error": f"Error fetching transitions: {str(e)}"}

# ✅ Generate ArcLayer Data (Restored psycopg2)
def generate_arc_layer():
    """Generate ArcLayer JSON for Deck.GL visualization."""
    try:
        zones_gdf = get_zones()
        transitions_df = get_zone_transitions()

        if isinstance(zones_gdf, dict) and "error" in zones_gdf:
            return {"error": zones_gdf["error"]}
        if isinstance(transitions_df, dict) and "error" in transitions_df:
            return {"error": transitions_df["error"]}

        # Ensure proper projection
        zones_gdf["centroid"] = zones_gdf["geom"].to_crs(epsg=4326).centroid

        zone_centroids = {
            row.zone_id: {"lon": row.centroid.x, "lat": row.centroid.y}
            for _, row in zones_gdf.iterrows()
            if not row.centroid.is_empty  # Ignore empty centroids
        }

        arc_data = []
        missing_zones = set()
        
        for _, row in transitions_df.iterrows():
            origin = zone_centroids.get(row.origin_zone_id)
            destination = zone_centroids.get(row.destination_zone_id)

            if not origin or not destination:
                missing_zones.add(row.origin_zone_id)
                missing_zones.add(row.destination_zone_id)
                continue

            arc_data.append({
                "origin_lat": origin["lat"],
                "origin_lon": origin["lon"],
                "destination_lat": destination["lat"],
                "destination_lon": destination["lon"],
                "weight": row.weight
            })

        if missing_zones:
            return {"error": f"Missing centroids for zones: {list(missing_zones)}"}

        return {"arc_data": arc_data}
    except Exception as e:
        return {"error": f"Error generating ArcLayer data: {str(e)}"}


# ✅ Fetch Heatmap Data
def get_filtered_data(date_filter, start_hour, end_hour):
    """Fetch person observation data for heatmap filtering by date and time."""
    try:
        engine = create_engine(POSTGIS_CONN_STRING)
        SQL_QUERY = """
            SELECT id, id_person, lat, long, timestamp
            FROM person_observed
            WHERE DATE(timestamp) = %s AND EXTRACT(HOUR FROM timestamp) BETWEEN %s AND %s;
        """
        df = pd.read_sql(SQL_QUERY, engine, params=(date_filter, start_hour, end_hour))

        features = [
            {
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [row.long, row.lat]},
                "properties": {"id": row.id, "id_person": row.id_person, "timestamp": row.timestamp.isoformat()}
            }
            for _, row in df.iterrows()
        ]

        return {"type": "FeatureCollection", "features": features}
    except Exception as e:
        return {"error": str(e)}

# ✅ Fetch Available Dates
def get_available_dates():
    """Fetch distinct dates where person observations exist."""
    try:
        engine = create_engine(POSTGIS_CONN_STRING)
        SQL_QUERY = "SELECT DISTINCT DATE(timestamp) FROM person_observed ORDER BY DATE(timestamp);"
        df = pd.read_sql(SQL_QUERY, engine)

        return [row[0].strftime("%Y-%m-%d") for _, row in df.iterrows()]
    except Exception as e:
        return {"error": str(e)}
