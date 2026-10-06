package com.projeto.budgeting.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AudioChatResult {

    private String transcription;
    private String message;
    private byte[] audio;

}
