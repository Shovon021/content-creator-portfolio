from PIL import Image, ImageDraw, ImageFont

brands = [
    ("COZY Cafe (321K)", "(1) Dear Ekra Reels _ Facebook_files/849738288_1310233834529553_3783114124323737083_n.jpg"),
    ("Marshmallow Tech", "(1) Dear Ekra Reels _ Facebook_files/746715899_3594141194076070_6657186183710383926_n.jpg"),
    ("PaiMart By PaiNest", "(1) Dear Ekra Reels _ Facebook_files/864636152_878248778644609_4498501340605083609_n.jpg"),
    ("Dentflix Dentistry", "(1) Dear Ekra Reels _ Facebook_files/628283022_909279064811675_8820849548174914199_n.jpg"),
    ("Air Force Basecamp", "(1) Dear Ekra Reels _ Facebook_files/841736931_1830008904696707_5509329834841030658_n.jpg"),
    ("Dr Alvin Kojic Soap", "(1) Dear Ekra Reels _ Facebook_files/869474296_2245677162721864_1778620391644637421_n.jpg"),
    ("Cake Town BD", "(1) Dear Ekra Reels _ Facebook_files/622801780_1408056994353110_3427160139819703616_n.jpg"),
    ("HER Studio & Salon", "(1) Dear Ekra Reels _ Facebook_files/851191450_2300502357460347_4976039782555987151_n.jpg"),
]

# Create a 4x2 grid of thumbnails
cell_w, cell_h = 300, 500
cols, rows = 4, 2
canvas = Image.new('RGB', (cols * cell_w, rows * cell_h), color=(20, 30, 25))
draw = ImageDraw.Draw(canvas)

for idx, (title, path) in enumerate(brands):
    c = idx % cols
    r = idx // cols
    x = c * cell_w
    y = r * cell_h
    
    im = Image.open(path).convert('RGB')
    im.thumbnail((cell_w - 20, cell_h - 70))
    
    im_w, im_h = im.size
    canvas.paste(im, (x + (cell_w - im_w) // 2, y + 50))
    
    # Draw label
    draw.rectangle([x, y, x + cell_w, y + 45], fill=(10, 20, 15))
    draw.text((x + 10, y + 15), title, fill=(255, 255, 255))

output_path = 'C:/Users/USER/.gemini/antigravity/brain/865c267e-f567-40a1-ab7e-de2fa02fce60/brand_thumbnails_check.png'
canvas.save(output_path)
print("Saved verification sheet to:", output_path)

