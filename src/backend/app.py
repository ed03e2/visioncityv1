import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from database import get_filtered_data, get_available_dates

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow frontend requests

@app.route("/heatmap", methods=["GET"])
def get_heatmap():
    """Fetch heatmap data filtered by date and hour."""
    date = request.args.get("date")
    start_hour = request.args.get("startHour", default=0, type=int)
    end_hour = request.args.get("endHour", default=23, type=int)

    if not date:
        return jsonify({"error": "Missing date parameter"}), 400

    try:
        data = get_filtered_data(date, start_hour, end_hour)
        parsed_data = json.loads(data)

        if not parsed_data.get("features"):
            return jsonify({"error": "No data found for this date and time range.", "features": []}), 200

        return jsonify(parsed_data)
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e), "features": []}), 500

@app.route("/available-dates", methods=["GET"])
def get_available_dates_route():
    """Return dates that have data in the database."""
    try:
        available_dates = get_available_dates()
        return jsonify({"available_dates": available_dates})
    except Exception as e:
        print(f"Error fetching available dates: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route("/bitmap", methods=["GET"])
def get_bitmap():
    """Serve the image as a Base64 string."""
    try:
        with open("parque_image_borders.png", "rb") as img_file:
            img_base64 = base64.b64encode(img_file.read()).decode("utf-8")

        return jsonify({"image": f"data:image/png;base64,{img_base64}"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
