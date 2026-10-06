package com.projeto.budgeting.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SpeechRequest {

    @NotBlank(message = "O texto nao pode ser vazio.")
    private String text;

}
