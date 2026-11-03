import os
from PIL import Image, ImageDraw, ImageFont

# Define arch colors matching each picture
CONFIGS = [
    {"id": 1, "title": "Sky Blue Saree", "arch_color": "#60A5FA", "glow": "#93C5FD"},
    {"id": 2, "title": "Blush Floral Dress", "arch_color": "#F43F5E", "glow": "#FDA4AF"},
    {"id": 3, "title": "Warm Caramel Cafe", "arch_color": "#D97706", "glow": "#FDE68A"},
    {"id": 4, "title": "Pastel Aqua Garden", "arch_color": "#0D9488", "glow": "#99F6E4"},
    {"id": 5, "title": "Soft Rose Studio", "arch_color": "#EC4899", "glow": "#FBCFE8"},
    {"id": 6, "title": "Electric Blue Coffee", "arch_color": "#0284C7", "glow": "#BAE6FD"},
    {"id": 7, "title": "Royal Violet Saree", "arch_color": "#7C3AED", "glow": "#DDD6FE"},
    {"id": 8, "title": "Ruby Crimson Saree", "arch_color": "#BE123C", "glow": "#FECDD3"},
]

def hex_to_rgb(hex_str):
    hex_str = hex_str.lstrip('#')
    return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

def render_arch_portrait(cutout_path, arch_hex, card_w=300, card_h=400):
    # Canvas with soft white background
    card = Image.new("RGBA", (card_w, card_h), (255, 255, 255, 255))
    draw = ImageDraw.Draw(card)
    
    # upside down "U" arch dimensions
    arch_w = int(card_w * 0.72)
    arch_h = int(card_h * 0.78)
    arch_x = (card_w - arch_w) // 2
    arch_y = card_h - arch_h - 20
    
    arch_color = hex_to_rgb(arch_hex)
    
    # Draw arch: rounded top (half circle) + rectangle bottom
    # Semi-circle at top: bbox is (arch_x, arch_y, arch_x + arch_w, arch_y + arch_w)
    draw.pieslice([arch_x, arch_y, arch_x + arch_w, arch_y + arch_w], 180, 360, fill=arch_color)
    # Rectangle at bottom: from arch_y + arch_w // 2 to arch_y + arch_h
    draw.rectangle([arch_x, arch_y + arch_w // 2, arch_x + arch_w, arch_y + arch_h], fill=arch_color)
    
    # Load cutout
    if os.path.exists(cutout_path):
        cutout = Image.open(cutout_path).convert("RGBA")
        
        # Fit cutout nicely over the arch, letting head/torso extend gracefully
        target_h = int(arch_h * 1.08)
        scale = target_h / cutout.height
        target_w = int(cutout.width * scale)
        cutout_resized = cutout.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        # Position cutout centered horizontally, aligned to bottom of arch
        paste_x = (card_w - target_w) // 2
        paste_y = (arch_y + arch_h) - target_h
        
        card.alpha_composite(cutout_resized, (paste_x, paste_y))
        
    return card

def main():
    card_w, card_h = 320, 420
    cols = 4
    rows = 2
    canvas_w = cols * card_w + (cols + 1) * 20
    canvas_h = rows * card_h + (rows + 1) * 20 + 60
    
    grid = Image.new("RGB", (canvas_w, canvas_h), (250, 245, 247))
    draw = ImageDraw.Draw(grid)
    
    for idx, cfg in enumerate(CONFIGS):
        i = cfg["id"]
        c = idx % cols
        r = idx // cols
        
        cutout_path = os.path.join("public", "portraits", f"pic{i}_cutout.png")
        card = render_arch_portrait(cutout_path, cfg["arch_color"], card_w, card_h)
        
        x = 20 + c * (card_w + 20)
        y = 70 + r * (card_h + 20)
        grid.paste(card, (x, y))
        
        # Label
        draw.text((x + 10, y + card_h - 25), f"Look {i}: {cfg['title']} ({cfg['arch_color']})", fill=(30, 30, 30))
        
    draw.text((30, 20), "Dear Ekra - Upside Down 'U' Arch Portraits with Solid Harmonized Colors", fill=(225, 29, 72))
    
    out_preview = r"C:\Users\USER\.gemini\antigravity\brain\865c267e-f567-40a1-ab7e-de2fa02fce60\cutouts_arch_preview.png"
    grid.save(out_preview)
    print("Saved preview to", out_preview)

if __name__ == "__main__":
    main()

