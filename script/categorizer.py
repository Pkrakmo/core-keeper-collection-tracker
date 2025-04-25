import os
from collections import defaultdict

script_dir = os.path.dirname(os.path.abspath(__file__))
icons_path = os.path.join(script_dir, '../public/icons/')
output_file = 'item_lists.py'

# Step 1: Define maingroups and their subgroups
maingroups = {
    "Tools_And_Weapons": ["Tools", "Weapons"],
    "Valuables": ["Valuables", "Figurines", "Oracle Cards"],
    "Accessories": ["Polished_Rings_and_Necklaces", "Rings", "Necklaces", "Bags_and_Pouches", "Lanterns"],
}

# Step 2: Setup nested structure
nested_data = defaultdict(lambda: defaultdict(list))

# Step 3: Process folders
for category in os.listdir(icons_path):
    category_path = os.path.join(icons_path, category)
    if os.path.isdir(category_path):
        for filename in os.listdir(category_path):
            if filename.endswith('.png'):
                name_part = filename.split(',')[0]
                readable_name = name_part.replace('_', ' ')
                lowered = readable_name.lower()

                # Step 4: Special logic for Treasures → Valuables
                if category == "Treasures":
                    if "figurine" in lowered:
                        nested_data["Valuables"]["Figurines"].append(f'"{readable_name}"')
                    elif readable_name.startswith("Oracle Card"):
                        nested_data["Valuables"]["Oracle_Cards"].append(f'"{readable_name}"')
                    else:
                        nested_data["Valuables"]["Valuables"].append(f'"{readable_name}"')
                    continue

                # Step 5: Special logic for Accessories
                if category == "Accessories":
                    if "polished" in lowered:
                        nested_data["Accessories"]["Polished_Rings_and_Necklaces"].append(f'"{readable_name}"')
                    elif "bag" in lowered or "pouch" in lowered or "belt" in lowered or "satchel" in lowered or "backpack" in lowered:
                        nested_data["Accessories"]["Bags_and_Pouches"].append(f'"{readable_name}"')
                    elif "ring" in lowered:
                        nested_data["Accessories"]["Rings"].append(f'"{readable_name}"')
                    elif "necklace" in lowered or "amulet" in lowered or "medallion" in lowered:
                        nested_data["Accessories"]["Necklaces"].append(f'"{readable_name}"')
                    elif "lantern" in lowered:
                        nested_data["Accessories"]["Lanterns"].append(f'"{readable_name}"')
                    else:
                        nested_data["Accessories"]["Other"].append(f'"{readable_name}"')
                    continue

                # Step 6: Check other defined maingroups
                assigned = False
                for maingroup, subgroups in maingroups.items():
                    if category in subgroups:
                        nested_data[maingroup][category].append(f'"{readable_name}"')
                        assigned = True
                        break

                if not assigned:
                    # If not part of any Maingroup, store it under "Uncategorized"
                    nested_data["Uncategorized"][category].append(f'"{readable_name}"')

# Step 7: Write to file
with open(output_file, 'w', encoding='utf-8') as f:
    for maingroup, subgroups in nested_data.items():
        f.write(f"{maingroup.replace(' ', '_')} = {{\n")
        for subgroup, items in subgroups.items():
            f.write(f'    "{subgroup}": [\n')
            for item in items:
                f.write(f"        {item},\n")
            f.write("    ],\n")
        f.write("}\n\n")

print(f"✅ Nested categorized lists written to {output_file}")
