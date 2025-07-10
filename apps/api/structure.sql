--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: citext; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: kysely_migration; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kysely_migration (
    name character varying(255) NOT NULL,
    "timestamp" character varying(255) NOT NULL
);


--
-- Name: kysely_migration_lock; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kysely_migration_lock (
    id character varying(255) NOT NULL,
    is_locked integer DEFAULT 0 NOT NULL
);


--
-- Name: tenants_organizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenants_organizations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL
);


--
-- Name: tenants_programs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenants_programs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    organization_id uuid NOT NULL,
    name public.citext NOT NULL
);


--
-- Name: kysely_migration_lock kysely_migration_lock_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kysely_migration_lock
    ADD CONSTRAINT kysely_migration_lock_pkey PRIMARY KEY (id);


--
-- Name: kysely_migration kysely_migration_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kysely_migration
    ADD CONSTRAINT kysely_migration_pkey PRIMARY KEY (name);


--
-- Name: tenants_organizations tenants_organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants_organizations
    ADD CONSTRAINT tenants_organizations_pkey PRIMARY KEY (id);


--
-- Name: tenants_programs tenants_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants_programs
    ADD CONSTRAINT tenants_programs_pkey PRIMARY KEY (id);


--
-- Name: tenants_programs tenants_projects_uniq_name_org_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants_programs
    ADD CONSTRAINT tenants_projects_uniq_name_org_id UNIQUE (name, organization_id);


--
-- Name: tenants_programs tenants_programs_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants_programs
    ADD CONSTRAINT tenants_programs_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.tenants_organizations(id) ON DELETE CASCADE;


--
-- Name: tenants_organizations rls_tenants_organizations_mutate_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY rls_tenants_organizations_mutate_insert ON public.tenants_organizations FOR INSERT WITH CHECK (true);


--
-- Name: tenants_organizations rls_tenants_organizations_mutate_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY rls_tenants_organizations_mutate_update ON public.tenants_organizations FOR UPDATE WITH CHECK ((id = (current_setting('app.current_organization'::text, true))::uuid));


--
-- Name: tenants_organizations rls_tenants_organizations_read_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY rls_tenants_organizations_read_delete ON public.tenants_organizations FOR DELETE USING (false);


--
-- Name: tenants_organizations rls_tenants_organizations_read_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY rls_tenants_organizations_read_select ON public.tenants_organizations FOR SELECT USING ((id = (current_setting('app.current_organization'::text, true))::uuid));


--
-- Name: tenants_organizations rls_tenants_organizations_read_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY rls_tenants_organizations_read_update ON public.tenants_organizations FOR UPDATE USING ((id = (current_setting('app.current_organization'::text, true))::uuid));


--
-- Name: tenants_programs rls_tenants_programs_mutate_insert; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY rls_tenants_programs_mutate_insert ON public.tenants_programs FOR INSERT WITH CHECK ((organization_id = (current_setting('app.current_organization'::text, true))::uuid));


--
-- Name: tenants_programs rls_tenants_programs_mutate_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY rls_tenants_programs_mutate_update ON public.tenants_programs FOR UPDATE WITH CHECK ((organization_id = (current_setting('app.current_organization'::text, true))::uuid));


--
-- Name: tenants_programs rls_tenants_programs_read_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY rls_tenants_programs_read_delete ON public.tenants_programs FOR DELETE USING (false);


--
-- Name: tenants_programs rls_tenants_programs_read_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY rls_tenants_programs_read_select ON public.tenants_programs FOR SELECT USING ((organization_id = (current_setting('app.current_organization'::text, true))::uuid));


--
-- Name: tenants_programs rls_tenants_programs_read_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY rls_tenants_programs_read_update ON public.tenants_programs FOR UPDATE USING ((organization_id = (current_setting('app.current_organization'::text, true))::uuid));


--
-- Name: tenants_organizations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tenants_organizations ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

