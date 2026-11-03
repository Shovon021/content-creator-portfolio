import shutil
import os

mappings = [
    ("cozy_cafe.jpg", "(1) Dear Ekra Reels _ Facebook_files/849738288_1310233834529553_3783114124323737083_n.jpg"),
    ("marshmallow_tech.jpg", "(1) Dear Ekra Reels _ Facebook_files/746715899_3594141194076070_6657186183710383926_n.jpg"),
    ("paimart.jpg", "(1) Dear Ekra Reels _ Facebook_files/864636152_878248778644609_4498501340605083609_n.jpg"),
    ("dentflix.jpg", "(1) Dear Ekra Reels _ Facebook_files/628283022_909279064811675_8820849548174914199_n.jpg"),
    ("basecamp.jpg", "(1) Dear Ekra Reels _ Facebook_files/841736931_1830008904696707_5509329834841030658_n.jpg"),
    ("dr_alvin.jpg", "(1) Dear Ekra Reels _ Facebook_files/869474296_2245677162721864_1778620391644637421_n.jpg"),
    ("cake_town.jpg", "(1) Dear Ekra Reels _ Facebook_files/622801780_1408056994353110_3427160139819703616_n.jpg"),
    ("her_studio.jpg", "(1) Dear Ekra Reels _ Facebook_files/851191450_2300502357460347_4976039782555987151_n.jpg"),
]

os.makedirs('public/thumbnails', exist_ok=True)

for target_name, src_path in mappings:
    dest_path = os.path.join('public/thumbnails', target_name)
    shutil.copy2(src_path, dest_path)
    print(f"Copied {src_path} -> {dest_path} ({os.path.getsize(dest_path)} bytes)")

print("All 8 thumbnails copied successfully!")

