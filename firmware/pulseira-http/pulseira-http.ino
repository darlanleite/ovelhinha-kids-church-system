#include <WiFi.h>
#include <WebServer.h>
#include <ESPmDNS.h>

const char* ssid     = "D&D";
const char* password = "27804028";

// Nome mDNS — acessível como http://ovelhinha-01.local
// Mude o número para cada pulseira: ovelhinha-02, ovelhinha-03...
#define MDNS_NAME "ovelhinha-01"

#define LED_PIN 8

WebServer server(80);
bool ledOn = false;

void addCors() {
  server.sendHeader("Access-Control-Allow-Origin",  "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

void handleOn() {
  addCors();
  ledOn = true;
  digitalWrite(LED_PIN, LOW);
  server.send(200, "application/json", "{\"status\":\"on\"}");
  Serial.println("LED ON");
}

void handleOff() {
  addCors();
  ledOn = false;
  digitalWrite(LED_PIN, HIGH);
  server.send(200, "application/json", "{\"status\":\"off\"}");
  Serial.println("LED OFF");
}

void handleOptions() {
  addCors();
  server.send(204);
}

void setup() {
  Serial.begin(115200);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);

  Serial.print("Conectando Wi-Fi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nIP: " + WiFi.localIP().toString());

  if (MDNS.begin(MDNS_NAME)) {
    Serial.println("mDNS: http://" + String(MDNS_NAME) + ".local");
  }

  server.on("/on",  HTTP_GET,     handleOn);
  server.on("/off", HTTP_GET,     handleOff);
  server.on("/on",  HTTP_OPTIONS, handleOptions);
  server.on("/off", HTTP_OPTIONS, handleOptions);

  server.begin();
  Serial.println("Servidor HTTP pronto");
}

void loop() {
  server.handleClient();
  MDNS.update();
}
