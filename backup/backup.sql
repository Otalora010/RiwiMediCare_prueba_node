--
-- PostgreSQL database dump
--

\restrict OXoIjXvDebEF7LF1zCutQZzScd63xdsTQGQIW79DiaxjmyzqC7HWMOaExIUszbl

-- Dumped from database version 15.18
-- Dumped by pg_dump version 15.18

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_almacenes_estado; Type: TYPE; Schema: public; Owner: nodejs
--

CREATE TYPE public.enum_almacenes_estado AS ENUM (
    'ACTIVO',
    'ELIMINADO'
);


ALTER TYPE public.enum_almacenes_estado OWNER TO nodejs;

--
-- Name: enum_clinicas_estado; Type: TYPE; Schema: public; Owner: nodejs
--

CREATE TYPE public.enum_clinicas_estado AS ENUM (
    'ACTIVA',
    'ELIMINADA'
);


ALTER TYPE public.enum_clinicas_estado OWNER TO nodejs;

--
-- Name: enum_medicamentos_estado; Type: TYPE; Schema: public; Owner: nodejs
--

CREATE TYPE public.enum_medicamentos_estado AS ENUM (
    'ACTIVO',
    'ELIMINADO'
);


ALTER TYPE public.enum_medicamentos_estado OWNER TO nodejs;

--
-- Name: enum_resources_status; Type: TYPE; Schema: public; Owner: nodejs
--

CREATE TYPE public.enum_resources_status AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public.enum_resources_status OWNER TO nodejs;

--
-- Name: enum_solicitudes_estado; Type: TYPE; Schema: public; Owner: nodejs
--

CREATE TYPE public.enum_solicitudes_estado AS ENUM (
    'PENDIENTE',
    'APROBADA',
    'RECHAZADA',
    'DESPACHADA',
    'CANCELADA',
    'ELIMINADA'
);


ALTER TYPE public.enum_solicitudes_estado OWNER TO nodejs;

--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: nodejs
--

CREATE TYPE public.enum_users_role AS ENUM (
    'ADMIN',
    'GESTOR'
);


ALTER TYPE public.enum_users_role OWNER TO nodejs;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: almacenes; Type: TABLE; Schema: public; Owner: nodejs
--

CREATE TABLE public.almacenes (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    location character varying(150) NOT NULL,
    estado public.enum_almacenes_estado DEFAULT 'ACTIVO'::public.enum_almacenes_estado NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.almacenes OWNER TO nodejs;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: nodejs
--

CREATE TABLE public.categories (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.categories OWNER TO nodejs;

--
-- Name: clinicas; Type: TABLE; Schema: public; Owner: nodejs
--

CREATE TABLE public.clinicas (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    nit character varying(50) NOT NULL,
    responsable character varying(100) NOT NULL,
    estado public.enum_clinicas_estado DEFAULT 'ACTIVA'::public.enum_clinicas_estado NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.clinicas OWNER TO nodejs;

--
-- Name: medicamentos; Type: TABLE; Schema: public; Owner: nodejs
--

CREATE TABLE public.medicamentos (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    stock integer NOT NULL,
    almacen_id uuid NOT NULL,
    estado public.enum_medicamentos_estado DEFAULT 'ACTIVO'::public.enum_medicamentos_estado NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.medicamentos OWNER TO nodejs;

--
-- Name: resources; Type: TABLE; Schema: public; Owner: nodejs
--

CREATE TABLE public.resources (
    id uuid NOT NULL,
    title character varying(150) NOT NULL,
    description text,
    price numeric(12,2) NOT NULL,
    status public.enum_resources_status DEFAULT 'ACTIVE'::public.enum_resources_status NOT NULL,
    category_id uuid NOT NULL,
    owner_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.resources OWNER TO nodejs;

--
-- Name: solicitudes; Type: TABLE; Schema: public; Owner: nodejs
--

CREATE TABLE public.solicitudes (
    id uuid NOT NULL,
    clinica_id uuid NOT NULL,
    medicamento_id uuid NOT NULL,
    almacen_id uuid NOT NULL,
    cantidad_solicitada integer NOT NULL,
    estado public.enum_solicitudes_estado DEFAULT 'PENDIENTE'::public.enum_solicitudes_estado NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.solicitudes OWNER TO nodejs;

--
-- Name: users; Type: TABLE; Schema: public; Owner: nodejs
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    role public.enum_users_role DEFAULT 'GESTOR'::public.enum_users_role NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.users OWNER TO nodejs;

--
-- Data for Name: almacenes; Type: TABLE DATA; Schema: public; Owner: nodejs
--

COPY public.almacenes (id, name, location, estado, created_at, updated_at) FROM stdin;
9aae1f18-0c3b-4081-91bd-71559a247a48	Almacén Central	Bogotá - Sede Norte	ACTIVO	2026-08-31 15:49:12.716+00	2026-08-31 15:49:12.716+00
20f4f40e-d507-4b92-bf84-2306a68e3011	Almacén Sur	Cali	ACTIVO	2026-08-31 15:49:12.725+00	2026-08-31 15:49:12.725+00
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: nodejs
--

COPY public.categories (id, name, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: clinicas; Type: TABLE DATA; Schema: public; Owner: nodejs
--

COPY public.clinicas (id, name, nit, responsable, estado, created_at, updated_at) FROM stdin;
42504e1e-9fa1-4744-9d7a-07b27e538439	Clínica Norte	900123456-1	Dra. Laura Gómez	ACTIVA	2026-08-31 15:49:12.71+00	2026-08-31 15:49:12.71+00
f34ae022-cafd-4f39-bb2c-5486a4a1afee	Centro Sur	900123456-2	Dr. Carlos Ruiz	ACTIVA	2026-08-31 15:49:12.713+00	2026-08-31 15:49:12.713+00
\.


--
-- Data for Name: medicamentos; Type: TABLE DATA; Schema: public; Owner: nodejs
--

COPY public.medicamentos (id, name, stock, almacen_id, estado, created_at, updated_at) FROM stdin;
dd26823f-2246-4910-9a33-37c6a11e2400	Acetaminofén 500mg	200	9aae1f18-0c3b-4081-91bd-71559a247a48	ACTIVO	2026-08-31 15:49:12.719+00	2026-08-31 15:49:12.719+00
fe9ef09f-ad28-4501-9504-1847dc538332	Ibuprofeno 400mg	150	9aae1f18-0c3b-4081-91bd-71559a247a48	ACTIVO	2026-08-31 15:49:12.722+00	2026-08-31 15:49:12.722+00
426e5f0a-385b-436a-90ff-f4f3e20d205b	Amoxicilina 500mg	100	20f4f40e-d507-4b92-bf84-2306a68e3011	ACTIVO	2026-08-31 15:49:12.726+00	2026-08-31 15:49:12.726+00
\.


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: nodejs
--

COPY public.resources (id, title, description, price, status, category_id, owner_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: solicitudes; Type: TABLE DATA; Schema: public; Owner: nodejs
--

COPY public.solicitudes (id, clinica_id, medicamento_id, almacen_id, cantidad_solicitada, estado, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: nodejs
--

COPY public.users (id, name, email, password, role, is_active, created_at, updated_at) FROM stdin;
f81c631f-48e1-4103-bb6c-fd05548d8588	santiago_otalora	otalorasantiago00@gmail.com	$2b$10$vCkPeXSzDkZXWaxENred0u3LssFdP4b6dJgncE2LXxF8.W5KCCofi	GESTOR	t	2026-08-31 15:39:19.365+00	2026-08-31 15:39:19.365+00
8310fac7-fdea-48d9-b9c3-0370e4d6dc5a	santiago_otalora	santiagootalora19@gmail.com	$2b$10$YPUbgY/YiYZ4DLa5VrHbXum.lBYHtylvNLJ2nEgxeTjN9cu2CkdoG	ADMIN	t	2026-08-31 15:45:31.406+00	2026-08-31 15:45:31.406+00
6dc89e6b-9814-4bd6-b5ff-501eb724e7fb	Admin Demo	admin.demo@example.com	$2b$10$u/PwbbncAWPUpeArp.k9y.3pWmF1Cnj.6gQw691.j5CKqU7lD8Qwy	ADMIN	t	2026-08-31 15:49:12.64+00	2026-08-31 15:49:12.64+00
6c921a6e-6a4e-4bcc-bdb9-69315d6d8f1c	Gestor Demo	gestor@example.com	$2b$10$oakd2aov7xxtreSROBPtFO1uu5PtlVJvyE4R93.fBaTBHmjTH3N12	GESTOR	t	2026-08-31 15:49:12.707+00	2026-08-31 15:49:12.707+00
\.


--
-- Name: almacenes almacenes_pkey; Type: CONSTRAINT; Schema: public; Owner: nodejs
--

ALTER TABLE ONLY public.almacenes
    ADD CONSTRAINT almacenes_pkey PRIMARY KEY (id);


--
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: nodejs
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: nodejs
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: clinicas clinicas_nit_key; Type: CONSTRAINT; Schema: public; Owner: nodejs
--

ALTER TABLE ONLY public.clinicas
    ADD CONSTRAINT clinicas_nit_key UNIQUE (nit);


--
-- Name: clinicas clinicas_pkey; Type: CONSTRAINT; Schema: public; Owner: nodejs
--

ALTER TABLE ONLY public.clinicas
    ADD CONSTRAINT clinicas_pkey PRIMARY KEY (id);


--
-- Name: medicamentos medicamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: nodejs
--

ALTER TABLE ONLY public.medicamentos
    ADD CONSTRAINT medicamentos_pkey PRIMARY KEY (id);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: nodejs
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: solicitudes solicitudes_pkey; Type: CONSTRAINT; Schema: public; Owner: nodejs
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: nodejs
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: nodejs
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: almacenes_estado; Type: INDEX; Schema: public; Owner: nodejs
--

CREATE INDEX almacenes_estado ON public.almacenes USING btree (estado);


--
-- Name: clinicas_estado; Type: INDEX; Schema: public; Owner: nodejs
--

CREATE INDEX clinicas_estado ON public.clinicas USING btree (estado);


--
-- Name: clinicas_nit; Type: INDEX; Schema: public; Owner: nodejs
--

CREATE UNIQUE INDEX clinicas_nit ON public.clinicas USING btree (nit);


--
-- Name: medicamentos_almacen_id; Type: INDEX; Schema: public; Owner: nodejs
--

CREATE INDEX medicamentos_almacen_id ON public.medicamentos USING btree (almacen_id);


--
-- Name: medicamentos_estado; Type: INDEX; Schema: public; Owner: nodejs
--

CREATE INDEX medicamentos_estado ON public.medicamentos USING btree (estado);


--
-- Name: resources_category_id; Type: INDEX; Schema: public; Owner: nodejs
--

CREATE INDEX resources_category_id ON public.resources USING btree (category_id);


--
-- Name: resources_owner_id; Type: INDEX; Schema: public; Owner: nodejs
--

CREATE INDEX resources_owner_id ON public.resources USING btree (owner_id);


--
-- Name: resources_status; Type: INDEX; Schema: public; Owner: nodejs
--

CREATE INDEX resources_status ON public.resources USING btree (status);


--
-- Name: solicitudes_almacen_id; Type: INDEX; Schema: public; Owner: nodejs
--

CREATE INDEX solicitudes_almacen_id ON public.solicitudes USING btree (almacen_id);


--
-- Name: solicitudes_clinica_id; Type: INDEX; Schema: public; Owner: nodejs
--

CREATE INDEX solicitudes_clinica_id ON public.solicitudes USING btree (clinica_id);


--
-- Name: solicitudes_estado; Type: INDEX; Schema: public; Owner: nodejs
--

CREATE INDEX solicitudes_estado ON public.solicitudes USING btree (estado);


--
-- Name: solicitudes_medicamento_id; Type: INDEX; Schema: public; Owner: nodejs
--

CREATE INDEX solicitudes_medicamento_id ON public.solicitudes USING btree (medicamento_id);


--
-- Name: solicitudes_user_id; Type: INDEX; Schema: public; Owner: nodejs
--

CREATE INDEX solicitudes_user_id ON public.solicitudes USING btree (user_id);


--
-- Name: medicamentos medicamentos_almacen_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nodejs
--

ALTER TABLE ONLY public.medicamentos
    ADD CONSTRAINT medicamentos_almacen_id_fkey FOREIGN KEY (almacen_id) REFERENCES public.almacenes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: resources resources_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nodejs
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: resources resources_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nodejs
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: solicitudes solicitudes_almacen_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nodejs
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_almacen_id_fkey FOREIGN KEY (almacen_id) REFERENCES public.almacenes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: solicitudes solicitudes_clinica_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nodejs
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_clinica_id_fkey FOREIGN KEY (clinica_id) REFERENCES public.clinicas(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: solicitudes solicitudes_medicamento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nodejs
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_medicamento_id_fkey FOREIGN KEY (medicamento_id) REFERENCES public.medicamentos(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: solicitudes solicitudes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: nodejs
--

ALTER TABLE ONLY public.solicitudes
    ADD CONSTRAINT solicitudes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict OXoIjXvDebEF7LF1zCutQZzScd63xdsTQGQIW79DiaxjmyzqC7HWMOaExIUszbl

