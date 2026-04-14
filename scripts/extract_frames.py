"""
Extrai frames do video para o canvas scrub.
Requer: pip install opencv-python  (ou imageio-ffmpeg)

Uso:
    python scripts/extract_frames.py
"""

import os
import sys
from pathlib import Path

try:
    import cv2
except ImportError:
    print("Erro: instale com 'pip install opencv-python'")
    sys.exit(1)


ROOT = Path(__file__).resolve().parent.parent
VIDEO_PATH = ROOT / "public" / "video" / "nike_dunk_low.mp4"
OUTPUT_DIR = ROOT / "public" / "frames"
MAX_FRAMES = 300
JPEG_QUALITY = 60


def extract_frames() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Lendo video de: {VIDEO_PATH}")
    vidcap = cv2.VideoCapture(str(VIDEO_PATH))

    if not vidcap.isOpened():
        print("Erro: Nao foi possivel abrir o video.")
        sys.exit(1)

    success, image = vidcap.read()
    count = 0

    print("Iniciando extracao...")
    while success and count < MAX_FRAMES:
        out_path = OUTPUT_DIR / f"frame_{count:04d}.jpg"
        cv2.imwrite(str(out_path), image, [int(cv2.IMWRITE_JPEG_QUALITY), JPEG_QUALITY])
        success, image = vidcap.read()
        count += 1
        if count % 30 == 0:
            print(f"{count} frames extraidos...")

    print(f"Sucesso! {count} frames salvos em {OUTPUT_DIR}")


if __name__ == "__main__":
    extract_frames()
