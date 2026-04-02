/*
 * Ovelhinha — Firmware da Pulseira (modo HTTP direto)
 * Hardware: ESP32-C3 Super Mini + LED RGB (cátodo comum)
 *
 * Modo de operação:
 *   O sistema web chama diretamente o ESP32 via HTTP na rede local.
 *   Não depende de gateway BLE — ideal para testes e implantação simples.
 *
 * Pinagem:
 *   LED R → GPIO3 (via resistor 220Ω)
 *   LED G → GPIO4 (via resistor 220Ω)
 *   LED B → GPIO5 (via resistor 220Ω)
 *
 * Configuração obrigatória antes de gravar:
 *   WIFI_SSID / WIFI_PASS → rede da igreja
 *
 * Endpoints HTTP:
 *   GET /on     → acende LED (vermelho por padrão)
 *   GET /off    → apaga LED
 *   GET /status → retorna JSON com estado atual
 *
 * CORS habilitado — aceita requisições de qualquer origem.
 */

#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>

// ─── Configuração ─────────────────────────────────────────────────────────────
#define WIFI_SSID  "NOME_DA_REDE"   // ← altere
#define WIFI_PASS  "SENHA_DA_REDE"  // ← altere

#define PIN_LED_R  3
#define PIN_LED_G  4
#define PIN_LED_B  5

// ─── Estado ───────────────────────────────────────────────────────────────────
WebServer server(80);
bool ledOn = false;

// ─── LED ──────────────────────────────────────────────────────────────────────
void setLED(uint8_t r, uint8_t g, uint8_t b) {
    analogWrite(PIN_LED_R, r);
    analogWrite(PIN_LED_G, g);
    analogWrite(PIN_LED_B, b);
}

// ─── CORS helper ──────────────────────────────────────────────────────────────
void addCorsHeaders() {
    server.sendHeader("Access-Control-Allow-Origin",  "*");
    server.sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

// ─── Handlers ─────────────────────────────────────────────────────────────────
void handleOn() {
    addCorsHeaders();
    ledOn = true;
    setLED(255, 0, 0); // vermelho
    server.send(200, "application/json", "{\"status\":\"on\"}");
    Serial.println("LED ON");
}

void handleOff() {
    addCorsHeaders();
    ledOn = false;
    setLED(0, 0, 0);
    server.send(200, "application/json", "{\"status\":\"off\"}");
    Serial.println("LED OFF");
}

void handleStatus() {
    addCorsHeaders();
    String json = "{\"led\":" + String(ledOn ? "true" : "false") +
                  ",\"ip\":\"" + WiFi.localIP().toString() + "\"}";
    server.send(200, "application/json", json);
}

// Responde preflight CORS (OPTIONS)
void handleOptions() {
    addCorsHeaders();
    server.send(204);
}

void handleNotFound() {
    addCorsHeaders();
    server.send(404, "application/json", "{\"error\":\"not found\"}");
}

// ─── Setup ────────────────────────────────────────────────────────────────────
void setup() {
    Serial.begin(115200);

    pinMode(PIN_LED_R, OUTPUT);
    pinMode(PIN_LED_G, OUTPUT);
    pinMode(PIN_LED_B, OUTPUT);
    setLED(0, 0, 0);

    // Conecta Wi-Fi
    Serial.print("Conectando Wi-Fi");
    WiFi.begin(WIFI_SSID, WIFI_PASS);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nIP: " + WiFi.localIP().toString());

    // Pisca azul 3x para indicar que conectou
    for (int i = 0; i < 3; i++) {
        setLED(0, 0, 255);
        delay(150);
        setLED(0, 0, 0);
        delay(150);
    }

    // Rotas
    server.on("/on",      HTTP_GET,     handleOn);
    server.on("/off",     HTTP_GET,     handleOff);
    server.on("/status",  HTTP_GET,     handleStatus);
    server.on("/on",      HTTP_OPTIONS, handleOptions);
    server.on("/off",     HTTP_OPTIONS, handleOptions);
    server.onNotFound(handleNotFound);

    server.begin();
    Serial.println("Servidor HTTP pronto");
}

// ─── Loop ─────────────────────────────────────────────────────────────────────
void loop() {
    server.handleClient();
}
