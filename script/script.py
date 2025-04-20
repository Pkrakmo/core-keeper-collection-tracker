import os
import json
import re
from seasonal_items import SEASONAL_ITEMS
from name_overrides import NAME_OVERRIDES
from boss_items import BOSS_ITEMS
from craftable_items import CRAFTABLE_ITEMS
from drop_items import DROP_ITEMS
from loot_items import LOOT_ITEMS
from merchant_items import MERCHANT_ITEMS
from fishing_items import FISHING_ITEMS
from digspot_items import DIGSPOT_ITEMS
from boss_data import boss_data  # Import boss_data for boss processing

# Path to your icons folder
base_path = "./public/icons"

# Output folder for the JSON files
output_path = os.path.join("src", "public")
os.makedirs(output_path, exist_ok=True)

def clean_name(name):
    # Add space before capital letters (except first char), but avoid splitting patterns like "ID"
    return re.sub(r'(?<=[a-z])(?=[A-Z])', ' ', name).strip()

def parse_filename(filename, category):
    try:
        name_id_part = filename.rsplit('.', 1)[0]
        raw_name, item_id, _ = name_id_part.split(',', 2)
        cleaned_name = clean_name(raw_name)

        # Apply override if available
        final_name = NAME_OVERRIDES.get(cleaned_name, cleaned_name)

        return {
            "id": item_id,
            "name": final_name,
            "icon": f"/icons/{category}/{filename}",
            "boss": final_name in BOSS_ITEMS,
            "seasonal": final_name in SEASONAL_ITEMS,
            "craftable": final_name in CRAFTABLE_ITEMS,
            "merchant": final_name in MERCHANT_ITEMS,
            "dropped": final_name in DROP_ITEMS,
            "owned": False,
            "fishing": final_name in FISHING_ITEMS,
            "loot": final_name in LOOT_ITEMS,
            "dig": final_name in DIGSPOT_ITEMS,
        }
    
    except ValueError:
        print(f"Skipping malformed filename: {filename}")
        return None

def process_category_folder(category):
    folder_path = os.path.join(base_path, category)
    items = []

    for filename in os.listdir(folder_path):
        if filename.lower().endswith('.png'):
            item = parse_filename(filename, category)
            if item:
                items.append(item)

    items.sort(key=lambda x: x["name"].lower())

    output_filename = f"{category.lower()}.json"
    output_file = os.path.join(output_path, output_filename)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2, ensure_ascii=False)

def delete_unwanted_folders():
    # Folders to delete
    folders_to_delete = ["Unused", "Unobtainable"]
    for folder in folders_to_delete:
        folder_path = os.path.join(base_path, folder)
        if os.path.exists(folder_path) and os.path.isdir(folder_path):
            print(f"Deleting folder: {folder_path}")
            try:
                # Remove the folder and its contents
                os.rmdir(folder_path)
            except OSError:
                # If the folder is not empty, use shutil.rmtree
                import shutil
                shutil.rmtree(folder_path)
            print(f"Deleted folder: {folder_path}")

def process_boss_data():
    # Load all items from the JSON files
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

    all_items = load_json_files(output_path)

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

def main():
    delete_unwanted_folders()  # Delete unwanted folders first
    for category in os.listdir(base_path):
        folder_path = os.path.join(base_path, category)
        if os.path.isdir(folder_path):
            print(f"Processing {category}...")
            process_category_folder(category)
    process_boss_data()  # Process boss data last
    print("All done!")

if __name__ == "__main__":
    main()
