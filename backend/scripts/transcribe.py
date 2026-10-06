import sys
from pathlib import Path

from faster_whisper import WhisperModel


def main():
    if len(sys.argv) < 2:
        print("Informe o caminho do arquivo de audio.", file=sys.stderr)
        sys.exit(1)

    audio_path = Path(sys.argv[1])
    if not audio_path.exists():
        print(f"Arquivo de audio nao encontrado: {audio_path}", file=sys.stderr)
        sys.exit(1)

    model_name = "small"
    model = WhisperModel(model_name, device="cpu", compute_type="int8")
    segments, _ = model.transcribe(str(audio_path), language="pt")

    text = " ".join(segment.text.strip() for segment in segments).strip()
    print(text)


if __name__ == "__main__":
    main()
