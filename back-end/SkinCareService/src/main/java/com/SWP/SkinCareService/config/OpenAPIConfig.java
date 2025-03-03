package com.SWP.SkinCareService.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

@Configuration
public class OpenAPIConfig {
    @Bean
    public OpenAPI customOpenAPI(@Value("${openapi.title}") String title,
                               @Value("${openapi.version}") String version,
                               @Value("${openapi.description}") String description,
                               @Value("${openapi.serverUrl}") String serverUrl,
                               @Value("${openapi.serverName}") String serverName) {

        // Create schema for file upload
        Schema<?> fileSchema = new Schema<>()
                .type("string")
                .format("binary");

        // Create schema for service request
        Schema<?> serviceRequestSchema = new Schema<>()
                .type("object")
                .properties(Map.of(
                        "name", new Schema<>().type("string"),
                        "serviceCategoryId", new Schema<>().type("integer"),
                        "price", new Schema<>().type("number"),
                        "duration", new Schema<>().type("integer"),
                        "session", new Schema<>().type("integer"),
                        "description", new Schema<>().type("string"),
                        "active", new Schema<>().type("boolean")
                ));

        return new OpenAPI()
                .info(new Info()
                        .title("Sparkle Spa API-service")
                        .version("v1.0.0")
                        .description(description)
                        .license(new License().name("Api License").url(serverUrl)))
                .servers(List.of(new Server().url(serverUrl).description(serverName)))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT"))
                        .addSchemas("FileUpload", fileSchema)
                        .addSchemas("ServiceRequest", serviceRequestSchema))
                .security(List.of(new SecurityRequirement().addList("bearerAuth")));
    }
}

