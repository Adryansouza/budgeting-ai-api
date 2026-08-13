package com.projeto.budgeting;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@EnabledIfEnvironmentVariable(named = "OLLAMA_ENABLED", matches = "true")
class OllamaChatModelTest {

	@Autowired
	private ChatModel chatModel;

	@Test
	void verificarResposta() {
		String resposta = chatModel.call("Responda apenas com a palavra OK.");

		assertThat(resposta).isNotBlank();
	}

}
