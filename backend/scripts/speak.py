import asyncio
import sys
from pathlib import Path

import edge_tts


async def generate_audio(text: str, output_path: Path):
    voice = "pt-BR-FranciscaNeural"
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(str(output_path))


def main():
    if len(sys.argv) < 3:
        print("Informe o texto e o caminho do arquivo de saida.", file=sys.stderr)
        sys.exit(1)

    text = sys.argv[1].strip()
    output_path = Path(sys.argv[2])

    if not text:
        print("Texto para sintese de voz nao pode ser vazio.", file=sys.stderr)
        sys.exit(1)

    asyncio.run(generate_audio(text, output_path))


if __name__ == "__main__":
    main()
