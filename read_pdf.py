#!/usr/bin/env python3
"""
Extrai texto, tabelas e imagens de um PDF local.
Uso: python read_pdf.py /caminho/para/artigo.pdf
Saída: JSON no stdout
"""
import sys
import json
import base64
import io
import re

import pdfplumber
import fitz  # pymupdf
from PIL import Image


def _clean_text(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r'-\n(\w)', r'\1', text)
    text = re.sub(r'(?<!\n)\n(?!\n)', ' ', text)
    text = re.sub(r' {2,}', ' ', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def _extract_text_and_tables(filepath: str):
    pages_text = []
    tables = []
    with pdfplumber.open(filepath) as pdf:
        for page_num, page in enumerate(pdf.pages, start=1):
            raw = page.extract_text(x_tolerance=3, y_tolerance=3) or ""
            pages_text.append(_clean_text(raw))

            for tbl in page.extract_tables():
                if not tbl:
                    continue
                non_empty = [[cell or "" for cell in row] for row in tbl if any(cell for cell in row)]
                if len(non_empty) < 2:
                    continue
                tables.append({
                    "page": page_num,
                    "headers": non_empty[0],
                    "rows": non_empty[1:],
                })
    return pages_text, tables


def _encode_image(image_bytes: bytes, ext: str) -> str:
    try:
        img = Image.open(io.BytesIO(image_bytes))
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        buf = io.BytesIO()
        img.save(buf, format="PNG", optimize=True)
        buf.seek(0)
        b64 = base64.b64encode(buf.read()).decode("utf-8")
        return f"data:image/png;base64,{b64}"
    except Exception:
        return ""


def _extract_images(filepath: str):
    images = []
    doc = fitz.open(filepath)
    for page_num in range(len(doc)):
        page = doc[page_num]
        for img_index, img_info in enumerate(page.get_images(full=True)):
            xref = img_info[0]
            base_image = doc.extract_image(xref)
            img_bytes = base_image["image"]
            if len(img_bytes) < 4096:
                continue
            ext = base_image.get("ext", "png")
            encoded = _encode_image(img_bytes, ext)
            if encoded:
                images.append({
                    "page": page_num + 1,
                    "index": len(images),
                    "base64": encoded,
                })
    doc.close()
    return images


def _detect_title(pages_text: list, metadata: dict) -> str:
    if metadata.get("title"):
        return metadata["title"].strip()
    for page in pages_text[:2]:
        lines = [l.strip() for l in page.split('\n') if l.strip()]
        if lines:
            candidate = lines[0]
            if len(candidate) > 10:
                return candidate[:200]
    return "Documento sem título"


def extract_pdf(filepath: str) -> dict:
    pages_text, tables = _extract_text_and_tables(filepath)
    images = _extract_images(filepath)

    doc = fitz.open(filepath)
    metadata = doc.metadata or {}
    doc.close()

    title = _detect_title(pages_text, metadata)
    full_text = "\n\n".join(p for p in pages_text if p)

    return {
        "title": title,
        "full_text": full_text,
        "tables": tables,
        "images": images,
        "total_pages": len(pages_text),
        "metadata": {
            "author": metadata.get("author", ""),
            "subject": metadata.get("subject", ""),
        },
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python read_pdf.py <caminho_do_pdf>", file=sys.stderr)
        sys.exit(1)

    filepath = sys.argv[1]
    result = extract_pdf(filepath)

    output = {
        "title": result["title"],
        "full_text": result["full_text"],
        "tables": result["tables"],
        "images": [img["base64"] for img in result["images"]],
        "total_pages": result["total_pages"],
        "metadata": result["metadata"],
    }

    print(json.dumps(output, ensure_ascii=False, indent=2))
