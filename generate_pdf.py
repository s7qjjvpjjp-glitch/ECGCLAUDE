#!/usr/bin/env python3
"""
Converte JSON estruturado (gerado pelo Claude no chat) em PDF visualmente rico.
Uso:
  echo '<json>' | python generate_pdf.py
  python generate_pdf.py --input dados.json --output outputs/resumo.pdf
  python generate_pdf.py --input dados.json --html   # gera HTML (para debug)
"""
import sys
import json
import re
import argparse
import os
from datetime import datetime
from pathlib import Path

from jinja2 import Environment, FileSystemLoader


def _slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '_', text)
    return text[:60].strip('_')


def _render_html(data: dict, source_type: str = "", source_name: str = "") -> str:
    templates_dir = Path(__file__).parent / "templates"
    env = Environment(loader=FileSystemLoader(str(templates_dir)))
    template = env.get_template("summary_base.html")

    images = data.get("images", [])
    if images and isinstance(images[0], dict):
        images = [img.get("base64", "") for img in images]

    context = {
        "title": data.get("title", "Resumo"),
        "sections": data.get("sections", []),
        "key_concepts": data.get("key_concepts", []),
        "images": images,
        "source_type": source_type,
        "source_name": source_name,
        "generated_at": datetime.now().strftime("%d/%m/%Y %H:%M"),
    }
    return template.render(**context)


def generate_pdf(data: dict, output_path: str, source_type: str = "", source_name: str = "") -> str:
    from weasyprint import HTML, CSS

    html_content = _render_html(data, source_type, source_name)

    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    HTML(string=html_content, base_url=str(Path(__file__).parent)).write_pdf(output_path)
    return output_path


def generate_html(data: dict, output_path: str, source_type: str = "", source_name: str = "") -> str:
    html_content = _render_html(data, source_type, source_name)
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    Path(output_path).write_text(html_content, encoding="utf-8")
    return output_path


def main():
    parser = argparse.ArgumentParser(description="Gera PDF de resumo a partir de JSON estruturado")
    parser.add_argument("--input", "-i", help="Arquivo JSON de entrada (default: stdin)")
    parser.add_argument("--output", "-o", help="Caminho do PDF de saída")
    parser.add_argument("--html", action="store_true", help="Gerar HTML em vez de PDF (útil para debug)")
    parser.add_argument("--source-type", default="", help="pdf ou url")
    parser.add_argument("--source-name", default="", help="Nome do arquivo ou URL de origem")
    args = parser.parse_args()

    if args.input:
        with open(args.input, encoding="utf-8") as f:
            data = json.load(f)
    else:
        raw = sys.stdin.read().strip()
        data = json.loads(raw)

    title_slug = _slugify(data.get("title", "resumo"))
    outputs_dir = Path(__file__).parent / "outputs"
    outputs_dir.mkdir(exist_ok=True)

    if args.html:
        output_path = args.output or str(outputs_dir / f"resumo_{title_slug}.html")
        result = generate_html(data, output_path, args.source_type, args.source_name)
        print(f"HTML gerado: {result}")
    else:
        output_path = args.output or str(outputs_dir / f"resumo_{title_slug}.pdf")
        result = generate_pdf(data, output_path, args.source_type, args.source_name)
        print(f"PDF gerado: {result}")


if __name__ == "__main__":
    main()
