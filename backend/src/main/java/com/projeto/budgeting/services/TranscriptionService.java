package com.projeto.budgeting.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class TranscriptionService {

    private final String transcriptionScript;
    private final String pythonExecutable;

    public TranscriptionService(
            @org.springframework.beans.factory.annotation.Value("${app.audio.python-executable:.venv/Scripts/python.exe}") String pythonExecutable,
            @org.springframework.beans.factory.annotation.Value("${app.audio.transcription-script:scripts/transcribe.py}") String transcriptionScript) {
        this.pythonExecutable = pythonExecutable;
        this.transcriptionScript = transcriptionScript;
    }

    public String transcribe(MultipartFile audioMessage) {
        if (audioMessage == null || audioMessage.isEmpty()) {
            throw new IllegalArgumentException("Nenhum audio foi enviado.");
        }

        Path temporaryAudioFile = null;

        try {
            temporaryAudioFile = saveTemporaryAudioFile(audioMessage);
            return transcribeAudio(temporaryAudioFile);
        } catch (IOException exception) {
            throw new IllegalStateException("Nao foi possivel processar o audio: " + exception.getMessage(), exception);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("A transcricao foi interrompida.", exception);
        } finally {
            deleteTemporaryAudioFile(temporaryAudioFile);
        }
    }

    private Path saveTemporaryAudioFile(MultipartFile audioMessage) throws IOException {
        String originalFileName = audioMessage.getOriginalFilename();
        String suffix = getFileSuffix(originalFileName);

        Path temporaryAudioFile = Files.createTempFile("audio-message-", suffix);
        audioMessage.transferTo(temporaryAudioFile);

        return temporaryAudioFile;
    }

    private String transcribeAudio(Path audioFile) throws IOException, InterruptedException {
        Path pythonExecutablePath = Path.of(pythonExecutable).toAbsolutePath();
        Path transcriptionScriptPath = Path.of(transcriptionScript).toAbsolutePath();

        if (!Files.exists(pythonExecutablePath)) {
            throw new IOException("Python nao encontrado em: " + pythonExecutablePath);
        }

        if (!Files.exists(transcriptionScriptPath)) {
            throw new IOException("Script de transcricao nao encontrado em: " + transcriptionScriptPath);
        }

        ProcessBuilder processBuilder = new ProcessBuilder(
                pythonExecutablePath.toString(),
                transcriptionScriptPath.toString(),
                audioFile.toAbsolutePath().toString());

        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();
        List<String> output = process.inputReader().lines().toList();
        int exitCode = process.waitFor();

        String transcription = String.join("\n", output).trim();

        if (exitCode != 0) {
            throw new IOException(transcription);
        }

        if (transcription.isBlank()) {
            return "Nao consegui identificar fala no audio enviado.";
        }

        return transcription;
    }

    private String getFileSuffix(String originalFileName) {
        if (originalFileName == null || !originalFileName.contains(".")) {
            return ".audio";
        }

        return originalFileName.substring(originalFileName.lastIndexOf("."));
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
