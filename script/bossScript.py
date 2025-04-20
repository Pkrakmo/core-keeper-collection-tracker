import os
import sys
import json

# Add the script directory to the Python module search path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from boss_data import boss_data

# Path to your JSON files folder
base_path = "./src/public"

# Output folder for the JSON files
output_path = os.path.join("src", "public")
os.makedirs(output_path, exist_ok=True)

# Function to load all JSON files in a directory
def load_json_files(base_path):
    data = []
    for root, _, files in os.walk(base_path):
        for file in files:
            if file.endswith(".json"):
                file_path = os.path.join(root, file)
                with open(file_path, "r", encoding="utf-8") as f:
                    try:
                        data.extend(json.load(f))  # Assuming each JSON file contains a list of items
                    except json.JSONDecodeError as e:
                        print(f"Error decoding JSON in {file_path}: {e}")
    return data

# Load all items from the JSON files
all_items = load_json_files(base_path)

# Create a mapping of item names to their IDs
item_name_to_id = {item["name"]: item["id"] for item in all_items if "name" in item and "id" in item}

# Dictionary to store boss data with item IDs
boss_data_with_ids = {}

# Iterate over all bosses and their items
for boss, items in boss_data.items():
    boss_data_with_ids[boss] = []
    for item in items:
        item_id = item_name_to_id.get(item, None)
        boss_data_with_ids[boss].append({
            "name": item,
            "id": item_id if item_id else "ID not found"
        })

# Save the updated boss data with item IDs to a JSON file
output_file = os.path.join(output_path, "bossdata.json")
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(boss_data_with_ids, f, indent=4, ensure_ascii=False)

print(f"Boss data with item IDs saved to {output_file}")