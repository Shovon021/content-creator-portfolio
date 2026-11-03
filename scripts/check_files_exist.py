import os

posters = {
    "Marshmallow Tech": "746350916_1055976403552370_201619623624289073_n.jpg",
    "COZY Cafe": "849738288_1310233834529553_3783114124323737083_n.jpg",
    "PaiMart By PaiNest": "869686745_1606503461221633_5924256987091670177_n.jpg",
    "Dentflix Dentistry": "628283022_909279064811675_8820849548174914199_n.jpg",
    "Air Force BASECAMP": "842556010_1659499039029525_3411005639304922371_n.jpg",
    "Dr. Alvin": "869474296_2245677162721864_1778620391644637421_n.jpg",
    "Cake Town BD": "622801780_1408056994353110_3427160139819703616_n.jpg",
    "HER Studio & Salon": "849551547_1088366764007591_2316407332064286305_n.jpg"
}

dirs = [
    "Facebook_files",
    "(1) Dear Ekra Reels _ Facebook_files"
]

for name, fname in posters.items():
    found = False
    for d in dirs:
        full_path = os.path.join(d, fname)
        if os.path.exists(full_path):
            size = os.path.getsize(full_path)
            print(f"[EXISTS] {name}: {full_path} ({size} bytes)")
            found = True
            break
    if not found:
        # Check partial match
        part = fname.split('_')[1] if '_' in fname else fname
        matches = []
        for d in dirs:
            if os.path.exists(d):
                for f in os.listdir(d):
                    if part in f:
                        matches.append(os.path.join(d, f))
        print(f"[MISSING] {name}: {fname} -> Found partial: {matches}")

