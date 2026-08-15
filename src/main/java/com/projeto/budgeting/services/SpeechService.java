package com.projeto.budgeting.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class SpeechService {

    private final String speechScript;
    private final String pythonExecutable;

    public SpeechService(
            @org.springframework.beans.factory.annotation.Value("${app.audio.python-executable:.venv/Scripts/python.exe}") String pythonExecutable,
            @org.springframework.beans.factory.annotation.Value("${app.audio.speech-script:scripts/speak.py}") String speechScript) {
        this.pythonExecutable = pythonExecutable;
        this.speechScript = speechScript;
    }

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
        Path pythonExecutablePath = Path.of(pythonExecutable).toAbsolutePath();
        Path speechScriptPath = Path.of(speechScript).toAbsolutePath();

        if (!Files.exists(pythonExecutablePath)) {
            throw new IOException("Python nao encontrado em: " + pythonExecutablePath);
        }

        if (!Files.exists(speechScriptPath)) {
            throw new IOException("Script de sintese de voz nao encontrado em: " + speechScriptPath);
        }

        ProcessBuilder processBuilder = new ProcessBuilder(
                pythonExecutablePath.toString(),
                speechScriptPath.toString(),
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
