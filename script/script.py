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

def main():
    delete_unwanted_folders()  # Delete unwanted folders first
    for category in os.listdir(base_path):
        folder_path = os.path.join(base_path, category)
        if os.path.isdir(folder_path):
            print(f"Processing {category}...")
            process_category_folder(category)
    print("All done!")

if __name__ == "__main__":
    main()
