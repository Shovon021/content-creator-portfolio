import os
import numpy as np
from PIL import Image

def crop_cutouts():
    src_dir = os.path.join("public", "portraits")
    
    for i in range(1, 9):
        p = os.path.join(src_dir, f"pic{i}_cutout.png")
        if not os.path.exists(p):
            print(f"Skipping {p} (not found)")
            continue
            
        img = Image.open(p).convert("RGBA")
        arr = np.array(img)[:, :, 3] # Alpha
        
        # Non-zero alpha coordinates
        y_indices, x_indices = np.where(arr > 15)
        if len(y_indices) == 0:
            print(f"Warning: {p} has no alpha content")
            continue
            
        y_min, y_max = y_indices.min(), y_indices.max()
        x_min, x_max = x_indices.min(), x_indices.max()
        
        # Add 5px padding if possible
        y_min = max(0, y_min - 5)
        x_min = max(0, x_min - 5)
        y_max = min(img.height, y_max + 5)
        x_max = min(img.width, x_max + 5)
        
        cropped = img.crop((x_min, y_min, x_max, y_max))
        cropped.save(p, "PNG")
        print(f"Tightly cropped {p}: new size {cropped.size} (orig {img.size})")

if __name__ == "__main__":
    crop_cutouts()

