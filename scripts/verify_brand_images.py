import os
from PIL import Image

brands = [
    ("COZY Cafe", "(1) Dear Ekra Reels _ Facebook_files/849738288_1310233834529553_3783114124323737083_n.jpg"),
    ("Marshmallow Tech", "(1) Dear Ekra Reels _ Facebook_files/746715899_3594141194076070_6657186183710383926_n.jpg"),
    ("PaiMart", "(1) Dear Ekra Reels _ Facebook_files/864636152_878248778644609_4498501340605083609_n.jpg"),
    ("Dentflix", "(1) Dear Ekra Reels _ Facebook_files/628283022_909279064811675_8820849548174914199_n.jpg"),
    ("Air Force Basecamp", "(1) Dear Ekra Reels _ Facebook_files/841736931_1830008904696707_5509329834841030658_n.jpg"),
    ("Dr Alvin", "(1) Dear Ekra Reels _ Facebook_files/869474296_2245677162721864_1778620391644637421_n.jpg"),
    ("Cake Town", "(1) Dear Ekra Reels _ Facebook_files/622801780_1408056994353110_3427160139819703616_n.jpg"),
    ("HER Studio", "(1) Dear Ekra Reels _ Facebook_files/851191450_2300502357460347_4976039782555987151_n.jpg"),
]

for name, path in brands:
    if os.path.exists(path):
        im = Image.open(path)
        print(f"[OK] {name}: {im.size} - {path}")
    else:
        print(f"[NOT FOUND] {name}: {path}")

