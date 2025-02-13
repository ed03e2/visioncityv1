import psycopg2
import json

POSTGIS_CONN = {
    "dbname": "crowdcounting",
    "user": "admin",
    "password": "admin",
    "host": "40.84.231.179",
    "port": 5434,
}

def get_filtered_data(date_filter, start_hour, end_hour):
    """Fetch heatmap data filtered by date and hour from PostGIS."""
    try:
        conn = psycopg2.connect(**POSTGIS_CONN)
        cur = conn.cursor()

        SQL_QUERY = """
            SELECT id, id_person, lat, long, timestamp
            FROM person_observed
            WHERE DATE(timestamp) = %s
            AND EXTRACT(HOUR FROM timestamp) BETWEEN %s AND %s;
        """
        
        cur.execute(SQL_QUERY, (date_filter, start_hour, end_hour))
        rows = cur.fetchall()
        cur.close()
        conn.close()

        features = []
        for row in rows:
            features.append({
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [row[3], row[2]]},
                "properties": {
                    "id": row[0],
                    "id_person": row[1],
                    "timestamp": row[4].isoformat(),
                }
            })

        return json.dumps({"type": "FeatureCollection", "features": features})
    except Exception as e:
        return json.dumps({"error": str(e)})

def get_available_dates():
    """Fetch distinct dates where data exists."""
    try:
        conn = psycopg2.connect(**POSTGIS_CONN)
        cur = conn.cursor()

        SQL_QUERY = "SELECT DISTINCT DATE(timestamp) FROM person_observed ORDER BY DATE(timestamp);"
        cur.execute(SQL_QUERY)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        # Convert to string format "YYYY-MM-DD"
        return [row[0].strftime("%Y-%m-%d") for row in rows]
    except Exception as e:
        return []
