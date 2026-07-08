const destinationGroups = [
  [
    "CORSE",
    "Corse du Sud",
    "Haute Corse"
  ],
  [
    "Nouvelle-Zélande",
    "Nouvelle-Zélande (Île du Sud)",
    "Nouvelle-Zélande (Île du Nord)",
    "Queenstown & Nouvelle-Zélande (Île du Sud)",
    "Queenstown"
  ],
  [
    "Pyrénées ESPAGNOLES",
    "Pyrénées",
    "Saragosse & Pyrénées ESPAGNOLES",
    "Pays Basque espagnol & Pyrénées ESPAGNOLES",
    "Pampelune & Pyrénées ESPAGNOLES",
    "Luchon & Pyrénées",
    "TOULOUSE & Pyrénées"
  ],
  [
    "Polynésie",
    "BORA BORA",
    "TAHITI",
    "TAHITI & Polynésie",
    "BORA BORA & TAHITI",
    "BORA BORA & Polynésie"
  ],
  [
    "Dubaï",
    "Émirats Arabes Unis",
    "Dubaï & Émirats Arabes Unis",
    "Dubaï & OMAN"
  ],
  [
    "ARABIE SAOUDITE",
    "Riyad",
    "Riyad & ARABIE SAOUDITE"
  ],
  [
    "SUISSE",
    "Zermatt",
    "LUCERNE"
  ],
  [
    "STOCKHOLM",
    "Suède"
  ],
  [
    "ROUMANIE",
    "Transylvanie",
    "BUCAREST"
  ],
  [
    "République tchèque",
    "PRAGUE"
  ],
  [
    "PORTUGAL",
    "Lisbonne et région (Centre)",
    "Nord portugais",
    "Alentejo",
    "ALGARVE",
    "LISBONNE",
    "PORTO",
    "Albufeira"
  ],
  [
    "POLOGNE",
    "Cracovie"
  ],
  [
    "PAYS-BAS",
    "AMSTERDAM"
  ],
  [
    "LOFOTEN",
    "Norvège",
    "Bergen",
    "Tromsø"
  ],
  [
    "Cape Town & Garden Route",
    "LE CAP",
    "AFRIQUE DU SUD",
    "LE CAP & AFRIQUE DU SUD",
    "Pretoria & Mpumalanga",
    "Pretoria",
    "Johannesburg",
    "Johannesburg & Pretoria",
    "Johannesburg & Mpumalanga"
  ],
  [
    "égypte",
    "LOUXOR",
    "LOUXOR & égypte",
    "Le Caire",
    "Le Caire & Sinaï",
    "Sinaï",
    "Le Caire & égypte",
    "LOUXOR & Sinaï"
  ],
  [
    "Réunion & MAURICE",
    "Réunion"
  ],
  [
    "Réunion & MAURICE",
    "MAURICE"
  ],
  [
    "Nairobi & KENYA",
    "Nairobi",
    "KENYA"
  ],
  [
    "MARRAKECH",
    "Haut Atlas",
    "MARRAKECH & Haut Atlas",
    "MARRAKECH & Essaouira et côte atlantique",
    "Essaouira et côte atlantique",
    "MARRAKECH & Désert du Sahara",
    "MARRAKECH",
    "MAROC",
    "Chefchaouen",
    "Fès-Meknès",
    "Chefchaouen & MAROC",
    "Chefchaouen & Fès-Meknès"
  ],
  [
    "TANZANIE",
    "ZANZIBAR",
    "ZANZIBAR & TANZANIE"
  ],
  [
    "TUNIS",
    "TUNISIE",
    "TUNIS & TUNISIE"
  ],
  [
    "MARTINIQUE & GUADELOUPE",
    "MARTINIQUE",
    "GUADELOUPE"
  ],
  [
    "Roatán & HONDURAS",
    "Roatán",
    "HONDURAS"
  ],
  [
    "Cancún",
    "Tulum",
    "Yucatán",
    "Riviera Maya",
    "MEXIQUE",
    "Cancún & MEXIQUE",
    "Tulum & MEXIQUE",
    "Tulum & Yucatán",
    "Cancún & Yucatán",
    "Cancún & Riviera Maya",
    "Riviera Maya & Oaxaca",
    "Riviera Maya & Yucatán",
    "Oaxaca & Yucatán",
    "Tulum & Riviera Maya"
  ],
  [
    "MEXIQUE",
    "Oaxaca",
    "Basse-Californie",
    "MEXICO",
    "MEXICO & Basse-Californie",
    "MEXICO & Oaxaca",
    "MEXICO & MEXIQUE",
    "Riviera Maya & Oaxaca",
    "Oaxaca & Yucatán"
  ],
  [
    "OUEST CANADIEN",
    "VANCOUVER",
    "VANCOUVER & OUEST CANADIEN"
  ],
  [
    "Provinces maritimes",
    "Québec",
    "Québec & Provinces maritimes",
    "Ontario",
    "Québec & Ontario",
    "Toronto",
    "Toronto & Ontario",
    "Montréal",
    "Montréal & Toronto",
    "Montréal & Provinces maritimes",
    "Montréal & Québec"
  ],
  [
    "Ouest américain",
    "CALIFORNIE",
    "CALIFORNIE & Ouest américain",
    "Los Angeles",
    "Los Angeles & CALIFORNIE",
    "San francisco",
    "San francisco & CALIFORNIE",
    "ARIZONA",
    "LAS VEGAS",
    "LAS VEGAS & ARIZONA",
    "Utah",
    "LAS VEGAS & Utah",
    "LAS VEGAS & Ouest américain",
    "Los Angeles & ARIZONA",
    "San francisco & Utah",
    "Los Angeles & San francisco",
    "ARIZONA & Utah"
  ],
  [
    "Los Angeles",
    "hawaï",
    "Los Angeles & hawaï"
  ],
  [
    "San francisco",
    "ALASKA",
    "San francisco & ALASKA"
  ],
  [
    "TEXAS",
    "Louisiane",
    "Louisiane & TEXAS",
    "Nouvelle-Orléans",
    "Nouvelle-Orléans & Louisiane",
    "Chicago",
    "Chicago & TEXAS"
  ],
  [
    "Washington",
    "NEW YORK",
    "NEW YORK & Washington",
    "NEW YORK & Nouvelle-Angleterre",
    "Nouvelle-Angleterre"
  ],
  [
    "FLORIDE",
    "Miami",
    "Miami & FLORIDE"
  ],
  [
    "PATAGONIE",
    "BUENOS AIRES",
    "BUENOS AIRES & PATAGONIE"
  ],
  [
    "ARGENTINE",
    "BUENOS AIRES",
    "Mendoza",
    "Mendoza & ARGENTINE",
    "BUENOS AIRES & ARGENTINE",
    "Nord-Ouest andin",
    "Mendoza & Nord-Ouest andin"
  ],
  [
    "Île de Pâques",
    "Santiago",
    "Santiago & Île de Pâques",
    "CHILI",
    "Santiago & CHILI",
    "CHILI & Île de Pâques"
  ],
  [
    "Santiago & PATAGONIE",
    "PATAGONIE",
    "Santiago"
  ],
  [
    "Colombie",
    "Medellín",
    "Medellín & Colombie",
    "Caraïbes colombiennes",
    "Cartagena",
    "Cartagena & Caraïbes colombiennes",
    "Medellín & Cartagena"
  ],
  [
    "équateur",
    "Galápagos",
    "Galápagos & équateur"
  ],
  [
    "Andes du Pérou",
    "LIMA",
    "LIMA & Andes du Pérou",
    "Pérou",
    "Cusco",
    "Cusco & Pérou",
    "LIMA & Pérou",
    "Cusco & Andes du Pérou",
    "LIMA & Cusco"
  ],
  [
    "Brésil",
    "AMAZONIE",
    "NORDESTE",
    "NORDESTE & AMAZONIE",
    "Chutes d’Iguaçu",
    "Chutes d’Iguaçu & AMAZONIE",
    "GRANDE RIO & COSTA VERDE",
    "GRANDE RIO & COSTA VERDE & AMAZONIE",
    "GRANDE RIO & COSTA VERDE & Chutes d’Iguaçu",
    "GRANDE RIO & COSTA VERDE & NORDESTE",
    "Chutes d’Iguaçu & AMAZONIE",
    "RIO DE JANEIRO",
    "RIO DE JANEIRO & Brésil",
    "São Paulo",
    "São Paulo & AMAZONIE",
    "São Paulo & NORDESTE",
    "RIO DE JANEIRO & Chutes d’Iguaçu",
    "São Paulo & Brésil",
    "RIO DE JANEIRO & AMAZONIE",
    "RIO DE JANEIRO & NORDESTE",
    "São Paulo & Chutes d’Iguaçu",
    "RIO DE JANEIRO & GRANDE RIO & COSTA VERDE",
    "São Paulo & GRANDE RIO & COSTA VERDE",
    "São Paulo & RIO DE JANEIRO",
    "FERNANDO DE NORONHA",
    "RIO DE JANEIRO & FERNANDO DE NORONHA",
    "São Paulo & FERNANDO DE NORONHA",
    "NORDESTE & FERNANDO DE NORONHA"
  ],
  [
    "BOLIVIE & Andes du Pérou",
    "Andes du Pérou",
    "BOLIVIE",
    "LIMA & Andes du Pérou",
    "Cusco & Andes du Pérou"
  ],
  [
    "Chine du Sud-Ouest",
    "HAINAN",
    "HAINAN & Chine du Sud-Ouest",
    "Hunan",
    "Sichuan",
    "Sichuan & Hunan",
    "Beijing",
    "Beijing & HAINAN",
    "Shanghai",
    "Shanghai & HAINAN",
    "CHINE",
    "Shanghai & CHINE",
    "Shanghai & Hunan",
    "Shanghai & Sichuan",
    "Chine de l’Est",
    "Shanghai & Chine de l’Est",
    "Xi’an",
    "Xi’an & Shanghai",
    "Beijing & Shanghai",
    "Shanghai & Chine du Sud-Ouest",
    "Xi’an & Chine du Sud-Ouest",
    "Xi’an & Hunan",
    "Xi’an & Sichuan",
    "Xi’an & Chine de l’Est",
    "Beijing & Chine du Sud-Ouest",
    "Beijing & Hunan",
    "Beijing & Sichuan",
    "Beijing & Chine de l’Est",
    "Xi’an & CHINE",
    "Beijing & CHINE",
    "Beijing & Xi’an",
    "HONG-KONG",
    "HONG-KONG & HAINAN",
    "HONG-KONG & Chine du Sud-Ouest"
  ],
  [
    "Île de Jeju",
    "SEOUL",
    "SEOUL & Île de Jeju",
    "Corée du Sud",
    "SEOUL & Corée du Sud",
    "Île de Jeju & Corée du Sud"
  ],
  [
    "ÎLES ANDAMAN & NICOBAR",
    "New Delhi",
    "New Delhi & ÎLES ANDAMAN & NICOBAR",
    "Himalaya indien",
    "New Delhi & Himalaya indien",
    "INDE",
    "New Delhi & INDE",
    "INDE DU NORD",
    "New Delhi & INDE DU NORD",
    "INDE DU SUD",
    "New Delhi & INDE DU SUD",
    "GOA",
    "New Delhi & GOA",
    "Mumbai",
    "Mumbai & INDE",
    "Mumbai & INDE DU NORD",
    "Mumbai & INDE DU SUD",
    "Mumbai & GOA"
  ],
  [
    "KOMODO / FLORES OUEST",
    "TIMOR OCCIDENTAL",
    "TIMOR OCCIDENTAL & KOMODO / FLORES OUEST",
    "Indonésie",
    "Bornéo Indonésien",
    "Bornéo Indonésien & Indonésie",
    "LOMBOK",
    "KOMODO / FLORES OUEST & LOMBOK",
    "JAVA",
    "SUMATRA",
    "SUMATRA & JAVA",
    "BALI",
    "BALI & LOMBOK",
    "PAPOUASIE OCCIDENTALE",
    "RAJA AMPAT",
    "RAJA AMPAT & PAPOUASIE OCCIDENTALE"
  ],
  [
    "PANAMA",
    "COSTA RICA",
    "PANAMA & COSTA RICA"
  ],
  [
    "TOKYO",
    "Kyoto",
    "Kyoto & TOKYO",
    "JAPON",
    "Hokkaidō",
    "Hokkaidō & JAPON",
    "Kobe/Himeji",
    "Shikoku",
    "Shikoku & Kobe/Himeji",
    "Kyūshū",
    "Kyūshū & Kobe/Himeji",
    "Kyūshū & Shikoku",
    "Osaka",
    "Osaka & TOKYO",
    "Osaka & Kyoto",
    "Osaka & Shikoku",
    "Osaka & Hokkaidō",
    "Osaka & Kyūshū",
    "Osaka & Kobe/Himeji",
    "Osaka & JAPON",
    "Kyoto & Shikoku",
    "Kyoto & Hokkaidō",
    "Kyoto & Kyūshū",
    "Kyoto & Kobe/Himeji",
    "Kyoto & JAPON",
    "TOKYO & Shikoku",
    "TOKYO & Hokkaidō",
    "TOKYO & Kyūshū",
    "TOKYO & Kobe/Himeji",
    "TOKYO & JAPON"
  ],
  [
    "SRI LANKA",
    "MALDIVES",
    "MALDIVES & SRI LANKA"
  ],
  [
    "Kuala Lumpur",
    "SINGAPOUR",
    "SINGAPOUR & Kuala Lumpur",
    "MALAISIE",
    "SINGAPOUR & MALAISIE",
    "Bornéo Malaisien",
    "SINGAPOUR & Bornéo Malaisien",
    "Tioman",
    "SINGAPOUR & Tioman",
    "SINGAPOUR & Tioman & Bornéo Malaisien",
    "Kuala Lumpur & MALAISIE",
    "Tioman & Bornéo Malaisien"
  ],
  [
    "SINGAPOUR & SUMATRA",
    "SINGAPOUR",
    "SUMATRA"
  ],
  [
    "LAOS",
    "CAMBODGE",
    "LAOS & CAMBODGE"
  ],
  [
    "Népal",
    "Pokhara",
    "Pokhara & Népal"
  ],
  [
    "PHILIPPINES",
    "PALAOS",
    "PALAOS & PHILIPPINES"
  ],
  [
    "PHILIPPINES",
    "Manille et Luzon",
    "PALAWAN",
    "PALAWAN & Manille et Luzon",
    "Cebu & Bohol",
    "Boracay",
    "Boracay & Cebu & Bohol",
    "SIQUIJOR",
    "SIQUIJOR & Cebu & Bohol"
  ],
  [
    "Thaïlande",
    "Bangkok",
    "Bangkok & Thaïlande",
    "Koh Phangan",
    "Bangkok & Koh Phangan",
    "Nord Thaïlandais",
    "Bangkok & Nord Thaïlandais",
    "Îles du Sud Thaïlandais",
    "Bangkok & Îles du Sud Thaïlandais",
    "Koh Phangan & Îles du Sud Thaïlandais"
  ],
  [
    "Vietnam du Sud",
    "Quy Nhon",
    "Quy Nhon & Vietnam du Sud",
    "Vietnam du Nord",
    "Quy Nhon & Vietnam du Nord",
    "VIETNAM",
    "Hanoï",
    "Hanoï & VIETNAM",
    "Hanoï & Quy Nhon",
    "Hanoï & Vietnam du Sud",
    "Hanoï & Vietnam du Nord"
  ],
  [
    "ALBANIE",
    "CORFOU",
    "CORFOU & ALBANIE",
    "Corfou & ZANTE"
  ],
  [
    "ALLEMAGNE",
    "COLOGNE",
    "COLOGNE & ALLEMAGNE",
    "Vallée du Rhin",
    "FRANCFORT",
    "Bavière",
    "Vallée du Rhin & Bavière",
    "COLOGNE & FRANCFORT",
    "FRANCFORT & Vallée du Rhin",
    "Nord de l’Allemagne",
    "HAMBOURG",
    "HAMBOURG & Nord de l’Allemagne",
    "Berlin et Brandebourg",
    "BERLIN",
    "BERLIN & Berlin et Brandebourg",
    "Munich & Bavière",
    "Munich"
  ],
  [
    "Pas de la case & ANDORRE",
    "Pas de la case",
    "ANDORRE"
  ],
  [
    "ANGLETERRE",
    "LONDRES",
    "LONDRES & ANGLETERRE",
    "Londres et Sud-Est",
    "LONDRES & Londres et Sud-Est",
    "Sud-Ouest Anglais",
    "LONDRES & Sud-Ouest Anglais",
    "Nord de l’Angleterre",
    "Liverpool",
    "Liverpool & Nord de l’Angleterre",
    "York",
    "York & Nord de l’Angleterre"
  ],
  [
    "AUTRICHE",
    "VIENNE",
    "VIENNE & AUTRICHE",
    "Tyrol",
    "Salzbourg",
    "Salzbourg & Tyrol"
  ],
  [
    "BELGIQUE",
    "BRUGES",
    "BRUGES & BELGIQUE",
    "Charleville-Mézières & Belgique"
  ],
  [
    "BULGARIE",
    "SOFIA",
    "SOFIA & BULGARIE"
  ],
  [
    "îles croates (Hvar, Korčula)",
    "Dalmatie",
    "Dalmatie & îles croates (Hvar, Korčula)",
    "CROATIE",
    "DUBROVNIK",
    "DUBROVNIK & CROATIE",
    "Split",
    "Split & CROATIE",
    "Split & DUBROVNIK",
    "Split & îles croates (Hvar, Korčula)",
    "Split & Istrie",
    "Split & Dalmatie",
    "DUBROVNIK & Dalmatie",
    "DUBROVNIK & îles croates (Hvar, Korčula)",
    "DUBROVNIK & Monténégro"
  ],
  [
    "Istrie",
    "Split & Istrie"
  ],
  [
    "DUBROVNIK & Monténégro",
    "Monténégro"
  ],
  [
    "DANEMARK",
    "Copenhague",
    "Copenhague & DANEMARK"
  ],
  [
    "écosse",
    "Édimbourg",
    "Édimbourg & écosse"
  ],
  [
    "Pays Basque espagnol",
    "Saint-Sébastien",
    "Saint-Sébastien & Pays Basque espagnol",
    "Bilbao",
    "Bilbao & Pays Basque espagnol",
    "Nord-Ouest espagnol",
    "Saint-Sébastien & Nord-Ouest espagnol",
    "Bilbao & Nord-Ouest espagnol",
    "Saint-Sébastien & Pampelune",
    "Saint-Sébastien & Bilbao",
    "Pays Basque espagnol & Nord-Ouest espagnol",
    "Saint-Sébastien & Rioja",
    "Bilbao & Rioja",
    "Pays Basque espagnol & Rioja"
  ],
  [
    "Pays Basque espagnol",
    "Pyrénées ESPAGNOLES",
    "Saragosse",
    "Saragosse & Pyrénées ESPAGNOLES",
    "Pampelune",
    "Pampelune & Pyrénées ESPAGNOLES",
    "Saint-Sébastien & Pampelune",
    "Pays Basque espagnol & Pyrénées ESPAGNOLES",
    "Rioja",
    "Pampelune & Rioja",
    "Saragosse & Rioja",
    "Pays Basque espagnol & Rioja"
  ],
  [
    "Pyrénées ESPAGNOLES",
    "CATALOGNE",
    "CATALOGNE & Pyrénées ESPAGNOLES",
    "COSTA BRAVA",
    "COSTA BRAVA & Pyrénées ESPAGNOLES",
    "COSTA BRAVA & CATALOGNE",
    "BARCELONE",
    "BARCELONE & COSTA BRAVA",
    "BARCELONE & CATALOGNE",
    "Saragosse",
    "Saragosse & CATALOGNE"
  ],
  [
    "Costa Blanca",
    "BARCELONE",
    "BARCELONE & Costa Blanca",
    "VALENCE",
    "VALENCE & Costa Blanca",
    "CATALOGNE",
    "Costa Blanca & CATALOGNE"
  ],
  [
    "ESPAGNE CENTRALE",
    "MADRID",
    "MADRID & ESPAGNE CENTRALE"
  ],
  [
    "ANDALOUSIE",
    "Séville",
    "Séville & ANDALOUSIE"
  ],
  [
    "MINORQUE",
    "FORMENTERA",
    "FORMENTERA & MINORQUE",
    "MAJORQUE",
    "IBIZA"
  ],
  [
    "TENERIFE",
    "GRANDE CANARIE",
    "LA GOMERA & TENERIFE",
    "LANZAROTE",
    "LA PALMA",
    "FUERTEVENTURA",
    "LA GOMERA",
    "LA GRACIOSA",
    "LA GRACIOSA & LANZAROTE"
  ],
  [
    "FINLANDE",
    "LAPONIE",
    "LAPONIE & FINLANDE"
  ],
  [
    "Côte d'Azur",
    "NICE",
    "NICE & Côte d'Azur",
    "Cannes",
    "NICE & Cannes",
    "Cannes & Côte d'Azur",
    "NICE & Haute Corse",
    "Monaco & Nice",
    "NICE & Menton",
    "NICE & MERCANTOUR",
    "Saint-Tropez & Côte d'Azur"
  ],
  [
    "PORQUEROLLES",
    "MARSEILLE",
    "MARSEILLE & PORQUEROLLES",
    "LUBERON",
    "MARSEILLE & LUBERON",
    "MARSEILLE & VERDON",
    "MARSEILLE & LUBERON",
    "MARSEILLE & CORSE",
    "Avignon & VERDON",
    "Avignon & LUBERON",
    "Orange & LUBERON",
    "Arles & LUBERON",
    "MARSEILLE & Îles du Frioul",
    "PORQUEROLLES & ÎLE DE PORT-CROS"
  ],
  [
    "LUBERON",
    "MARSEILLE",
    "MARSEILLE & LUBERON",
    "Provence",
    "MARSEILLE & Provence",
    "MARSEILLE & PORQUEROLLES",
    "MARSEILLE & VERDON",
    "MARSEILLE & CORSE",
    "Avignon & LUBERON",
    "Orange & LUBERON",
    "Arles & LUBERON",
    "MARSEILLE & Îles du Frioul"
  ],
  [
    "VERDON",
    "MARSEILLE",
    "MARSEILLE & VERDON",
    "Provence",
    "MARSEILLE & Provence",
    "MARSEILLE & PORQUEROLLES",
    "MARSEILLE & LUBERON",
    "MARSEILLE & CORSE",
    "Avignon & LUBERON",
    "Orange & LUBERON",
    "Arles & LUBERON",
    "MARSEILLE & Îles du Frioul"
  ],
  [
    "ALPES",
    "ANNECY",
    "ANNECY & ALPES",
    "LYON & ALPES",
    "LYON & Chartreuse",
    "LYON & Ardèche",
    "Chamonix",
    "Chamonix & Annecy",
    "Chamonix & ALPES",
    "Évian-les-Bains & ALPES",
    "Évian-les-Bains",
    "Courchevel & ALPES"
  ],
  [
    "Ardèche",
    "LYON",
    "LYON & Ardèche",
    "LYON & Chartreuse",
    "LYON & ALPES",
    "Orange & Ardèche"
  ],
  [
    "ALPES",
    "LYON",
    "LYON & ALPES",
    "ANNECY & ALPES",
    "LYON & Chartreuse",
    "LYON & Ardèche",
    "Chamonix & ALPES",
    "Évian-les-Bains & ALPES",
    "Courchevel & ALPES"
  ],
  [
    "Chartreuse",
    "LYON",
    "LYON & Chartreuse",
    "LYON & ALPES",
    "LYON & Ardèche",
    "Aix-les-Bains & Chartreuse"
  ],
  [
    "BIARRITZ",
    "ESPELETTE",
    "ESPELETTE & BIARRITZ",
    "PAYS BASQUE",
    "ESPELETTE & PAYS BASQUE",
    "Bayonne",
    "Bayonne & BIARRITZ",
    "Bayonne & PAYS BASQUE",
    "BIARRITZ & PAYS BASQUE",
    "ESPELETTE & Bayonne"
  ],
  [
    "CAMARGUE",
    "Arles",
    "Arles & CAMARGUE",
    "Nîmes",
    "Arles & Nîmes",
    "Nîmes & CAMARGUE",
    "MONTPELLIER",
    "MONTPELLIER & CAMARGUE",
    "MONTPELLIER & Nîmes",
    "Avignon & CAMARGUE",
    "Nîmes & Cévennes",
    "Sète & MONTPELLIER"
  ],
  [
    "NOUVELLE-AQUITAINE",
    "BORDEAUX",
    "BORDEAUX & NOUVELLE-AQUITAINE",
    "Bassin d’Arcachon",
    "BORDEAUX & Bassin d’Arcachon"
  ],
  [
    "AVEYRON",
    "Albi",
    "Albi & AVEYRON",
    "TOULOUSE",
    "TOULOUSE & AVEYRON",
    "TOULOUSE & Pyrénées",
    "TOULOUSE & Midi-Pyrénées",
    "Midi-Pyrénées",
    "TOULOUSE & Albi",
    "Albi & Midi-Pyrénées"
  ],
  [
    "TOULOUSE & Albi",
    "TOULOUSE",
    "Albi",
    "TOULOUSE & Midi-Pyrénées",
    "TOULOUSE & Pyrénées",
    "Pyrénées",
    "Midi-Pyrénées",
    "Albi & Midi-Pyrénées",
    "Luchon & Pyrénées",
    "Toulouse & QUERCY"
  ],
  [
    "Reims",
    "PARIS",
    "PARIS & Reims",
    "PARIS & Rouen",
    "PARIS & Fontainebleau",
    "PARIS & Orléans",
    "PARIS & Champagne",
    "PARIS & NORMANDIE",
    "PARIS & Bourgogne",
    "PARIS & Vallée de la Loire",
    "PARIS & Île-de-France",
    "Troyes & Reims",
    "Reims & Champagne"
  ],
  [
    "Rouen",
    "PARIS",
    "PARIS & Reims",
    "PARIS & Rouen",
    "PARIS & Fontainebleau",
    "PARIS & Orléans",
    "PARIS & Champagne",
    "PARIS & NORMANDIE",
    "PARIS & Bourgogne",
    "PARIS & Vallée de la Loire",
    "PARIS & Île-de-France",
    "Rouen & Normandie"
  ],
  [
    "Fontainebleau",
    "PARIS",
    "PARIS & Reims",
    "PARIS & Rouen",
    "PARIS & Fontainebleau",
    "PARIS & Orléans",
    "PARIS & Champagne",
    "PARIS & NORMANDIE",
    "PARIS & Bourgogne",
    "PARIS & Vallée de la Loire",
    "PARIS & Île-de-France",
    "Fontainebleau & Île-de-France"
  ],
  [
    "Orléans",
    "PARIS",
    "PARIS & Reims",
    "PARIS & Rouen",
    "PARIS & Fontainebleau",
    "PARIS & Orléans",
    "PARIS & Champagne",
    "PARIS & NORMANDIE",
    "PARIS & Bourgogne",
    "PARIS & Vallée de la Loire",
    "PARIS & Île-de-France",
    "Orléans & Vallée de la Loire",
    "Tours & Orléans",
    "Orléans & SOLOGNE"
  ],
  [
    "Champagne",
    "PARIS",
    "PARIS & Reims",
    "PARIS & Rouen",
    "PARIS & Fontainebleau",
    "PARIS & Orléans",
    "PARIS & Champagne",
    "PARIS & NORMANDIE",
    "PARIS & Bourgogne",
    "PARIS & Vallée de la Loire",
    "PARIS & Île-de-France",
    "Troyes & Champagne"
  ],
  [
    "NORMANDIE",
    "PARIS",
    "PARIS & Reims",
    "PARIS & Rouen",
    "PARIS & Fontainebleau",
    "PARIS & Orléans",
    "PARIS & Champagne",
    "PARIS & NORMANDIE",
    "PARIS & Bourgogne",
    "PARIS & Vallée de la Loire",
    "PARIS & Île-de-France",
    "CAEN & Normandie",
    "Rouen & Normandie",
    "Deauville & NORMANDIE"
  ],
  [
    "Bourgogne",
    "PARIS",
    "PARIS & Reims",
    "PARIS & Rouen",
    "PARIS & Fontainebleau",
    "PARIS & Orléans",
    "PARIS & Champagne",
    "PARIS & NORMANDIE",
    "PARIS & Bourgogne",
    "PARIS & Vallée de la Loire",
    "PARIS & Île-de-France",
    "Beaune & Bourgogne",
    "DIJON & Bourgogne"
  ],
  [
    "Vallée de la Loire",
    "PARIS",
    "PARIS & Reims",
    "PARIS & Rouen",
    "PARIS & Fontainebleau",
    "PARIS & Orléans",
    "PARIS & Champagne",
    "PARIS & NORMANDIE",
    "PARIS & Bourgogne",
    "PARIS & Vallée de la Loire",
    "PARIS & Île-de-France",
    "Tours & Vallée de la Loire",
    "Orléans & Vallée de la Loire",
    "Bourges & Vallée de la Loire",
    "Chartres & Vallée de la Loire"
  ],
  [
    "Île-de-France",
    "PARIS",
    "PARIS & Reims",
    "PARIS & Rouen",
    "PARIS & Fontainebleau",
    "PARIS & Orléans",
    "PARIS & Champagne",
    "PARIS & NORMANDIE",
    "PARIS & Bourgogne",
    "PARIS & Vallée de la Loire",
    "PARIS & Île-de-France",
    "Fontainebleau & Île-de-France"
  ],
  [
    "Pyrénées ORIENTALES",
    "Narbonne",
    "Narbonne & Pyrénées ORIENTALES",
    "Perpignan",
    "Perpignan & Narbonne",
    "Perpignan & Pyrénées ORIENTALES",
    "Carcassonne & Narbonne"
  ],
  [
    "STRASBOURG",
    "Colmar",
    "Colmar & STRASBOURG",
    "Mulhouse",
    "Mulhouse & STRASBOURG",
    "Mulhouse & Colmar",
    "Vosges",
    "ALSACE",
    "Colmar & Vosges",
    "Colmar & ALSACE",
    "Mulhouse & Vosges",
    "Mulhouse & ALSACE",
    "STRASBOURG & Vosges",
    "STRASBOURG & ALSACE",
    "Metz & VOSGES",
    "Nancy & VOSGES"
  ],
  [
    "Corse du Sud",
    "Bonifacio",
    "Bonifacio & Corse du Sud"
  ],
  [
    "CAMARGUE",
    "Avignon",
    "Avignon & CAMARGUE",
    "MONTPELLIER & CAMARGUE",
    "Nîmes & CAMARGUE",
    "Arles & CAMARGUE"
  ],
  [
    "Cévennes",
    "Orange",
    "Orange & Cévennes",
    "Nîmes & Cévennes",
    "Sète & Cévennes",
    "Millau & Cévennes"
  ],
  [
    "Vallée du Rhône",
    "Orange",
    "Orange & Vallée du Rhône",
    "Avignon",
    "Avignon & Vallée du Rhône"
  ],
  [
    "Ardèche",
    "Orange",
    "Orange & Ardèche",
    "LYON & Ardèche"
  ],
  [
    "VERDON",
    "Avignon",
    "Avignon & VERDON",
    "MARSEILLE & VERDON"
  ],
  [
    "LUBERON",
    "Arles",
    "Orange",
    "Avignon",
    "Avignon & LUBERON",
    "Orange & LUBERON",
    "Arles & LUBERON",
    "Arles & Avignon",
    "Orange & Avignon"
  ],
  [
    "Vendée",
    "La Rochelle",
    "La Rochelle & Vendée",
    "La Rochelle & Île de Ré",
    "La Rochelle & ÎLE D'OLéRON",
    "Nantes & Vendée",
    "Angers & Vendée",
    "Niort & La Rochelle",
    "Niort & Vendée",
    "Niort",
    "Poitiers & Vendée",
    "Poitiers",
    "Niort & Poitiers"
  ],
  [
    "La Rochelle",
    "Île de Ré",
    "La Rochelle & Île de Ré",
    "ÎLE D'OLéRON",
    "La Rochelle & ÎLE D'OLéRON",
    "Île de Ré & ÎLE D'OLéRON"
  ],
  [
    "MASSIF CENTRAL",
    "Clermont-Ferrand",
    "Clermont-Ferrand & MASSIF CENTRAL",
    "AUVERGNE",
    "Clermont-Ferrand & AUVERGNE",
    "Vichy & AUVERGNE",
    "Vichy & Clermont-Ferrand",
    "Vichy"
  ],
  [
    "Aix-les-Bains",
    "Chartreuse",
    "Aix-les-Bains & Chartreuse"
  ],
  [
    "Vendée",
    "Nantes",
    "Nantes & Vendée",
    "Île d’Yeu",
    "Nantes & Île d’Yeu"
  ],
  [
    "Monaco",
    "MERCANTOUR",
    "Monaco & MERCANTOUR",
    "Monaco & Nice",
    "NICE & MERCANTOUR",
    "Menton & MERCANTOUR"
  ],
  [
    "Menton & MERCANTOUR",
    "Menton",
    "MERCANTOUR",
    "Monaco & MERCANTOUR",
    "NICE & Menton",
    "NICE & MERCANTOUR"
  ],
  [
    "DORDOGNE",
    "Sarlat",
    "Sarlat & DORDOGNE"
  ],
  [
    "BRETAGNE",
    "Saint-Malo",
    "Saint-Malo & BRETAGNE",
    "Rennes & BRETAGNE"
  ],
  [
    "Belle-Île-en-Mer",
    "VANNES",
    "VANNES & Belle-Île-en-Mer",
    "VANNES & Quiberon",
    "VANNES & Quiberon"
  ],
  [
    "Côte d'Azur",
    "Saint-Tropez",
    "Saint-Tropez & Côte d'Azur",
    "Cannes & Côte d'Azur",
    "NICE & Côte d'Azur"
  ],
  [
    "Jura",
    "DIJON",
    "DIJON & Jura",
    "DIJON & Bourgogne",
    "Beaune & Dijon"
  ],
  [
    "Bourgogne",
    "DIJON",
    "DIJON & Bourgogne",
    "DIJON & Jura",
    "Beaune & Bourgogne",
    "Beaune",
    "Beaune & Dijon"
  ],
  [
    "OCCITANIE",
    "Carcassonne",
    "Carcassonne & OCCITANIE",
    "CAP D'AGDE & Occitanie",
    "Carcassonne & Narbonne"
  ],
  [
    "Cévennes",
    "Sète",
    "Sète & Cévennes",
    "MONTPELLIER",
    "Sète & MONTPELLIER",
    "Orange & Cévennes",
    "Nîmes & Cévennes",
    "Millau & Cévennes"
  ],
  [
    "AVEYRON",
    "Rodez",
    "Rodez & AVEYRON",
    "Millau",
    "Millau & AVEYRON",
    "Millau & Rodez"
  ],
  [
    "Aubrac",
    "Rodez",
    "Rodez & Aubrac",
    "Millau & Rodez",
    "Rodez & AVEYRON",
    "Aurillac & AUBRAC"
  ],
  [
    "Cévennes",
    "Millau",
    "Millau & Cévennes",
    "Orange & Cévennes",
    "Nîmes & Cévennes",
    "Sète & Cévennes",
    "Rodez",
    "Rodez & Aubrac",
    "Rodez & AVEYRON",
    "Millau & Rodez"
  ],
  [
    "Metz",
    "Nancy",
    "Nancy & Metz",
    "VOSGES",
    "Metz & VOSGES",
    "Nancy & VOSGES",
    "STRASBOURG & Vosges",
    "Mulhouse & Vosges",
    "Colmar & Vosges"
  ],
  [
    "Vendée",
    "Angers",
    "Angers & Vendée",
    "Nantes & Vendée",
    "La Rochelle & Vendée"
  ],
  [
    "Pyrénées",
    "Luchon",
    "Luchon & Pyrénées",
    "TOULOUSE & Pyrénées"
  ],
  [
    "Côte d’Opale",
    "Dunkerque",
    "Dunkerque & Côte d’Opale",
    "LILLE & Dunkerque",
    "LILLE",
    "LILLE & Côte d’Opale",
    "Baie de Somme & Côte d’Opale"
  ],
  [
    "Rennes & BRETAGNE",
    "Rennes",
    "BRETAGNE",
    "Saint-Malo & BRETAGNE",
    "Brest & BRETAGNE"
  ],
  [
    "ALPES",
    "Courchevel",
    "Courchevel & ALPES",
    "Chamonix & ALPES",
    "Évian-les-Bains & ALPES",
    "LYON & ALPES",
    "ANNECY & ALPES"
  ],
  [
    "Vallée de la Loire",
    "Tours",
    "Tours & Vallée de la Loire",
    "Orléans & Vallée de la Loire",
    "Orléans",
    "Tours & Orléans",
    "Bourges & Vallée de la Loire",
    "Chartres & Vallée de la Loire",
    "PARIS & Vallée de la Loire",
    "Orléans & SOLOGNE"
  ],
  [
    "Presqu’île de Crozon",
    "Brest",
    "Brest & Presqu’île de Crozon",
    "BRETAGNE",
    "Brest & BRETAGNE",
    "Saint-Malo & BRETAGNE",
    "Rennes & BRETAGNE",
    "CONCARNEAU & Presqu’île de Crozon"
  ],
  [
    "Périgord Noir",
    "Brive-la-Gaillarde",
    "Brive-la-Gaillarde & Périgord Noir",
    "Corrèze",
    "Brive-la-Gaillarde & Corrèze",
    "Saintes & Périgord Noir"
  ],
  [
    "Normandie",
    "CAEN",
    "PARIS & NORMANDIE",
    "CAEN & Normandie",
    "Rouen & Normandie",
    "GRANVILLE & NORMANDIE",
    "GRANVILLE"
  ],
  [
    "Îles du Frioul",
    "MARSEILLE",
    "MARSEILLE & Îles du Frioul",
    "MARSEILLE & Provence",
    "MARSEILLE & PORQUEROLLES",
    "MARSEILLE & LUBERON",
    "MARSEILLE & CORSE",
    "MARSEILLE & VERDON"
  ],
  [
    "ÎLE DE GROIX",
    "CONCARNEAU",
    "CONCARNEAU & ÎLE DE GROIX",
    "CONCARNEAU & Presqu’île de Crozon",
    "Brest & Presqu’île de Crozon",
    "ÎLE DE GROIX & Belle-Île-en-Mer"
  ],
  [
    "Presqu’île de Crozon",
    "CONCARNEAU",
    "CONCARNEAU & Presqu’île de Crozon",
    "CONCARNEAU & ÎLE DE GROIX",
    "Lorient & ÎLE DE GROIX"
  ],
  [
    "NORMANDIE",
    "Rouen",
    "Rouen & Normandie",
    "PARIS & NORMANDIE",
    "CAEN & Normandie",
    "GRANVILLE & NORMANDIE",
    "GRANVILLE",
    "Deauville",
    "Deauville & NORMANDIE"
  ],
  [
    "Reims",
    "Troyes",
    "Troyes & Reims",
    "Champagne",
    "Troyes & Champagne",
    "Reims & Champagne"
  ],
  [
    "Lorient",
    "Quiberon",
    "Quiberon & Lorient",
    "Belle-Île-en-Mer",
    "ÎLE DE GROIX",
    "Quiberon & Belle-Île-en-Mer",
    "Lorient & ÎLE DE GROIX",
    "VANNES & Quiberon"
  ],
  [
    "Occitanie",
    "CAP D'AGDE",
    "CAP D'AGDE & Occitanie",
    "Carcassonne & OCCITANIE"
  ],
  [
    "LANDES",
    "Mont-de-Marsan",
    "Mont-de-Marsan & LANDES",
    "Dax",
    "Dax & Mont-de-Marsan",
    "Dax & LANDES"
  ],
  [
    "Belgique",
    "Charleville-Mézières",
    "Charleville-Mézières & Belgique",
    "BRUGES & BELGIQUE"
  ],
  [
    "Vendée",
    "Poitiers",
    "Poitiers & Vendée"
  ],
  [
    "Morlaix & BRETAGNE",
    "Morlaix",
    "BRETAGNE",
    "Rennes & BRETAGNE",
    "Saint-Malo & BRETAGNE",
    "Brest & BRETAGNE",
    "CARHAIX & BRETAGNE",
    "CARHAIX"
  ],
  [
    "CANTAL",
    "Aurillac",
    "Aurillac & CANTAL"
  ],
  [
    "Baie de Somme",
    "AMIENS",
    "AMIENS & Baie de Somme",
    "Baie de Somme & Côte d’Opale"
  ],
  [
    "Saintes & Périgord Noir",
    "Saintes",
    "Périgord Noir",
    "Brive-la-Gaillarde & Périgord Noir"
  ],
  [
    "Vallée de la Loire",
    "Bourges",
    "Bourges & Vallée de la Loire",
    "Chartres & Vallée de la Loire",
    "PARIS & Vallée de la Loire",
    "Orléans & Vallée de la Loire",
    "Tours & Vallée de la Loire"
  ],
  [
    "Vallée de la Loire",
    "Chartres",
    "Bourges & Vallée de la Loire",
    "Chartres & Vallée de la Loire",
    "PARIS & Vallée de la Loire",
    "Orléans & Vallée de la Loire",
    "Tours & Vallée de la Loire"
  ],
  [
    "QUERCY",
    "Toulouse",
    "Toulouse & QUERCY",
    "TOULOUSE & Midi-Pyrénées",
    "TOULOUSE & Pyrénées",
    "TOULOUSE & Albi"
  ],
  [
    "AUBRAC",
    "Aurillac",
    "Aurillac & AUBRAC"
  ],
  [
    "SOLOGNE",
    "Orléans",
    "Orléans & SOLOGNE"
  ],
  [
    "ÎLE DE PORT-CROS",
    "PORQUEROLLES",
    "PORQUEROLLES & ÎLE DE PORT-CROS",
    "MARSEILLE & PORQUEROLLES"
  ],
  [
    "Île de Ré",
    "Île de Ré & ÎLE D'OLéRON",
    "ÎLE D'OLéRON",
    "La Rochelle & ÎLE D'OLéRON",
    "La Rochelle & Île de Ré"
  ],
  [
    "Belle-Île-en-Mer",
    "ÎLE DE GROIX",
    "ÎLE DE GROIX & Belle-Île-en-Mer",
    "VANNES & Belle-Île-en-Mer",
    "Quiberon & Belle-Île-en-Mer",
    "CONCARNEAU & ÎLE DE GROIX"
  ],
  [
    "Côte d’Opale",
    "Baie de Somme",
    "Baie de Somme & Côte d’Opale",
    "Dunkerque & Côte d’Opale",
    "AMIENS & Baie de Somme"
  ],
  [
    "Grèce continentale",
    "Thessalonique",
    "Thessalonique & Grèce continentale",
    "Grèce du Nord",
    "Thessalonique & Grèce du Nord"
  ],
  [
    "RHODES",
    "KARPATHOS",
    "KARPATHOS & RHODES",
    "Kalymnos",
    "Kalymnos & KARPATHOS",
    "Kalymnos & RHODES"
  ],
  [
    "Péloponnèse",
    "ZANTE",
    "ZANTE & Péloponnèse",
    "ATHèNES & Péloponnèse",
    "IONIENNES",
    "Corfou & ZANTE"
  ],
  [
    "Grèce du Nord",
    "THASSOS",
    "THASSOS & Grèce du Nord",
    "Thessalonique & Grèce du Nord"
  ],
  [
    "SANTORIN",
    "MILOS",
    "AMORGOS",
    "MILOS & SANTORIN",
    "MILOS & AMORGOS",
    "SANTORIN & AMORGOS",
    "CYCLADES",
    "Koufonisia & AMORGOS",
    "ATHèNES & CYCLADES",
    "ATHèNES & IONIENNES"
  ],
  [
    "AMORGOS",
    "Koufonisia",
    "Koufonisia & AMORGOS",
    "MILOS & AMORGOS",
    "SANTORIN & AMORGOS",
    "Koufonisia & MYKONOS",
    "CYCLADES",
    "ATHèNES & CYCLADES",
    "ATHèNES & IONIENNES"
  ],
  [
    "MYKONOS",
    "Koufonisia",
    "Koufonisia & MYKONOS",
    "Koufonisia & AMORGOS",
    "CYCLADES",
    "ATHèNES & CYCLADES",
    "ATHèNES & IONIENNES"
  ],
  [
    "ZANTE",
    "Corfou",
    "Corfou & ZANTE",
    "CORFOU & ALBANIE"
  ],
  [
    "IONIENNES",
    "ATHèNES",
    "ATHèNES & IONIENNES",
    "ATHèNES & CYCLADES",
    "ATHèNES & Péloponnèse",
    "ATHèNES & Grèce continentale",
    "ATHèNES & Athènes et Attique"
  ],
  [
    "CYCLADES",
    "ATHèNES",
    "ATHèNES & CYCLADES",
    "ATHèNES & IONIENNES",
    "ATHèNES & Péloponnèse",
    "ATHèNES & Grèce continentale",
    "ATHèNES & Athènes et Attique"
  ],
  [
    "ATHèNES",
    "ATHèNES & Grèce continentale",
    "Athènes et Attique",
    "ATHèNES & Athènes et Attique",
    "ATHèNES & Péloponnèse",
    "ZANTE & Péloponnèse",
    "ATHèNES & CYCLADES",
    "ATHèNES & IONIENNES",
    "Grèce continentale"
  ],
  [
    "HONGRIE",
    "BUDAPEST",
    "BUDAPEST & HONGRIE"
  ],
  [
    "Irlande du Nord",
    "DUBLIN",
    "DUBLIN & Irlande du Nord",
    "IRLANDE",
    "DUBLIN & IRLANDE",
    "Irlande du Nord & IRLANDE"
  ],
  [
    "TOSCANE",
    "ROME",
    "ROME & TOSCANE",
    "FLORENCE",
    "FLORENCE & TOSCANE",
    "Latium",
    "FLORENCE & Latium",
    "ROME & Latium",
    "FLORENCE & ROME",
    "NAPLES & ROME",
    "CINQUE TERRE & TOSCANE"
  ],
  [
    "Côte Amalfitaine",
    "NAPLES",
    "NAPLES & Côte Amalfitaine",
    "NAPLES & ROME",
    "NAPLES & APENNINS",
    "NAPLES & POUILLES & CALABRE"
  ],
  [
    "SICILE",
    "Palerme",
    "Palerme & SICILE",
    "SALINA",
    "Palerme & SALINA",
    "SALINA & SICILE"
  ],
  [
    "PIÉMONT",
    "Turin",
    "Turin & PIÉMONT",
    "Turin & Milan"
  ],
  [
    "Lombardie",
    "Milan",
    "Milan & Lombardie",
    "VéRONE & Lombardie",
    "VéRONE & Milan",
    "Turin & Milan"
  ],
  [
    "Dolomites",
    "Venise",
    "Venise & Dolomites",
    "Vénétie",
    "Venise & Vénétie",
    "VéRONE",
    "VéRONE & Vénétie",
    "VéRONE & Venise",
    "VéRONE & Dolomites",
    "VéRONE & Milan",
    "Vénétie & Dolomites"
  ],
  [
    "CINQUE TERRE",
    "Florence",
    "Florence & CINQUE TERRE",
    "Bologne & CINQUE TERRE",
    "Bologne & Florence",
    "Bologne",
    "CINQUE TERRE & TOSCANE"
  ],
  [
    "Bologne & APENNINS",
    "Bologne",
    "APENNINS",
    "Bologne & CINQUE TERRE",
    "Bologne & Florence",
    "NAPLES & APENNINS"
  ],
  [
    "CALABRE",
    "POUILLES",
    "POUILLES & CALABRE",
    "NAPLES & POUILLES & CALABRE",
    "NAPLES & CALABRE",
    "NAPLES",
    "NAPLES & POUILLES"
  ],
  [
    "Norvège",
    "Bergen",
    "Bergen & Norvège",
    "LOFOTEN",
    "Tromsø",
    "Tromsø & LOFOTEN"
  ],
  [
    "PAYS-BAS",
    "AMSTERDAM",
    "AMSTERDAM & PAYS-BAS"
  ],
  [
    "POLOGNE",
    "Cracovie",
    "Cracovie & POLOGNE"
  ],
  [
    "ALGARVE",
    "Alentejo",
    "Alentejo & ALGARVE",
    "LISBONNE & Alentejo",
    "Albufeira",
    "Albufeira & ALGARVE",
    "Albufeira & LISBONNE"
  ],
  [
    "LISBONNE & Alentejo",
    "LISBONNE",
    "LISBONNE & Açores",
    "LISBONNE & Madère",
    "Lisbonne et région (Centre)",
    "LISBONNE & Lisbonne et région (Centre)",
    "Albufeira & LISBONNE",
    "PORTO & LISBONNE"
  ],
  [
    "PORTO",
    "PORTO & Açores",
    "PORTO & Madère",
    "Nord portugais",
    "PORTO & Nord portugais",
    "PORTO & LISBONNE"
  ],
  [
    "Açores",
    "PORTO & Açores",
    "LISBONNE & Açores"
  ],
  [
    "Madère",
    "PORTO & Madère",
    "LISBONNE & Madère"
  ],
  [
    "République tchèque",
    "PRAGUE",
    "PRAGUE & République tchèque"
  ],
  [
    "ROUMANIE",
    "BUCAREST",
    "BUCAREST & ROUMANIE",
    "Transylvanie",
    "BUCAREST & Transylvanie"
  ],
  [
    "Suède",
    "STOCKHOLM",
    "STOCKHOLM & Suède"
  ],
  [
    "SUISSE",
    "Zermatt",
    "LUCERNE",
    "LUCERNE & Zermatt",
    "Zermatt & SUISSE",
    "LUCERNE & SUISSE"
  ],
  [
    "ARABIE SAOUDITE",
    "Riyad",
    "Riyad & ARABIE SAOUDITE"
  ],
  [
    "Dubaï & OMAN",
    "OMAN"
  ],
  [
    "QATAR",
    "Bahreïn & QATAR",
    "Bahreïn"
  ],
  [
    "TURQUIE",
    "ISTANBUL",
    "ISTANBUL & TURQUIE",
    "Cappadoce",
    "ISTANBUL & Cappadoce",
    "Riviera turque",
    "ISTANBUL & Riviera turque",
    "Côte égéenne",
    "ISTANBUL & Côte égéenne",
    "Côte égéenne & Cappadoce",
    "Riviera turque & Cappadoce"
  ],
  [
    "EST AUSTRALIEN",
    "SYDNEY",
    "Melbourne & EST AUSTRALIEN",
    "OUEST AUSTRALIEN",
    "SYDNEY & OUEST AUSTRALIEN",
    "Melbourne",
    "Melbourne & OUEST AUSTRALIEN",
    "Melbourne & TASMANIE",
    "AUSTRALIE",
    "Melbourne & AUSTRALIE",
    "SYDNEY & AUSTRALIE",
    "NORD AUSTRALIEN",
    "Queensland",
    "Queensland & NORD AUSTRALIEN",
    "Queensland & EST AUSTRALIEN",
    "SYDNEY & EST AUSTRALIEN"
  ],
  [
    "TASMANIE",
    "SYDNEY & TASMANIE",
    "Melbourne & TASMANIE"
  ]
];
export default destinationGroups;
