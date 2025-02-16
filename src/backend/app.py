from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import base64
from database import get_filtered_data, get_available_dates, generate_arc_layer, get_zones

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

@app.route("/heatmap", methods=["GET"])
def get_heatmap():
    """Fetch heatmap data filtered by date and hour."""
    date = request.args.get("date")
    start_hour = request.args.get("startHour", default=0, type=int)
    end_hour = request.args.get("endHour", default=23, type=int)

    if not date:
        return jsonify({"error": "Missing date parameter"}), 400

    return jsonify(get_filtered_data(date, start_hour, end_hour))

@app.route("/available-dates", methods=["GET"])
def get_available_dates_route():
    """Return available dates with data."""
    return jsonify({"available_dates": get_available_dates()})

@app.route("/arc-data", methods=["GET"])
def get_arc_data():
    """Fetch ArcLayer data."""
    arc_data = generate_arc_layer()
    
    if "error" in arc_data:
        print(f"❌ ERROR in /arc-data: {arc_data['error']}")  # ✅ Debugging
        return jsonify({"error": arc_data["error"]}), 500
    
    print("✅ ArcLayer Data Fetched Successfully")  # ✅ Debugging
    return jsonify(arc_data)


@app.route("/bitmap", methods=["GET"])
def get_bitmap():
    """Serve the image as a Base64 string."""
    try:
        with open("parque_image_borders.png", "rb") as img_file:
            img_base64 = base64.b64encode(img_file.read()).decode("utf-8")
        return jsonify({"image": f"data:image/png;base64,{img_base64}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/zones", methods=["GET"])
def get_zones_route():
    """Fetch zone polygons."""
    zones_data = get_zones()
    if "error" in zones_data:
        return jsonify({"error": zones_data["error"]}), 500
    return jsonify({"zones": zones_data.to_json()})  # ✅ Returns GeoJSON


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
