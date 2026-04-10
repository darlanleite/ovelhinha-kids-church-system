-- Adiciona rastreamento de entrega por gateway em gateway_commands
-- Permite identificar qual gateway entregou cada comando (log histórico)
-- e implementar claim atômico em ambientes multi-gateway.

ALTER TABLE gateway_commands
  ADD COLUMN IF NOT EXISTS gateway_id   UUID REFERENCES gateways(id),
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ;

-- Índice para facilitar consultas de auditoria por gateway
CREATE INDEX IF NOT EXISTS idx_gw_commands_gateway
  ON gateway_commands(gateway_id)
  WHERE gateway_id IS NOT NULL;
