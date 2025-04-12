import pandas as pd
import geopandas as gpd
import psycopg2
import altair as alt
import json

# ✅ Database Connection Using psycopg2
POSTGIS_CONN = {
    "dbname": "crowdcounting",
    "user": "admin",
    "password": "admin",
    "host": "40.84.231.179",
    "port": "5434",
}

def get_filtered_detections():
    """
    Recupera todas las detecciones de la base de datos y realiza el filtrado espacial
    en función del FOV 
    """
    # Conectar y leer detecciones
    conn = psycopg2.connect(**POSTGIS_CONN)
    SQL_QUERY = """
        SELECT id, id_person, lat, long, timestamp
        FROM person_observed
        LIMIT 100000;
    """
    df = pd.read_sql(SQL_QUERY, conn)
    conn.close()

    # Convertir a GeoDataFrame
    gdf = gpd.GeoDataFrame(
        df, geometry=gpd.points_from_xy(df.long, df.lat), crs="EPSG:4326"
    )
    # Extraer nombre de la cámara 
    gdf['cam_name'] = gdf['id'].str.split('-').str[0].str.lower()

    # Leer el archivo de FOV 
    fov_gdf = gpd.read_file('cams_fov.geojson')
    fov_gdf['name'] = fov_gdf['name'].str.lower()
    gdf = gdf.to_crs(fov_gdf.crs)
    
    # Realizar la unión espacial para quedarse solo con puntos dentro del FOV
    joined_gdf = gpd.sjoin(gdf, fov_gdf, how='inner', predicate='within')
    # Filtrar para asegurar que el nombre del FOV coincida con el cam_name
    filtered_gdf = joined_gdf[joined_gdf['name'] == joined_gdf['cam_name']]
    
    # Convertir el timestamp y ajustar zona horaria 
    filtered_gdf['timestamp'] = pd.to_datetime(filtered_gdf['timestamp']) - pd.to_timedelta(6, unit='h')
    
    # Agregar columna de día de la semana (0 = lunes, 6 = domingo)
    filtered_gdf['dayofweek'] = filtered_gdf['timestamp'].dt.dayofweek
    
    return filtered_gdf

def generate_time_heatmap():
    """
    Procesa los datos filtrados para generar un heatmap temporal con Altair y retorna el HTML resultante.
    """
    filtered_gdf = get_filtered_detections()
    
    # Extraer columnas temporales
    filtered_gdf['hour'] = filtered_gdf['timestamp'].dt.hour
    filtered_gdf['week'] = filtered_gdf['timestamp'].dt.isocalendar().week
    filtered_gdf['month'] = filtered_gdf['timestamp'].dt.month

    # Agregar agrupación por week, dayofweek, hour y month, contando id_person únicos
    agg_data = filtered_gdf.groupby(['week', 'dayofweek', 'hour', 'month']).agg(
        unique_persons=('id_person', 'nunique')
    ).reset_index()

    # Calcular la mediana por combinación de día de la semana, hora y mes
    mean_data = agg_data.groupby(['dayofweek', 'hour', 'month']).agg(
        mean_unique_persons=('unique_persons', 'median')
    ).reset_index()

    # Mapear número de día a nombre
    day_names = {0: 'Monday', 1: 'Tuesday', 2: 'Wednesday',
                 3: 'Thursday', 4: 'Friday', 5: 'Saturday', 6: 'Sunday'}
    mean_data['day_name'] = mean_data['dayofweek'].map(day_names)

    # Mapear número de mes a nombre
    month_names = {1: 'January', 2: 'February', 3: 'March', 4: 'April',
                   5: 'May', 6: 'June', 7: 'July', 8: 'August',
                   9: 'September', 10: 'October', 11: 'November', 12: 'December'}
    mean_data['month_name'] = mean_data['month'].map(month_names)

    # Crear el heatmap con Altair
    heatmap = alt.Chart(mean_data).mark_rect().encode(
        x=alt.X('hour:O', title='Hour of the Day'),
        y=alt.Y('day_name:N', title='Day of the Week'),
        color=alt.Color('mean_unique_persons:Q', scale=alt.Scale(scheme='redyellowblue'),
                        title='Mean Unique Persons'),
        tooltip=['day_name', 'hour', 'mean_unique_persons', 'month_name']
    ).facet(
        column=alt.Column('month_name:N', title=None,
                          header=alt.Header(labelAngle=-45, labelAlign='right'))
    ).properties(
        title='Heatmap of Mean Unique Persons Count by Hour, Day of the Week, and Month',
        bounds='flush'
    ).configure_facet(
        spacing=0
    ).configure_view(
        stroke=None
    ).configure_title(
        anchor='start'
    )

    # Retornar el HTML completo con la visualización
    return heatmap.to_html()