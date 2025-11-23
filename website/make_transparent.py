#!/usr/bin/env python3
"""
Convert PNG images to have transparent backgrounds.
Removes white and near-white backgrounds from images.
"""

from PIL import Image
import numpy as np

def make_transparent(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")

    data = np.array(img)

    # Get RGB values
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

    # Define white and near-white pixels (with some tolerance)
    # Pixels where all RGB values are above 240 (very light)
    white_areas = (r > 240) & (g > 240) & (b > 240)

    # Set alpha to 0 for white areas
    data[:,:,3] = np.where(white_areas, 0, a)

    # Create new image and save
    img_transparent = Image.fromarray(data)
    img_transparent.save(output_path, "PNG")
    print(f"Converted {input_path} -> {output_path}")

# Convert all three images
make_transparent("Hook.png", "Hook.png")
make_transparent("Anchor.png", "Anchor.png")
make_transparent("Stream.png", "Stream.png")

print("All images converted to transparent backgrounds")
