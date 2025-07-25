package com.NullPointers.Atlas.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class AIService {
    private String apiUrl = "https://api.groq.com/openai/v1/chat/completions";
    @Value("${Groq_Api_Key}")
    private String apiKey;

    public String apiCall(String prompt) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.set("Content-Type", "application/json");
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        Map<String, Object> messages = Map.of("role", "user", "content", prompt);
        List<Map<String, Object>> messageList = List.of(messages);
        Map<String, Object> requestBody = Map.of("messages", messageList, "model", "deepseek-r1-distill-llama-70b", "max_completion_tokens", 131072);
        HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestBody, headers);
        try {
            ResponseEntity<Map> responseEntity = restTemplate.exchange(apiUrl, HttpMethod.POST, httpEntity, Map.class);
            //System.out.println(responseEntity);
            Map<String, Object> responseBody = responseEntity.getBody();
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            String body = (String) message.get("content");
            int start = body.indexOf("{");
            int end = body.lastIndexOf("}");
            System.out.println(body.substring(start, end+1));
            return body.substring(start, end+1);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "api call failed";
    }
}
