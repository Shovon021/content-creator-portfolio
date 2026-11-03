import os
import sys
import numpy as np
import onnxruntime as ort
from PIL import Image

def process_image(session, input_path, output_path):
    print(f"Opening {input_path}...")
    img = Image.open(input_path).convert("RGB")
    orig_w, orig_h = img.size
    
    # Preprocess: resize to 320x320 and normalize
    resized = img.resize((320, 320), Image.Resampling.BILINEAR)
    arr = np.array(resized, dtype=np.float32) / 255.0
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
    arr = (arr - mean) / std
    input_tensor = np.transpose(arr, (2, 0, 1))[np.newaxis, :, :, :]
    
    input_name = session.get_inputs()[0].name
    outputs = session.run(None, {input_name: input_tensor})
    
    pred = outputs[0][:, 0, :, :]
    ma = np.max(pred)
    mi = np.min(pred)
    if ma > mi:
        pred = (pred - mi) / (ma - mi)
    pred = np.squeeze(pred)
    
    # Smooth soft alpha thresholding
    mask_arr = np.clip(pred, 0, 1)
    # Enhance contrast slightly to ensure crisp edges without halos
    mask_arr = np.power(mask_arr, 1.2) * 255.0
    
    mask = Image.fromarray(mask_arr.astype(np.uint8), mode="L")
    mask = mask.resize((orig_w, orig_h), Image.Resampling.LANCZOS)
    
    # Create transparent PNG
    cutout = Image.new("RGBA", (orig_w, orig_h), (0, 0, 0, 0))
    cutout.paste(img, (0, 0), mask=mask)
    cutout.save(output_path, "PNG")
    print(f"Successfully processed {input_path} -> {output_path} ({orig_w}x{orig_h})")

def main():
    model_path = os.path.join("models", "u2netp.onnx")
    out_dir = os.path.join("public", "portraits")
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"Loading ONNX model from {model_path}...")
    opts = ort.SessionOptions()
    opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
    session = ort.InferenceSession(model_path, sess_options=opts, providers=["CPUExecutionProvider"])
    
    for i in range(1, 9):
        in_file = f"pic{i}.jpg"
        out_file = os.path.join(out_dir, f"pic{i}_cutout.png")
        if os.path.exists(in_file):
            process_image(session, in_file, out_file)
        else:
            print(f"Skipping {in_file} (not found)")
            
    print("All 8 images processed successfully!")

if __name__ == "__main__":
    main()

