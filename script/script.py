import json
import os
import re
import item_lists

from digspot_data import digspot_data
from fishspot_data import fishspot_data
from fishspotitems_data import itemfishspot_data

# Step 1: Build reverse lookup map of item name → (MainCategory, SubCategory)
item_to_category = {}

def build_lookup():
    for main_category_name in dir(item_lists):
        if main_category_name.startswith("__"):
            continue  # skip built-ins

        subgroups = getattr(item_lists, main_category_name)
        if isinstance(subgroups, dict):
            for sub_name, items in subgroups.items():
                for item in items:
                    clean_name = item.strip('"')
                    item_to_category[clean_name] = (main_category_name, sub_name)

build_lookup()

# Step 2: Load input data
script_dir = os.path.dirname(os.path.abspath(__file__))
input_path = os.path.join(script_dir, 'gamedata_filtered.json')
with open(input_path, 'r', encoding='utf-8') as f:
    items = json.load(f)

# Step 3: Collect icon files
icons_dir = os.path.join(script_dir, '../public/icons/')
icon_files = []
for root, _, files in os.walk(icons_dir):
    for file in files:
        if file.lower().endswith(('.png', '.jpg', '.jpeg')):
            full_path = os.path.join(root, file)
            relative_path = os.path.relpath(full_path, icons_dir)
            icon_files.append(relative_path)

# Create category-based lookup from digspot_data
digspot_flags = {}
for category, item_list in digspot_data.items():
    for item in item_list:
        digspot_flags.setdefault(item, []).append(category)

fishspot_flags = {}
for category, item_list in fishspot_data.items():
    for item in item_list:
        fishspot_flags.setdefault(item, []).append(category)

fishspotitems_flags = {}
for category, item_list in itemfishspot_data.items():
    for item in item_list:
        fishspotitems_flags.setdefault(item, []).append(category)

# Step 4: Match items with icons and assign category
output = []
for item in items:
    object_id = item['ObjectID']
    matched_icon = next(
        (filename for filename in icon_files if re.search(rf",{object_id},", filename)),
        None
    )

    if matched_icon:
        ingame_name = item['InGameName']
        main_cat, sub_cat = item_to_category.get(ingame_name, ("Uncategorized", "Uncategorized"))

        # Default flags
        flags = ["seasonal", "boss"]

        # Add digspot-related flags
        if ingame_name in digspot_flags:
            flags.extend(digspot_flags[ingame_name])

        if ingame_name in fishspot_flags:
            flags.extend(fishspot_flags[ingame_name])

        if ingame_name in fishspotitems_flags:
            flags.extend(fishspotitems_flags[ingame_name])

        result = {
            "InGameName": ingame_name,
            "ObjectID": object_id,
            "Icon": "/icons/" + matched_icon.replace("\\", "/"),
            "MainCategory": main_cat,
            "SubCategory": sub_cat,
            "Flags": flags,
            "Owned": False,
        }
        output.append(result)

# Step 5: Write result to JSON
output_path = os.path.join(script_dir, 'gameData.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"\n✅ Done! Matched {len(output)} item(s) with icons and category data.")
