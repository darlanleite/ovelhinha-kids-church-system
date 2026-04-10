-- Evita duplicatas de gateway com mesmo nome na mesma igreja
-- (bug que ocorreu durante setup: gateway reiniciava com GATEWAY_ID vazio e criava linha duplicada)
ALTER TABLE gateways ADD CONSTRAINT gateways_church_name_unique UNIQUE (church_id, name);
