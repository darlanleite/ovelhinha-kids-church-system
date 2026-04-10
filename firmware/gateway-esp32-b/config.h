#pragma once

// ============================================================
// EDITE ESTE ARQUIVO antes de gravar o firmware
// As credenciais ficam aqui separadas do código principal
// ============================================================

// WiFi
#define WIFI_SSID         "D&D"
#define WIFI_PASSWORD     "27804028"

// Supabase
#define SUPABASE_URL      "https://reefzadzwbmhkojtjqhz.supabase.co"
#define SUPABASE_KEY      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlZWZ6YWR6d2JtaGtvanRqcWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMzUzNDksImV4cCI6MjA5MDgxMTM0OX0.RoAIEJoJT31EdmkjA_3LeyDdiw9f9uK0GuJd2OvfQ_E"
#define CHURCH_ID         "00000000-0000-0000-0000-000000000001"

// Identidade deste gateway
// UUID obtido após primeiro boot (Serial imprime) ou via SQL:
//   INSERT INTO gateways(church_id,name) VALUES('...','Gateway-02') RETURNING id;
#define GATEWAY_NAME      "Gateway-02"
#define GATEWAY_ID        "226e97a1-703f-4ba1-b2d7-043b8fc55e45"
