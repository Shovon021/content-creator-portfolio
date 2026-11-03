import os
import shutil

# 1. Ensure public/thumbnails directory exists
os.makedirs("public/thumbnails", exist_ok=True)

# 2. Key thumbnails mapping
source_dir = "(1) Dear Ekra Reels _ Facebook_files"

top_images = [
    ("476572003_2098415184319074_9183082737484248286_n.jpg", "reel_2_4m.jpg"),
    ("499417859_751735203982534_2565709436667447780_n.jpg", "reel_1_3m.jpg"),
    ("504805318_2225728911179163_1592067683995799554_n.jpg", "reel_1_2m.jpg"),
    ("482254474_602223175972606_8244355491126646630_n.jpg", "reel_1m_food.jpg"),
    ("622074191_1687058698948159_5211453839788411704_n.jpg", "reel_1m_stay.jpg"),
    ("595882876_2012219366234546_7015821699692518020_n.jpg", "reel_517k_basecamp.jpg"),
    ("849738288_1310233834529553_3783114124323737083_n.jpg", "reel_321k_marshmallow.jpg"),
    ("466512846_1812814886163989_6574120977611523231_n.jpg", "reel_275k_dentflix.jpg")
]

for src_name, dst_name in top_images:
    src_path = os.path.join(source_dir, src_name)
    dst_path = os.path.join("public/thumbnails", dst_name)
    if os.path.exists(src_path):
        shutil.copy2(src_path, dst_path)
        print(f"Copied {src_name} -> {dst_name}")
    else:
        print(f"Not found: {src_name}")

print("Thumbnail assets ready in public/thumbnails/")

