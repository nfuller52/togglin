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


--
-- Name: auth_refresh_token_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.auth_refresh_token_status AS ENUM (
    'rotation',
    'logout',
    'compromise'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    email public.citext NOT NULL,
    auth_user_id uuid NOT NULL
);


--
-- Name: auth_oauth_refresh_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_oauth_refresh_tokens (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT now() NOT NULL,
    short_id character varying(21) NOT NULL,
    auth_user_id uuid NOT NULL,
    revoked_at timestamp with time zone,
    revoked_reason public.auth_refresh_token_status,
    replaced_by_token_id uuid
);


--
-- Name: auth_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auth_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    email public.citext NOT NULL,
    password_hash text NOT NULL
);


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
-- Name: tenants_organization_memberships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenants_organization_memberships (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    organization_id uuid NOT NULL
);


--
-- Name: tenants_organizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenants_organizations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    created_by_id uuid NOT NULL
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
-- Name: accounts_users accounts_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_users
    ADD CONSTRAINT accounts_users_pkey PRIMARY KEY (id);


--
-- Name: auth_oauth_refresh_tokens auth_oauth_refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_oauth_refresh_tokens
    ADD CONSTRAINT auth_oauth_refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: auth_oauth_refresh_tokens auth_oauth_refresh_tokens_short_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_oauth_refresh_tokens
    ADD CONSTRAINT auth_oauth_refresh_tokens_short_id_key UNIQUE (short_id);


--
-- Name: auth_users auth_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_users
    ADD CONSTRAINT auth_users_pkey PRIMARY KEY (id);


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
-- Name: tenants_organization_memberships tenants_organization_memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants_organization_memberships
    ADD CONSTRAINT tenants_organization_memberships_pkey PRIMARY KEY (id);


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
-- Name: accounts_users_auth_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX accounts_users_auth_user_id ON public.accounts_users USING btree (auth_user_id);


--
-- Name: accounts_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX accounts_users_email ON public.accounts_users USING btree (email);


--
-- Name: auth_oauth_refresh_tokens_auth_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX auth_oauth_refresh_tokens_auth_user_id ON public.auth_oauth_refresh_tokens USING btree (auth_user_id);


--
-- Name: auth_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX auth_users_email ON public.auth_users USING btree (email);


--
-- Name: tenants_organization_memberships_uniq_membership; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX tenants_organization_memberships_uniq_membership ON public.tenants_organization_memberships USING btree (user_id, organization_id);


--
-- Name: tenants_organizations_created_by_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tenants_organizations_created_by_id ON public.tenants_organizations USING btree (created_by_id);


--
-- Name: tenants_programs_organization_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX tenants_programs_organization_id ON public.tenants_programs USING btree (organization_id);


--
-- Name: accounts_users accounts_users_auth_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts_users
    ADD CONSTRAINT accounts_users_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES public.auth_users(id) ON DELETE CASCADE;


--
-- Name: auth_oauth_refresh_tokens auth_oauth_refresh_tokens_auth_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_oauth_refresh_tokens
    ADD CONSTRAINT auth_oauth_refresh_tokens_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES public.auth_users(id) ON DELETE CASCADE;


--
-- Name: auth_oauth_refresh_tokens auth_oauth_refresh_tokens_replaced_by_token_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auth_oauth_refresh_tokens
    ADD CONSTRAINT auth_oauth_refresh_tokens_replaced_by_token_id_fkey FOREIGN KEY (replaced_by_token_id) REFERENCES public.auth_oauth_refresh_tokens(id) ON DELETE CASCADE;


--
-- Name: tenants_organization_memberships tenants_organization_memberships_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants_organization_memberships
    ADD CONSTRAINT tenants_organization_memberships_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.tenants_organizations(id) ON DELETE RESTRICT;


--
-- Name: tenants_organization_memberships tenants_organization_memberships_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants_organization_memberships
    ADD CONSTRAINT tenants_organization_memberships_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.accounts_users(id) ON DELETE CASCADE;


--
-- Name: tenants_organizations tenants_organizations_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants_organizations
    ADD CONSTRAINT tenants_organizations_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.accounts_users(id) ON DELETE RESTRICT;


--
-- Name: tenants_programs tenants_programs_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants_programs
    ADD CONSTRAINT tenants_programs_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.tenants_organizations(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

