import os
import sys
from PIL import Image
from rembg import remove, new_session

def main():
    out_dir = os.path.join('public', 'portraits')
    os.makedirs(out_dir, exist_ok=True)
    
    print("Initializing rembg session...")
    session = new_session("u2net")
    
    for i in range(1, 9):
        input_file = f"pic{i}.jpg"
        output_file = os.path.join(out_dir, f"pic{i}_cutout.png")
        
        if not os.path.exists(input_file):
            print(f"Warning: {input_file} not found, skipping.")
            continue
            
        print(f"Removing background for {input_file} -> {output_file}...")
        with Image.open(input_file) as img:
            # remove background
            cutout = remove(img, session=session)
            cutout.save(output_file, format="PNG")
        print(f"Successfully saved {output_file} ({os.path.getsize(output_file)} bytes)")

    print("All portraits processed successfully!")

if __name__ == "__main__":
    main()

