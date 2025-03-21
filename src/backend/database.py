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

# ✅ Generate OD Matrix for ArcLayer


def generate_arc_layer(date_filter, start_hour, end_hour):
    """Generate an Origin-Destination matrix based on first and last transitions per person."""
    try:
        zones_gdf = get_zones()

        if isinstance(zones_gdf, dict) and "error" in zones_gdf:
            return {"error": zones_gdf["error"]}

        conn = psycopg2.connect(**POSTGIS_CONN)

        # ✅ Get First & Last Transition per Person, Exclude 'APE_24' if necessary
        sql = """             
        WITH ranked_transitions AS (
                SELECT 
                    id_person, 
                    first_timestamp, 
                    last_timestamp, 
                    origin_zone_id, 
                    destination_zone_id, 
                    duration_seconds,
                    ROW_NUMBER() OVER (PARTITION BY id_person ORDER BY first_timestamp ASC) AS row_first,
                    ROW_NUMBER() OVER (PARTITION BY id_person ORDER BY last_timestamp DESC) AS row_last
                FROM zone_transitions
                WHERE DATE(first_timestamp) = %s 
                AND EXTRACT(HOUR FROM first_timestamp) BETWEEN %s AND %s
                AND duration_seconds BETWEEN .3 AND 4000
            )
            SELECT 
                first_t.id_person, 
                first_t.origin_zone_id AS origin_zone, 
                last_t.destination_zone_id AS destination_zone, 
                first_t.first_timestamp AS first_time, 
                last_t.last_timestamp AS last_time
            FROM ranked_transitions first_t
            JOIN ranked_transitions last_t ON first_t.id_person = last_t.id_person
            WHERE first_t.row_first = 1 AND last_t.row_last = 1
            AND first_t.origin_zone_id != 'APE_24'
            AND last_t.destination_zone_id != 'APE_24';
        """

        transitions_df = pd.read_sql(
            sql, conn, params=(date_filter, start_hour, end_hour))
        conn.close()

        if transitions_df.empty:
            return {"error": "No filtered transitions found in database"}

        # ✅ Compute OD Matrix (Counts of Origin-Destination Pairs)
        od_matrix = transitions_df.groupby(
            ["origin_zone", "destination_zone"]).size().reset_index(name="weight")

        # ✅ Ensure proper projection
        zones_gdf["centroid"] = zones_gdf["geom"].to_crs(epsg=4326).centroid

        # ✅ Map zone centroids to zones
        zone_centroids = {
            row.zone_id: {"lon": row.centroid.x, "lat": row.centroid.y}
            for _, row in zones_gdf.iterrows()
            if not row.centroid.is_empty
        }

        arc_data = []
        missing_zones = set()

        for _, row in od_matrix.iterrows():
            origin = zone_centroids.get(row.origin_zone)
            destination = zone_centroids.get(row.destination_zone)

            if not origin or not destination:
                missing_zones.add(row.origin_zone)
                missing_zones.add(row.destination_zone)
                continue

            arc_data.append({
                "origin_lat": origin["lat"],
                "origin_lon": origin["lon"],
                "destination_lat": destination["lat"],
                "destination_lon": destination["lon"],
                "weight": row.weight  # ✅ OD Matrix Weight (Counts)
            })

        if missing_zones:
            return {"error": f"Missing centroids for zones: {list(missing_zones)}"}

        return {"arc_data": arc_data}
    except Exception as e:
        return {"error": f"Error generating ArcLayer data: {str(e)}"}


# ✅ Fetch Heatmap Data
def get_filtered_data(date_filter, start_hour, end_hour):
    """Fetch person observation data with zone_id for heatmap filtering by date and time."""
    try:
        conn = psycopg2.connect(**POSTGIS_CONN)

        SQL_QUERY = """
            SELECT 
                p.id, 
                p.id_person, 
                p.lat, 
                p.long, 
                p.timestamp, 
                z.zone_id 
            FROM person_observed p
            LEFT JOIN zones z
            ON ST_Contains(z.geom, ST_SetSRID(ST_MakePoint(p.long, p.lat), 4326))
            WHERE DATE(p.timestamp) = %s 
            AND EXTRACT(HOUR FROM p.timestamp) BETWEEN %s AND %s;
        """

        df = pd.read_sql(SQL_QUERY, conn, params=(date_filter, start_hour, end_hour))

        features = [
            {
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [row.long, row.lat]},
                "properties": {
                    "id": row.id, 
                    "id_person": row.id_person, 
                    "timestamp": row.timestamp.isoformat(),
                    "zone_id": row.zone_id  # ✅ Added zone_id
                }
            }
            for _, row in df.iterrows()
        ]

        conn.close()
        return {"type": "FeatureCollection", "features": features}
    
    except Exception as e:
        return {"error": str(e)}


# ✅ Fetch Available Dates
def get_available_dates():
    """Fetch distinct dates where person observations exist."""
    try:
        conn = psycopg2.connect(**POSTGIS_CONN)
        SQL_QUERY = """
            SELECT DISTINCT date FROM (
                SELECT DATE(timestamp) as date FROM person_observed
                UNION
                SELECT DATE(first_timestamp) as date FROM zone_transitions
            ) AS combined_dates
            ORDER BY date;
        """

        df = pd.read_sql(SQL_QUERY, conn)

        return [row[0].strftime("%Y-%m-%d") for _, row in df.iterrows()]
    except Exception as e:
        return {"error": str(e)}


def get_duration_times_by_zone(date_filter, start_hour, end_hour):
    """Fetch duration times by zone."""
    try:
        conn = psycopg2.connect(**POSTGIS_CONN)
        SQL_QUERY = """
            SELECT percentile_cont(0.5) WITHIN GROUP (ORDER BY duration_seconds) as median_duration, origin_zone_id 
            FROM zone_transitions 
            WHERE DATE(first_timestamp) = %s 
            AND EXTRACT(HOUR FROM first_timestamp) BETWEEN %s AND %s 
            AND duration_seconds BETWEEN 1 AND 2000
            GROUP BY origin_zone_id 
        """
        print(SQL_QUERY)
        df = pd.read_sql(SQL_QUERY, conn, params=(
            date_filter, start_hour, end_hour))
        print(df, "df")
        res = [{"zone": row.origin_zone_id, "duration": row.median_duration}
               for _, row in df.iterrows()]

        SQL_QUERY = """
            SELECT 0 as median_duration, zone_id 
            FROM zones
            WHERE zone_id NOT IN (SELECT origin_zone_id FROM zone_transitions WHERE DATE(first_timestamp) = %s AND EXTRACT(HOUR FROM first_timestamp) BETWEEN %s AND %s)
        """

        df = pd.read_sql(SQL_QUERY, conn, params=(
            date_filter, start_hour, end_hour))

        res = [{"zone": row.zone_id, "duration": row.median_duration}
               for _, row in df.iterrows()] + res

        return res
    except Exception as e:
        return {"error": str(e)}


def get_arc_and_duration_data(date_filter, start_hour, end_hour):
    """Fetch Arc Layer (OD Matrix) and Zone Duration Data in a Single Query"""
    try:
        conn = psycopg2.connect(**POSTGIS_CONN)
        cursor = conn.cursor()

        sql = """
        WITH ranked_transitions AS (
            SELECT 
                id_person, 
                first_timestamp, 
                last_timestamp, 
                origin_zone_id, 
                destination_zone_id, 
                duration_seconds,
                ROW_NUMBER() OVER (PARTITION BY id_person ORDER BY first_timestamp ASC) AS row_first,
                ROW_NUMBER() OVER (PARTITION BY id_person ORDER BY last_timestamp DESC) AS row_last
            FROM zone_transitions
            WHERE DATE(first_timestamp) = %s 
            AND EXTRACT(HOUR FROM first_timestamp) BETWEEN %s AND %s
            AND duration_seconds BETWEEN 1 AND 4000
        ),
        od_matrix AS (
            SELECT 
                first_t.origin_zone_id AS origin_zone, 
                last_t.destination_zone_id AS destination_zone,
                COUNT(*) AS weight
            FROM ranked_transitions first_t
            JOIN ranked_transitions last_t 
                ON first_t.id_person = last_t.id_person
            WHERE first_t.row_first = 1 
            AND last_t.row_last = 1
            AND first_t.origin_zone_id != 'APE_24' 
            AND last_t.destination_zone_id != 'APE_24'
            GROUP BY first_t.origin_zone_id, last_t.destination_zone_id
        ),
        zone_durations AS (
            SELECT 
                origin_zone_id,
                percentile_cont(0.5) WITHIN GROUP (ORDER BY duration_seconds) AS median_duration
            FROM zone_transitions
            WHERE DATE(first_timestamp) = %s 
            AND EXTRACT(HOUR FROM first_timestamp) BETWEEN %s AND %s 
            AND duration_seconds BETWEEN 1 AND 2000
            GROUP BY origin_zone_id
        )
        SELECT 
            z.zone_id, 
            COALESCE(d.median_duration, 0) AS median_duration, 
            COALESCE(od.weight, 0) AS weight, 
            od.origin_zone, 
            od.destination_zone
        FROM zones z
        LEFT JOIN zone_durations d ON z.zone_id = d.origin_zone_id
        LEFT JOIN od_matrix od ON z.zone_id = od.origin_zone;
        """

        cursor.execute(sql, (date_filter, start_hour, end_hour, date_filter, start_hour, end_hour))
        results = cursor.fetchall()
        conn.close()

        # ✅ Load Zones Centroids for Mapping
        zones_gdf = get_zones()
        if isinstance(zones_gdf, dict) and "error" in zones_gdf:
            return {"error": zones_gdf["error"]}

        zones_gdf["centroid"] = zones_gdf["geom"].to_crs(epsg=4326).centroid
        zone_centroids = {
            row.zone_id: {"lon": row.centroid.x, "lat": row.centroid.y}
            for _, row in zones_gdf.iterrows() if not row.centroid.is_empty
        }

        arc_data = []
        duration_data = []
        missing_zones = set()

        for row in results:
            zone_id, median_duration, weight, origin_zone, destination_zone = row
            duration_data.append({"zone": zone_id, "duration": median_duration})

            if origin_zone and destination_zone:
                origin = zone_centroids.get(origin_zone)
                destination = zone_centroids.get(destination_zone)

                if origin and destination:
                    arc_data.append({
                        "origin_lat": origin["lat"],
                        "origin_lon": origin["lon"],
                        "destination_lat": destination["lat"],
                        "destination_lon": destination["lon"],
                        "weight": weight
                    })
                else:
                    missing_zones.add(origin_zone)
                    missing_zones.add(destination_zone)

        if missing_zones:
            return {"error": f"Missing centroids for zones: {list(missing_zones)}"}

        return {"arc_data": arc_data, "duration_data": duration_data}

    except Exception as e:
        return {"error": f"Database Error: {str(e)}"}
