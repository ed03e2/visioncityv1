from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from database import get_filtered_data, get_available_dates

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow frontend requests

@app.route("/heatmap", methods=["GET"])
def get_heatmap():
    """Fetch heatmap data filtered by date."""
    date = request.args.get("date")
    if not date:
        return jsonify({"error": "Missing date parameter"}), 400

    try:
        data = get_filtered_data(date)
        parsed_data = json.loads(data)

        if not parsed_data.get("features"):
            return jsonify({"error": "No data found for this date.", "features": []}), 200

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
