from PIL import Image, ImageDraw

# Create 4x2 grid of pic1 to pic8
cell_w, cell_h = 300, 300
canvas = Image.new('RGB', (cell_w * 4, cell_h * 2), color=(255, 255, 255))
draw = ImageDraw.Draw(canvas)

for i in range(1, 9):
    fname = f'pic{i}.jpg'
    idx = i - 1
    c = idx % 4
    r = idx // 4
    x = c * cell_w
    y = r * cell_h
    
    im = Image.open(fname)
    im.thumbnail((cell_w - 20, cell_h - 40))
    
    im_w, im_h = im.size
    canvas.paste(im, (x + (cell_w - im_w) // 2, y + 30))
    draw.text((x + 10, y + 10), fname, fill=(0, 0, 0))

out_path = 'C:/Users/USER/.gemini/antigravity/brain/865c267e-f567-40a1-ab7e-de2fa02fce60/user_pics_overview.png'
canvas.save(out_path)
print("Saved user pics overview to:", out_path)

