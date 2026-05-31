GRANT EXECUTE ON FUNCTION public.has_trainer_client_link(uuid, uuid) TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.is_trainer(uuid) TO authenticated, anon, service_role;