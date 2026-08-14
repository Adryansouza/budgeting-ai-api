package com.projeto.budgeting.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class SpeechService {

    private static final String SPEECH_SCRIPT = "scripts/speak.py";
    private static final String PYTHON_EXECUTABLE = ".venv/Scripts/python.exe";

    public byte[] generateAudio(String text) {
        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException("Texto para sintese de voz nao pode ser vazio.");
        }

        Path temporaryAudioFile = null;

        try {
            temporaryAudioFile = Files.createTempFile("speech-response-", ".mp3");
            runSpeechScript(text, temporaryAudioFile);

            return Files.readAllBytes(temporaryAudioFile);
        } catch (IOException exception) {
            throw new IllegalStateException("Nao foi possivel gerar o audio: " + exception.getMessage(), exception);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("A sintese de voz foi interrompida.", exception);
        } finally {
            deleteTemporaryAudioFile(temporaryAudioFile);
        }
    }

    private void runSpeechScript(String text, Path outputAudioFile) throws IOException, InterruptedException {
        Path pythonExecutable = Path.of(PYTHON_EXECUTABLE).toAbsolutePath();
        Path speechScript = Path.of(SPEECH_SCRIPT).toAbsolutePath();

        if (!Files.exists(pythonExecutable)) {
            throw new IOException("Python nao encontrado em: " + pythonExecutable);
        }

        if (!Files.exists(speechScript)) {
            throw new IOException("Script de sintese de voz nao encontrado em: " + speechScript);
        }

        ProcessBuilder processBuilder = new ProcessBuilder(
                pythonExecutable.toString(),
                speechScript.toString(),
                text,
                outputAudioFile.toAbsolutePath().toString());

        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();
        List<String> output = process.inputReader().lines().toList();
        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new IOException(String.join("\n", output).trim());
        }
    }

    private void deleteTemporaryAudioFile(Path temporaryAudioFile) {
        if (temporaryAudioFile == null) {
            return;
        }

        try {
            Files.deleteIfExists(temporaryAudioFile);
        } catch (IOException ignored) {
        }
    }

}
