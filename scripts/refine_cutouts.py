import numpy as np
from PIL import Image

def clean_pic7():
    img = Image.open("public/portraits/pic7_cutout.png").convert("RGBA")
    orig = np.array(Image.open("pic7.jpg").convert("RGB"))
    arr = np.array(img)
    
    # Yellowish-beige wall spotlight patch is between x: 345..425 and y: 0..300
    r, g, b = orig[:, :, 0], orig[:, :, 1], orig[:, :, 2]
    is_wall = (r > 130) & (g > 110) & (b > 80)
    
    mask = np.zeros((960, 960), dtype=bool)
    mask[0:310, 340:430] = True
    
    arr[is_wall & mask, 3] = 0
    
    cleaned = Image.fromarray(arr, mode="RGBA")
    cleaned.save("public/portraits/pic7_cutout.png")
    print("Cleaned pic7_cutout.png")

def clean_pic3():
    img = Image.open("public/portraits/pic3_cutout.png").convert("RGBA")
    arr = np.array(img)
    # Clear any residual artifact on the left border (x < 75)
    arr[50:400, 0:75, 3] = 0
    cleaned = Image.fromarray(arr, mode="RGBA")
    cleaned.save("public/portraits/pic3_cutout.png")
    print("Cleaned pic3_cutout.png")

if __name__ == "__main__":
    clean_pic7()
    clean_pic3()
