import os
import json
import re
from seasonal_items import SEASONAL_ITEMS
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
    return name.replace("_", " ").strip()

def parse_filename(filename, category):
    try:
        name_id_part = filename.rsplit('.', 1)[0]
        raw_name, item_id, _ = name_id_part.split(',', 2)
        cleaned_name = clean_name(raw_name)

        return {
            "id": item_id,
            "name": cleaned_name,
            "icon": f"/icons/{category}/{filename}",
            "boss": cleaned_name in BOSS_ITEMS,
            "seasonal": cleaned_name in SEASONAL_ITEMS,
            "craftable": cleaned_name in CRAFTABLE_ITEMS,
            "merchant": cleaned_name in MERCHANT_ITEMS,
            "dropped": cleaned_name in DROP_ITEMS,
            "owned": False,
            "fishing": cleaned_name in FISHING_ITEMS,
            "loot": cleaned_name in LOOT_ITEMS,
            "dig": cleaned_name in DIGSPOT_ITEMS,
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
    def load_json_files(base_path):
        data = []
        for root, _, files in os.walk(base_path):
            for file in files:
                if file.endswith(".json") and file != "bossdata.json":
                    file_path = os.path.join(root, file)
                    with open(file_path, "r", encoding="utf-8") as f:
                        try:
                            json_data = json.load(f)
                            if isinstance(json_data, list):
                                data.extend(json_data)
                            elif isinstance(json_data, dict):
                                data.append(json_data)
                            else:
                                print(f"Skipping non-list/dict JSON in {file_path}")
                        except json.JSONDecodeError as e:
                            print(f"Error decoding JSON in {file_path}: {e}")
        return data

    all_items = load_json_files(output_path)

    boss_data_with_ids = {}

    for boss, items in boss_data.items():
        boss_data_with_ids[boss] = []
        for item in items:
            item_obj = next((x for x in all_items if x["name"] == item), None)
            if item_obj:
                boss_data_with_ids[boss].append(item_obj)
            else:
                boss_data_with_ids[boss].append({
                    "name": item,
                    "id": "ID not found",
                    "icon": None,
                    "boss": True,
                    "seasonal": False,
                    "craftable": False,
                    "merchant": False,
                    "dropped": False,
                    "owned": False,
                    "fishing": False,
                    "loot": False,
                    "dig": False,
                })

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
