PGDMP     	                     {         
   safeparkdb    14.5    14.5 M    h           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            i           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            j           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            k           1262    55665 
   safeparkdb    DATABASE     j   CREATE DATABASE safeparkdb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Portuguese_Brazil.1252';
    DROP DATABASE safeparkdb;
                postgres    false            ?            1259    55666    billing    TABLE     l  CREATE TABLE public.billing (
    id integer NOT NULL,
    totalprice numeric(12,2),
    amount numeric(12,2),
    change numeric(12,2),
    method character varying(24),
    status character varying(1),
    validity timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.billing;
       public         heap    postgres    false            ?            1259    55671    billing_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.billing_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.billing_id_seq;
       public          postgres    false    209            l           0    0    billing_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.billing_id_seq OWNED BY public.billing.id;
          public          postgres    false    210            ?            1259    55672 
   categories    TABLE     .  CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(32),
    description character varying(82),
    priority integer,
    status character varying(1),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.categories;
       public         heap    postgres    false            ?            1259    55677    categories_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.categories_id_seq;
       public          postgres    false    211            m           0    0    categories_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;
          public          postgres    false    212            ?            1259    55678 	   companies    TABLE     m  CREATE TABLE public.companies (
    id integer NOT NULL,
    fullname character varying(82),
    cnpj character varying(14),
    email character varying(82),
    phone character varying(11),
    idbilling integer,
    status character varying(1),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.companies;
       public         heap    postgres    false            ?            1259    55683    companies_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.companies_id_seq;
       public          postgres    false    213            n           0    0    companies_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;
          public          postgres    false    214            ?            1259    55684 	   customers    TABLE     b  CREATE TABLE public.customers (
    id integer NOT NULL,
    fullname character varying(82),
    cpf character varying(11),
    phone character varying(11),
    idcompany integer,
    idbilling integer,
    status character varying(1),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.customers;
       public         heap    postgres    false            ?            1259    55689    customers_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.customers_id_seq;
       public          postgres    false    215            o           0    0    customers_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;
          public          postgres    false    216            ?            1259    55690    logs    TABLE     _  CREATE TABLE public.logs (
    id integer NOT NULL,
    action character varying(42),
    target character varying(42),
    description character varying(255),
    idtarget integer,
    iduser integer,
    ip character varying(128),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.logs;
       public         heap    postgres    false            ?            1259    55695    logs_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.logs_id_seq;
       public          postgres    false    217            p           0    0    logs_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.logs_id_seq OWNED BY public.logs.id;
          public          postgres    false    218            ?            1259    55696 	   movements    TABLE     ?  CREATE TABLE public.movements (
    id integer NOT NULL,
    idbilling integer,
    idparking integer,
    idvehicle integer,
    idcustomer integer,
    idcompany integer,
    entrydate date,
    entrytime time without time zone,
    exitdate date,
    exittime time without time zone,
    iduser integer,
    idvalet integer,
    status character varying(1),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.movements;
       public         heap    postgres    false            ?            1259    55701    movements_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.movements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.movements_id_seq;
       public          postgres    false    219            q           0    0    movements_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.movements_id_seq OWNED BY public.movements.id;
          public          postgres    false    220            ?            1259    55702    parkingspots    TABLE     ?   CREATE TABLE public.parkingspots (
    id integer NOT NULL,
    number integer,
    idsector integer,
    status character varying(1),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
     DROP TABLE public.parkingspots;
       public         heap    postgres    false            ?            1259    55707    parkingspots_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.parkingspots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.parkingspots_id_seq;
       public          postgres    false    221            r           0    0    parkingspots_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.parkingspots_id_seq OWNED BY public.parkingspots.id;
          public          postgres    false    222            ?            1259    55708    sectors    TABLE       CREATE TABLE public.sectors (
    id integer NOT NULL,
    name character varying(1),
    idcategory integer,
    status character varying(1),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.sectors;
       public         heap    postgres    false            ?            1259    55713    sectors_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.sectors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.sectors_id_seq;
       public          postgres    false    223            s           0    0    sectors_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.sectors_id_seq OWNED BY public.sectors.id;
          public          postgres    false    224            ?            1259    55714    staff_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.staff_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.staff_id_seq;
       public          postgres    false            ?            1259    55715    staff    TABLE     `  CREATE TABLE public.staff (
    id integer DEFAULT nextval('public.staff_id_seq'::regclass) NOT NULL,
    fullname character varying(82),
    cpf character varying(11),
    role character varying(32),
    status character varying(1),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.staff;
       public         heap    postgres    false    225            ?            1259    55721    users_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false            ?            1259    55722    users    TABLE     o  CREATE TABLE public.users (
    id integer DEFAULT nextval('public.users_id_seq'::regclass) NOT NULL,
    email character varying(82),
    password character varying(255),
    permlevel integer,
    idstaff integer,
    status character varying(1),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.users;
       public         heap    postgres    false    227            ?            1259    55728    vehicles    TABLE     j  CREATE TABLE public.vehicles (
    id integer NOT NULL,
    plate character varying(7),
    model character varying(128),
    color character varying(18),
    type character varying(18),
    idcustomer integer,
    status character varying(1),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.vehicles;
       public         heap    postgres    false            ?            1259    55733    vehicles_id_seq    SEQUENCE     ?   CREATE SEQUENCE public.vehicles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.vehicles_id_seq;
       public          postgres    false    229            t           0    0    vehicles_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.vehicles_id_seq OWNED BY public.vehicles.id;
          public          postgres    false    230            ?           2604    55734 
   billing id    DEFAULT     h   ALTER TABLE ONLY public.billing ALTER COLUMN id SET DEFAULT nextval('public.billing_id_seq'::regclass);
 9   ALTER TABLE public.billing ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    210    209            ?           2604    55735    categories id    DEFAULT     n   ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);
 <   ALTER TABLE public.categories ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    212    211            ?           2604    55736    companies id    DEFAULT     l   ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);
 ;   ALTER TABLE public.companies ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    214    213            ?           2604    55737    customers id    DEFAULT     l   ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);
 ;   ALTER TABLE public.customers ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215            ?           2604    55738    logs id    DEFAULT     b   ALTER TABLE ONLY public.logs ALTER COLUMN id SET DEFAULT nextval('public.logs_id_seq'::regclass);
 6   ALTER TABLE public.logs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217            ?           2604    55739    movements id    DEFAULT     l   ALTER TABLE ONLY public.movements ALTER COLUMN id SET DEFAULT nextval('public.movements_id_seq'::regclass);
 ;   ALTER TABLE public.movements ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    219            ?           2604    55740    parkingspots id    DEFAULT     r   ALTER TABLE ONLY public.parkingspots ALTER COLUMN id SET DEFAULT nextval('public.parkingspots_id_seq'::regclass);
 >   ALTER TABLE public.parkingspots ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    221            ?           2604    55741 
   sectors id    DEFAULT     h   ALTER TABLE ONLY public.sectors ALTER COLUMN id SET DEFAULT nextval('public.sectors_id_seq'::regclass);
 9   ALTER TABLE public.sectors ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    223            ?           2604    55742    vehicles id    DEFAULT     j   ALTER TABLE ONLY public.vehicles ALTER COLUMN id SET DEFAULT nextval('public.vehicles_id_seq'::regclass);
 :   ALTER TABLE public.vehicles ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    230    229            P          0    55666    billing 
   TABLE DATA           s   COPY public.billing (id, totalprice, amount, change, method, status, validity, created_at, updated_at) FROM stdin;
    public          postgres    false    209   8Z       R          0    55672 
   categories 
   TABLE DATA           e   COPY public.categories (id, name, description, priority, status, created_at, updated_at) FROM stdin;
    public          postgres    false    211   UZ       T          0    55678 	   companies 
   TABLE DATA           p   COPY public.companies (id, fullname, cnpj, email, phone, idbilling, status, created_at, updated_at) FROM stdin;
    public          postgres    false    213   ?[       V          0    55684 	   customers 
   TABLE DATA           s   COPY public.customers (id, fullname, cpf, phone, idcompany, idbilling, status, created_at, updated_at) FROM stdin;
    public          postgres    false    215   \       X          0    55690    logs 
   TABLE DATA           m   COPY public.logs (id, action, target, description, idtarget, iduser, ip, created_at, updated_at) FROM stdin;
    public          postgres    false    217   (\       Z          0    55696 	   movements 
   TABLE DATA           ?   COPY public.movements (id, idbilling, idparking, idvehicle, idcustomer, idcompany, entrydate, entrytime, exitdate, exittime, iduser, idvalet, status, created_at, updated_at) FROM stdin;
    public          postgres    false    219   ?\       \          0    55702    parkingspots 
   TABLE DATA           \   COPY public.parkingspots (id, number, idsector, status, created_at, updated_at) FROM stdin;
    public          postgres    false    221   ?\       ^          0    55708    sectors 
   TABLE DATA           W   COPY public.sectors (id, name, idcategory, status, created_at, updated_at) FROM stdin;
    public          postgres    false    223   ?\       a          0    55715    staff 
   TABLE DATA           X   COPY public.staff (id, fullname, cpf, role, status, created_at, updated_at) FROM stdin;
    public          postgres    false    226   ?\       c          0    55722    users 
   TABLE DATA           h   COPY public.users (id, email, password, permlevel, idstaff, status, created_at, updated_at) FROM stdin;
    public          postgres    false    228   H]       d          0    55728    vehicles 
   TABLE DATA           m   COPY public.vehicles (id, plate, model, color, type, idcustomer, status, created_at, updated_at) FROM stdin;
    public          postgres    false    229   ?]       u           0    0    billing_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.billing_id_seq', 1, false);
          public          postgres    false    210            v           0    0    categories_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.categories_id_seq', 7, true);
          public          postgres    false    212            w           0    0    companies_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.companies_id_seq', 1, false);
          public          postgres    false    214            x           0    0    customers_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.customers_id_seq', 1, false);
          public          postgres    false    216            y           0    0    logs_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.logs_id_seq', 2, true);
          public          postgres    false    218            z           0    0    movements_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.movements_id_seq', 1, false);
          public          postgres    false    220            {           0    0    parkingspots_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.parkingspots_id_seq', 1, false);
          public          postgres    false    222            |           0    0    sectors_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.sectors_id_seq', 1, false);
          public          postgres    false    224            }           0    0    staff_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.staff_id_seq', 1, true);
          public          postgres    false    225            ~           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 1, true);
          public          postgres    false    227                       0    0    vehicles_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.vehicles_id_seq', 1, false);
          public          postgres    false    230            ?           2606    55744    billing billing_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.billing
    ADD CONSTRAINT billing_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.billing DROP CONSTRAINT billing_pkey;
       public            postgres    false    209            ?           2606    55746    categories categories_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            postgres    false    211            ?           2606    55748    companies companies_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.companies DROP CONSTRAINT companies_pkey;
       public            postgres    false    213            ?           2606    55750    customers customers_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.customers DROP CONSTRAINT customers_pkey;
       public            postgres    false    215            ?           2606    55752    logs logs_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.logs
    ADD CONSTRAINT logs_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.logs DROP CONSTRAINT logs_pkey;
       public            postgres    false    217            ?           2606    55754    movements movements_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.movements
    ADD CONSTRAINT movements_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.movements DROP CONSTRAINT movements_pkey;
       public            postgres    false    219            ?           2606    55756    parkingspots parkingspots_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.parkingspots
    ADD CONSTRAINT parkingspots_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.parkingspots DROP CONSTRAINT parkingspots_pkey;
       public            postgres    false    221            ?           2606    55758    sectors sectors_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.sectors DROP CONSTRAINT sectors_pkey;
       public            postgres    false    223            ?           2606    55760    staff staff_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.staff DROP CONSTRAINT staff_pkey;
       public            postgres    false    226            ?           2606    55762    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    228            ?           2606    55764    vehicles vehicles_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.vehicles DROP CONSTRAINT vehicles_pkey;
       public            postgres    false    229            P      x?????? ? ?      R   ?  x???Mn?0?5y
 aIJT-??d?«???ʌA@?(?,?F??X?4(U,????>r?f??1?윸?F`?.?}?
?;????x???????p_? Z??/??(F?(?k?F?y?L?f?)???V?0?Ѷ1FZe*U??x1????/qN??F<?|h1?cKV,=Uc?4????g6?f??????@s?p:?|~J??gOe??˺?ze?K??=?!B??-??]?????z?]??g?{?Z??l??V?V???3?6???Bg???k??q?ַ?!]??JVT?ʮ?xž???????????,(9??h?76?Erq????.uSY躪5???Wv?ar?S?G5&?g??n??K????J?? 'ҧ?&K[j]???O?9???(?      T      x?????? ? ?      V      x?????? ? ?      X   h   x????	?@???*l ????&nV?K??????K
P?q???W?}YW??r???P???ǓTb(?|???? ????w?[;^?ys?<?A????f??#%.      Z      x?????? ? ?      \      x?????? ? ?      ^      x?????? ? ?      a   A   x?3?tL????451001?0??0??8r???+Y?XZ???Y?????????? >??      c   ?   x?3?LL???s(NLK-H,??K???T1?T14P?H?????07s*O??4?p+L-,6uq-?5/r????J???)K????s???L?4?4?t?4202?50?54W02?20?2??336473?#????? ?&B      d      x?????? ? ?     