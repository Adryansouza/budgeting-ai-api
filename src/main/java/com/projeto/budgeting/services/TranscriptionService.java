package com.projeto.budgeting.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.projeto.budgeting.dto.AudioMessageResponse;
import com.projeto.budgeting.dto.ChatResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TranscriptionService {

    private static final String TRANSCRIPTION_SCRIPT = "scripts/transcribe.py";
    private static final String PYTHON_EXECUTABLE = ".venv/Scripts/python.exe";

    private final ChatService chatService;

    public AudioMessageResponse receiveAudio(MultipartFile audioMessage) {
        if (audioMessage == null || audioMessage.isEmpty()) {
            return new AudioMessageResponse(null, "Nenhum audio foi enviado.");
        }

        Path temporaryAudioFile = null;

        try {
            temporaryAudioFile = saveTemporaryAudioFile(audioMessage);
            String transcription = transcribeAudio(temporaryAudioFile);
            ChatResponse chatResponse = chatService.chamarChatClient(transcription);

            return new AudioMessageResponse(transcription, chatResponse.getMessage());
        } catch (IOException exception) {
            return new AudioMessageResponse(null, "Nao foi possivel processar o audio: " + exception.getMessage());
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            return new AudioMessageResponse(null, "A transcricao foi interrompida.");
        } catch (RuntimeException exception) {
            return new AudioMessageResponse(null, "Erro inesperado ao transcrever o audio: " + exception.getMessage());
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
        Path pythonExecutable = Path.of(PYTHON_EXECUTABLE).toAbsolutePath();
        Path transcriptionScript = Path.of(TRANSCRIPTION_SCRIPT).toAbsolutePath();

        if (!Files.exists(pythonExecutable)) {
            throw new IOException("Python nao encontrado em: " + pythonExecutable);
        }

        if (!Files.exists(transcriptionScript)) {
            throw new IOException("Script de transcricao nao encontrado em: " + transcriptionScript);
        }

        ProcessBuilder processBuilder = new ProcessBuilder(
                pythonExecutable.toString(),
                transcriptionScript.toString(),
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
