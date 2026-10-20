/**
 * Velas na Escuridão — Dados Reais da PeNSE 2024 (IBGE)
 * Tabela 12.1.1 (Brasil, Grandes Regiões e UFs) e Tabela 12.1.3 (Municípios das Capitais)
 * Percentual de escolares de 13 a 17 anos que não têm amigos próximos.
 */

const PENSE_DATABASE = {
  "brasil": {
    "id": "brasil",
    "name": "Brasil",
    "category": "Nacional",
    "total": 6.1,
    "total_ci": [
      5.6,
      6.6
    ],
    "homem": 6.5,
    "homem_ci": [
      5.8,
      7.3
    ],
    "mulher": 5.7,
    "mulher_ci": [
      4.9,
      6.5
    ],
    "publica": 6.3,
    "publica_ci": [
      5.8,
      6.9
    ],
    "privada": 3.4,
    "privada_ci": [
      2.9,
      3.9
    ]
  },
  "norte": {
    "id": "norte",
    "name": "Norte",
    "category": "Nacional",
    "total": 4.5,
    "total_ci": [
      3.7,
      5.2
    ],
    "homem": 5.1,
    "homem_ci": [
      3.9,
      6.2
    ],
    "mulher": 3.9,
    "mulher_ci": [
      2.9,
      4.8
    ],
    "publica": 4.6,
    "publica_ci": [
      3.9,
      5.4
    ],
    "privada": 2.5,
    "privada_ci": [
      1.5,
      3.5
    ]
  },
  "rondonia": {
    "id": "rondonia",
    "name": "Rondônia",
    "category": "UF",
    "total": 6.1,
    "total_ci": [
      5.1,
      7.1
    ],
    "homem": 6.1,
    "homem_ci": [
      4.6,
      7.6
    ],
    "mulher": 6.0,
    "mulher_ci": [
      4.5,
      7.6
    ],
    "publica": 6.3,
    "publica_ci": [
      5.2,
      7.3
    ],
    "privada": 2.6,
    "privada_ci": [
      1.3,
      3.8
    ]
  },
  "acre": {
    "id": "acre",
    "name": "Acre",
    "category": "UF",
    "total": 7.2,
    "total_ci": [
      6.0,
      8.4
    ],
    "homem": 7.4,
    "homem_ci": [
      5.9,
      8.9
    ],
    "mulher": 6.9,
    "mulher_ci": [
      5.5,
      8.3
    ],
    "publica": 7.4,
    "publica_ci": [
      6.1,
      8.7
    ],
    "privada": 3.6,
    "privada_ci": [
      2.3,
      4.9
    ]
  },
  "amazonas": {
    "id": "amazonas",
    "name": "Amazonas",
    "category": "UF",
    "total": 7.3,
    "total_ci": [
      6.0,
      8.7
    ],
    "homem": 8.5,
    "homem_ci": [
      6.5,
      10.4
    ],
    "mulher": 6.1,
    "mulher_ci": [
      4.5,
      7.7
    ],
    "publica": 7.6,
    "publica_ci": [
      6.2,
      9.0
    ],
    "privada": 2.0,
    "privada_ci": [
      1.3,
      2.8
    ]
  },
  "roraima": {
    "id": "roraima",
    "name": "Roraima",
    "category": "UF",
    "total": 5.9,
    "total_ci": [
      5.0,
      6.9
    ],
    "homem": 6.3,
    "homem_ci": [
      4.9,
      7.7
    ],
    "mulher": 5.6,
    "mulher_ci": [
      4.1,
      7.1
    ],
    "publica": 6.2,
    "publica_ci": [
      5.2,
      7.2
    ],
    "privada": 3.7,
    "privada_ci": [
      2.9,
      4.5
    ]
  },
  "para": {
    "id": "para",
    "name": "Pará",
    "category": "UF",
    "total": 5.1,
    "total_ci": [
      4.2,
      6.1
    ],
    "homem": 5.5,
    "homem_ci": [
      4.2,
      6.9
    ],
    "mulher": 4.7,
    "mulher_ci": [
      3.5,
      5.9
    ],
    "publica": 5.2,
    "publica_ci": [
      4.1,
      6.2
    ],
    "privada": 4.5,
    "privada_ci": [
      3.5,
      5.4
    ]
  },
  "amapa": {
    "id": "amapa",
    "name": "Amapá",
    "category": "UF",
    "total": 5.9,
    "total_ci": [
      4.9,
      6.9
    ],
    "homem": 6.7,
    "homem_ci": [
      4.9,
      8.6
    ],
    "mulher": 5.0,
    "mulher_ci": [
      3.8,
      6.1
    ],
    "publica": 6.1,
    "publica_ci": [
      5.0,
      7.2
    ],
    "privada": 2.8,
    "privada_ci": [
      2.0,
      3.6
    ]
  },
  "tocantins": {
    "id": "tocantins",
    "name": "Tocantins",
    "category": "UF",
    "total": 4.8,
    "total_ci": [
      4.4,
      5.2
    ],
    "homem": 5.2,
    "homem_ci": [
      4.6,
      5.8
    ],
    "mulher": 4.4,
    "mulher_ci": [
      3.9,
      5.0
    ],
    "publica": 5.1,
    "publica_ci": [
      4.7,
      5.6
    ],
    "privada": 2.6,
    "privada_ci": [
      2.4,
      2.9
    ]
  },
  "nordeste": {
    "id": "nordeste",
    "name": "Nordeste",
    "category": "Nacional",
    "total": 5.0,
    "total_ci": [
      4.0,
      6.0
    ],
    "homem": 5.1,
    "homem_ci": [
      3.7,
      6.5
    ],
    "mulher": 4.9,
    "mulher_ci": [
      3.7,
      6.1
    ],
    "publica": 5.2,
    "publica_ci": [
      4.1,
      6.3
    ],
    "privada": 2.8,
    "privada_ci": [
      2.0,
      3.7
    ]
  },
  "maranhao": {
    "id": "maranhao",
    "name": "Maranhão",
    "category": "UF",
    "total": 4.3,
    "total_ci": [
      3.4,
      5.2
    ],
    "homem": 4.9,
    "homem_ci": [
      3.4,
      6.4
    ],
    "mulher": 3.8,
    "mulher_ci": [
      2.4,
      5.2
    ],
    "publica": 4.5,
    "publica_ci": [
      3.4,
      5.5
    ],
    "privada": 3.2,
    "privada_ci": [
      2.2,
      4.2
    ]
  },
  "piaui": {
    "id": "piaui",
    "name": "Piauí",
    "category": "UF",
    "total": 5.6,
    "total_ci": [
      4.2,
      7.1
    ],
    "homem": 6.5,
    "homem_ci": [
      4.0,
      9.0
    ],
    "mulher": 4.8,
    "mulher_ci": [
      3.1,
      6.4
    ],
    "publica": 6.0,
    "publica_ci": [
      4.4,
      7.7
    ],
    "privada": 2.8,
    "privada_ci": [
      2.1,
      3.4
    ]
  },
  "ceara": {
    "id": "ceara",
    "name": "Ceará",
    "category": "UF",
    "total": 4.4,
    "total_ci": [
      3.2,
      5.6
    ],
    "homem": 3.6,
    "homem_ci": [
      2.1,
      5.1
    ],
    "mulher": 5.3,
    "mulher_ci": [
      2.7,
      7.9
    ],
    "publica": 4.9,
    "publica_ci": [
      3.4,
      6.4
    ],
    "privada": 2.3,
    "privada_ci": [
      1.6,
      3.0
    ]
  },
  "rio_grande_do_norte": {
    "id": "rio_grande_do_norte",
    "name": "Rio Grande do Norte",
    "category": "UF",
    "total": 4.3,
    "total_ci": [
      3.1,
      5.5
    ],
    "homem": 5.0,
    "homem_ci": [
      3.5,
      6.6
    ],
    "mulher": 3.6,
    "mulher_ci": [
      2.3,
      4.9
    ],
    "publica": 4.6,
    "publica_ci": [
      3.2,
      6.1
    ],
    "privada": 2.7,
    "privada_ci": [
      2.1,
      3.3
    ]
  },
  "paraiba": {
    "id": "paraiba",
    "name": "Paraíba",
    "category": "UF",
    "total": 4.1,
    "total_ci": [
      3.1,
      5.1
    ],
    "homem": 5.1,
    "homem_ci": [
      3.4,
      6.7
    ],
    "mulher": 3.3,
    "mulher_ci": [
      2.2,
      4.4
    ],
    "publica": 4.5,
    "publica_ci": [
      3.3,
      5.7
    ],
    "privada": 2.4,
    "privada_ci": [
      1.8,
      3.0
    ]
  },
  "pernambuco": {
    "id": "pernambuco",
    "name": "Pernambuco",
    "category": "UF",
    "total": 5.0,
    "total_ci": [
      4.1,
      5.9
    ],
    "homem": 6.2,
    "homem_ci": [
      4.7,
      7.6
    ],
    "mulher": 3.9,
    "mulher_ci": [
      3.0,
      4.7
    ],
    "publica": 5.4,
    "publica_ci": [
      4.4,
      6.4
    ],
    "privada": 2.9,
    "privada_ci": [
      2.0,
      3.8
    ]
  },
  "alagoas": {
    "id": "alagoas",
    "name": "Alagoas",
    "category": "UF",
    "total": 5.2,
    "total_ci": [
      4.5,
      5.9
    ],
    "homem": 6.1,
    "homem_ci": [
      5.1,
      7.2
    ],
    "mulher": 4.3,
    "mulher_ci": [
      3.3,
      5.3
    ],
    "publica": 5.6,
    "publica_ci": [
      4.8,
      6.5
    ],
    "privada": 3.2,
    "privada_ci": [
      2.5,
      4.0
    ]
  },
  "sergipe": {
    "id": "sergipe",
    "name": "Sergipe",
    "category": "UF",
    "total": 4.7,
    "total_ci": [
      3.9,
      5.5
    ],
    "homem": 4.4,
    "homem_ci": [
      3.5,
      5.3
    ],
    "mulher": 5.1,
    "mulher_ci": [
      3.7,
      6.4
    ],
    "publica": 5.1,
    "publica_ci": [
      4.2,
      6.1
    ],
    "privada": 2.5,
    "privada_ci": [
      1.8,
      3.1
    ]
  },
  "bahia": {
    "id": "bahia",
    "name": "Bahia",
    "category": "UF",
    "total": 4.1,
    "total_ci": [
      3.5,
      4.7
    ],
    "homem": 4.5,
    "homem_ci": [
      3.8,
      5.3
    ],
    "mulher": 3.6,
    "mulher_ci": [
      2.9,
      4.3
    ],
    "publica": 4.5,
    "publica_ci": [
      3.8,
      5.2
    ],
    "privada": 2.2,
    "privada_ci": [
      1.8,
      2.7
    ]
  },
  "sudeste": {
    "id": "sudeste",
    "name": "Sudeste",
    "category": "Nacional",
    "total": 4.0,
    "total_ci": [
      3.2,
      4.8
    ],
    "homem": 4.3,
    "homem_ci": [
      3.1,
      5.4
    ],
    "mulher": 3.8,
    "mulher_ci": [
      2.7,
      4.8
    ],
    "publica": 4.3,
    "publica_ci": [
      3.4,
      5.1
    ],
    "privada": 2.3,
    "privada_ci": [
      1.6,
      3.0
    ]
  },
  "minas_gerais": {
    "id": "minas_gerais",
    "name": "Minas Gerais",
    "category": "UF",
    "total": 3.8,
    "total_ci": [
      2.6,
      4.9
    ],
    "homem": 3.6,
    "homem_ci": [
      1.7,
      5.4
    ],
    "mulher": 4.0,
    "mulher_ci": [
      2.0,
      6.0
    ],
    "publica": 3.9,
    "publica_ci": [
      2.6,
      5.3
    ],
    "privada": 2.6,
    "privada_ci": [
      1.7,
      3.5
    ]
  },
  "espirito_santo": {
    "id": "espirito_santo",
    "name": "Espírito Santo",
    "category": "UF",
    "total": 4.3,
    "total_ci": [
      3.6,
      5.0
    ],
    "homem": 4.5,
    "homem_ci": [
      3.3,
      5.6
    ],
    "mulher": 4.1,
    "mulher_ci": [
      3.1,
      5.1
    ],
    "publica": 5.0,
    "publica_ci": [
      4.0,
      6.0
    ],
    "privada": 2.4,
    "privada_ci": [
      1.7,
      3.2
    ]
  },
  "rio_de_janeiro": {
    "id": "rio_de_janeiro",
    "name": "Rio de Janeiro",
    "category": "UF",
    "total": 4.1,
    "total_ci": [
      3.1,
      5.0
    ],
    "homem": 4.7,
    "homem_ci": [
      3.5,
      6.0
    ],
    "mulher": 3.4,
    "mulher_ci": [
      2.3,
      4.5
    ],
    "publica": 4.6,
    "publica_ci": [
      3.3,
      5.8
    ],
    "privada": 2.1,
    "privada_ci": [
      1.4,
      2.8
    ]
  },
  "sao_paulo": {
    "id": "sao_paulo",
    "name": "São Paulo",
    "category": "UF",
    "total": 3.5,
    "total_ci": [
      2.9,
      4.1
    ],
    "homem": 3.1,
    "homem_ci": [
      2.4,
      3.9
    ],
    "mulher": 3.9,
    "mulher_ci": [
      3.1,
      4.7
    ],
    "publica": 3.8,
    "publica_ci": [
      3.1,
      4.4
    ],
    "privada": 1.9,
    "privada_ci": [
      1.5,
      2.3
    ]
  },
  "sul": {
    "id": "sul",
    "name": "Sul",
    "category": "Nacional",
    "total": 3.1,
    "total_ci": [
      2.2,
      4.1
    ],
    "homem": 3.6,
    "homem_ci": [
      2.3,
      4.8
    ],
    "mulher": 2.7,
    "mulher_ci": [
      1.6,
      3.8
    ],
    "publica": 3.4,
    "publica_ci": [
      2.3,
      4.4
    ],
    "privada": 1.8,
    "privada_ci": [
      1.2,
      2.5
    ]
  },
  "parana": {
    "id": "parana",
    "name": "Paraná",
    "category": "UF",
    "total": 3.7,
    "total_ci": [
      2.7,
      4.7
    ],
    "homem": 2.8,
    "homem_ci": [
      1.7,
      3.9
    ],
    "mulher": 4.7,
    "mulher_ci": [
      3.3,
      6.1
    ],
    "publica": 4.0,
    "publica_ci": [
      2.8,
      5.2
    ],
    "privada": 2.0,
    "privada_ci": [
      1.2,
      2.8
    ]
  },
  "santa_catarina": {
    "id": "santa_catarina",
    "name": "Santa Catarina",
    "category": "UF",
    "total": 3.8,
    "total_ci": [
      2.7,
      4.8
    ],
    "homem": 2.9,
    "homem_ci": [
      1.4,
      4.4
    ],
    "mulher": 4.6,
    "mulher_ci": [
      2.9,
      6.3
    ],
    "publica": 4.1,
    "publica_ci": [
      2.9,
      5.3
    ],
    "privada": 1.9,
    "privada_ci": [
      1.4,
      2.4
    ]
  },
  "rio_grande_do_sul": {
    "id": "rio_grande_do_sul",
    "name": "Rio Grande do Sul",
    "category": "UF",
    "total": 5.0,
    "total_ci": [
      4.5,
      5.5
    ],
    "homem": 5.7,
    "homem_ci": [
      4.9,
      6.6
    ],
    "mulher": 4.2,
    "mulher_ci": [
      3.4,
      5.0
    ],
    "publica": 5.4,
    "publica_ci": [
      4.8,
      6.0
    ],
    "privada": 2.5,
    "privada_ci": [
      2.1,
      2.9
    ]
  },
  "centro-oeste": {
    "id": "centro-oeste",
    "name": "Centro-Oeste",
    "category": "Nacional",
    "total": 5.7,
    "total_ci": [
      4.4,
      7.0
    ],
    "homem": 6.0,
    "homem_ci": [
      4.2,
      7.8
    ],
    "mulher": 5.3,
    "mulher_ci": [
      3.4,
      7.2
    ],
    "publica": 6.1,
    "publica_ci": [
      4.6,
      7.6
    ],
    "privada": 2.5,
    "privada_ci": [
      1.8,
      3.1
    ]
  },
  "mato_grosso_do_sul": {
    "id": "mato_grosso_do_sul",
    "name": "Mato Grosso do Sul",
    "category": "UF",
    "total": 6.2,
    "total_ci": [
      5.0,
      7.3
    ],
    "homem": 7.4,
    "homem_ci": [
      5.5,
      9.3
    ],
    "mulher": 4.8,
    "mulher_ci": [
      3.4,
      6.2
    ],
    "publica": 6.5,
    "publica_ci": [
      5.2,
      7.8
    ],
    "privada": 3.4,
    "privada_ci": [
      2.4,
      4.4
    ]
  },
  "mato_grosso": {
    "id": "mato_grosso",
    "name": "Mato Grosso",
    "category": "UF",
    "total": 4.3,
    "total_ci": [
      3.5,
      5.0
    ],
    "homem": 5.3,
    "homem_ci": [
      4.0,
      6.6
    ],
    "mulher": 3.2,
    "mulher_ci": [
      2.0,
      4.5
    ],
    "publica": 4.6,
    "publica_ci": [
      3.7,
      5.4
    ],
    "privada": 2.5,
    "privada_ci": [
      1.8,
      3.1
    ]
  },
  "goias": {
    "id": "goias",
    "name": "Goiás",
    "category": "UF",
    "total": 4.5,
    "total_ci": [
      3.2,
      5.8
    ],
    "homem": 4.2,
    "homem_ci": [
      2.4,
      6.0
    ],
    "mulher": 4.8,
    "mulher_ci": [
      3.0,
      6.6
    ],
    "publica": 5.3,
    "publica_ci": [
      3.6,
      7.0
    ],
    "privada": 2.1,
    "privada_ci": [
      1.4,
      2.7
    ]
  },
  "distrito_federal": {
    "id": "distrito_federal",
    "name": "Distrito Federal",
    "category": "UF",
    "total": 4.5,
    "total_ci": [
      3.2,
      5.8
    ],
    "homem": 4.2,
    "homem_ci": [
      2.4,
      6.0
    ],
    "mulher": 4.8,
    "mulher_ci": [
      3.0,
      6.6
    ],
    "publica": 5.3,
    "publica_ci": [
      3.6,
      7.0
    ],
    "privada": 2.1,
    "privada_ci": [
      1.4,
      2.7
    ]
  },
  "cap_porto_velho": {
    "id": "cap_porto_velho",
    "name": "Porto Velho",
    "category": "Capital",
    "total": 4.8,
    "total_ci": [
      3.4,
      6.2
    ],
    "homem": 4.7,
    "homem_ci": [
      2.4,
      7.0
    ],
    "mulher": 4.9,
    "mulher_ci": [
      3.2,
      6.5
    ],
    "publica": 5.3,
    "publica_ci": [
      3.6,
      6.9
    ],
    "privada": 2.3,
    "privada_ci": [
      0.7,
      4.0
    ]
  },
  "cap_rio_branco": {
    "id": "cap_rio_branco",
    "name": "Rio Branco",
    "category": "Capital",
    "total": 4.8,
    "total_ci": [
      3.7,
      5.9
    ],
    "homem": 4.5,
    "homem_ci": [
      3.0,
      5.9
    ],
    "mulher": 5.2,
    "mulher_ci": [
      3.7,
      6.7
    ],
    "publica": 5.2,
    "publica_ci": [
      3.9,
      6.4
    ],
    "privada": 2.6,
    "privada_ci": [
      1.2,
      4.0
    ]
  },
  "cap_manaus": {
    "id": "cap_manaus",
    "name": "Manaus",
    "category": "Capital",
    "total": 6.4,
    "total_ci": [
      5.2,
      7.6
    ],
    "homem": 6.7,
    "homem_ci": [
      5.1,
      8.3
    ],
    "mulher": 6.1,
    "mulher_ci": [
      4.6,
      7.7
    ],
    "publica": 6.8,
    "publica_ci": [
      5.5,
      8.1
    ],
    "privada": 3.6,
    "privada_ci": [
      2.2,
      5.0
    ]
  },
  "cap_boa_vista": {
    "id": "cap_boa_vista",
    "name": "Boa Vista",
    "category": "Capital",
    "total": 6.7,
    "total_ci": [
      5.2,
      8.1
    ],
    "homem": 8.3,
    "homem_ci": [
      5.5,
      11.1
    ],
    "mulher": 5.0,
    "mulher_ci": [
      3.4,
      6.6
    ],
    "publica": 7.1,
    "publica_ci": [
      5.5,
      8.7
    ],
    "privada": 2.0,
    "privada_ci": [
      1.3,
      2.8
    ]
  },
  "cap_belem": {
    "id": "cap_belem",
    "name": "Belém",
    "category": "Capital",
    "total": 5.6,
    "total_ci": [
      4.2,
      7.1
    ],
    "homem": 7.6,
    "homem_ci": [
      5.6,
      9.6
    ],
    "mulher": 3.5,
    "mulher_ci": [
      1.5,
      5.4
    ],
    "publica": 6.4,
    "publica_ci": [
      4.5,
      8.4
    ],
    "privada": 3.1,
    "privada_ci": [
      2.1,
      4.1
    ]
  },
  "cap_macapa": {
    "id": "cap_macapa",
    "name": "Macapá",
    "category": "Capital",
    "total": 4.7,
    "total_ci": [
      3.6,
      5.8
    ],
    "homem": 5.7,
    "homem_ci": [
      4.1,
      7.4
    ],
    "mulher": 3.8,
    "mulher_ci": [
      2.6,
      5.0
    ],
    "publica": 4.7,
    "publica_ci": [
      3.5,
      5.9
    ],
    "privada": 4.6,
    "privada_ci": [
      3.4,
      5.7
    ]
  },
  "cap_palmas": {
    "id": "cap_palmas",
    "name": "Palmas",
    "category": "Capital",
    "total": 5.2,
    "total_ci": [
      3.7,
      6.8
    ],
    "homem": 6.3,
    "homem_ci": [
      4.1,
      8.4
    ],
    "mulher": 4.3,
    "mulher_ci": [
      2.7,
      6.0
    ],
    "publica": 5.8,
    "publica_ci": [
      4.0,
      7.7
    ],
    "privada": 2.2,
    "privada_ci": [
      1.2,
      3.1
    ]
  },
  "cap_sao_luis": {
    "id": "cap_sao_luis",
    "name": "São Luís",
    "category": "Capital",
    "total": 5.0,
    "total_ci": [
      4.0,
      5.9
    ],
    "homem": 6.7,
    "homem_ci": [
      4.7,
      8.6
    ],
    "mulher": 3.6,
    "mulher_ci": [
      2.0,
      5.3
    ],
    "publica": 5.5,
    "publica_ci": [
      4.2,
      6.7
    ],
    "privada": 3.4,
    "privada_ci": [
      2.4,
      4.4
    ]
  },
  "cap_teresina": {
    "id": "cap_teresina",
    "name": "Teresina",
    "category": "Capital",
    "total": 4.8,
    "total_ci": [
      3.1,
      6.4
    ],
    "homem": 4.8,
    "homem_ci": [
      2.6,
      7.1
    ],
    "mulher": 4.7,
    "mulher_ci": [
      3.0,
      6.4
    ],
    "publica": 5.6,
    "publica_ci": [
      3.4,
      7.9
    ],
    "privada": 2.9,
    "privada_ci": [
      1.5,
      4.3
    ]
  },
  "cap_fortaleza": {
    "id": "cap_fortaleza",
    "name": "Fortaleza",
    "category": "Capital",
    "total": 6.0,
    "total_ci": [
      3.5,
      8.5
    ],
    "homem": 7.0,
    "homem_ci": [
      4.2,
      9.8
    ],
    "mulher": 5.1,
    "mulher_ci": [
      1.4,
      8.7
    ],
    "publica": 7.0,
    "publica_ci": [
      3.7,
      10.3
    ],
    "privada": 3.0,
    "privada_ci": [
      2.1,
      3.9
    ]
  },
  "cap_natal": {
    "id": "cap_natal",
    "name": "Natal",
    "category": "Capital",
    "total": 3.9,
    "total_ci": [
      3.0,
      4.8
    ],
    "homem": 5.3,
    "homem_ci": [
      3.8,
      6.9
    ],
    "mulher": 2.5,
    "mulher_ci": [
      1.6,
      3.4
    ],
    "publica": 4.6,
    "publica_ci": [
      3.3,
      5.9
    ],
    "privada": 2.6,
    "privada_ci": [
      1.8,
      3.5
    ]
  },
  "cap_joao_pessoa": {
    "id": "cap_joao_pessoa",
    "name": "João Pessoa",
    "category": "Capital",
    "total": 4.3,
    "total_ci": [
      3.2,
      5.4
    ],
    "homem": 3.9,
    "homem_ci": [
      2.6,
      5.1
    ],
    "mulher": 4.7,
    "mulher_ci": [
      3.0,
      6.5
    ],
    "publica": 5.5,
    "publica_ci": [
      3.9,
      7.2
    ],
    "privada": 2.0,
    "privada_ci": [
      1.1,
      2.9
    ]
  },
  "cap_recife": {
    "id": "cap_recife",
    "name": "Recife",
    "category": "Capital",
    "total": 3.7,
    "total_ci": [
      2.8,
      4.7
    ],
    "homem": 5.0,
    "homem_ci": [
      3.3,
      6.7
    ],
    "mulher": 2.4,
    "mulher_ci": [
      1.4,
      3.4
    ],
    "publica": 4.3,
    "publica_ci": [
      3.0,
      5.6
    ],
    "privada": 2.5,
    "privada_ci": [
      1.3,
      3.8
    ]
  },
  "cap_maceio": {
    "id": "cap_maceio",
    "name": "Maceió",
    "category": "Capital",
    "total": 6.2,
    "total_ci": [
      4.7,
      7.7
    ],
    "homem": 7.1,
    "homem_ci": [
      4.6,
      9.6
    ],
    "mulher": 5.3,
    "mulher_ci": [
      4.0,
      6.7
    ],
    "publica": 8.1,
    "publica_ci": [
      5.8,
      10.4
    ],
    "privada": 3.3,
    "privada_ci": [
      2.1,
      4.6
    ]
  },
  "cap_aracaju": {
    "id": "cap_aracaju",
    "name": "Aracaju",
    "category": "Capital",
    "total": 3.9,
    "total_ci": [
      3.3,
      4.5
    ],
    "homem": 3.6,
    "homem_ci": [
      2.5,
      4.8
    ],
    "mulher": 4.2,
    "mulher_ci": [
      2.9,
      5.4
    ],
    "publica": 4.2,
    "publica_ci": [
      3.5,
      4.9
    ],
    "privada": 3.5,
    "privada_ci": [
      2.5,
      4.6
    ]
  },
  "cap_salvador": {
    "id": "cap_salvador",
    "name": "Salvador",
    "category": "Capital",
    "total": 6.8,
    "total_ci": [
      5.5,
      8.1
    ],
    "homem": 7.5,
    "homem_ci": [
      4.2,
      10.8
    ],
    "mulher": 6.1,
    "mulher_ci": [
      3.8,
      8.4
    ],
    "publica": 8.4,
    "publica_ci": [
      6.6,
      10.2
    ],
    "privada": 3.1,
    "privada_ci": [
      2.2,
      4.1
    ]
  },
  "cap_belo_horizonte": {
    "id": "cap_belo_horizonte",
    "name": "Belo Horizonte",
    "category": "Capital",
    "total": 4.1,
    "total_ci": [
      3.0,
      5.1
    ],
    "homem": 5.1,
    "homem_ci": [
      3.4,
      6.7
    ],
    "mulher": 3.0,
    "mulher_ci": [
      1.6,
      4.4
    ],
    "publica": 4.8,
    "publica_ci": [
      3.4,
      6.2
    ],
    "privada": 2.1,
    "privada_ci": [
      1.3,
      2.8
    ]
  },
  "cap_vitoria": {
    "id": "cap_vitoria",
    "name": "Vitória",
    "category": "Capital",
    "total": 4.1,
    "total_ci": [
      3.3,
      5.0
    ],
    "homem": 4.9,
    "homem_ci": [
      3.5,
      6.2
    ],
    "mulher": 3.4,
    "mulher_ci": [
      2.3,
      4.5
    ],
    "publica": 5.0,
    "publica_ci": [
      3.8,
      6.3
    ],
    "privada": 2.2,
    "privada_ci": [
      1.6,
      2.7
    ]
  },
  "cap_rio_de_janeiro": {
    "id": "cap_rio_de_janeiro",
    "name": "Rio de Janeiro",
    "category": "Capital",
    "total": 4.5,
    "total_ci": [
      3.4,
      5.5
    ],
    "homem": 4.7,
    "homem_ci": [
      3.1,
      6.2
    ],
    "mulher": 4.3,
    "mulher_ci": [
      2.8,
      5.7
    ],
    "publica": 5.8,
    "publica_ci": [
      4.3,
      7.3
    ],
    "privada": 2.0,
    "privada_ci": [
      1.4,
      2.6
    ]
  },
  "cap_sao_paulo": {
    "id": "cap_sao_paulo",
    "name": "São Paulo",
    "category": "Capital",
    "total": 4.1,
    "total_ci": [
      3.0,
      5.1
    ],
    "homem": 4.3,
    "homem_ci": [
      2.8,
      5.9
    ],
    "mulher": 3.8,
    "mulher_ci": [
      2.4,
      5.1
    ],
    "publica": 4.7,
    "publica_ci": [
      3.4,
      6.1
    ],
    "privada": 2.1,
    "privada_ci": [
      1.5,
      2.7
    ]
  },
  "cap_curitiba": {
    "id": "cap_curitiba",
    "name": "Curitiba",
    "category": "Capital",
    "total": 3.5,
    "total_ci": [
      2.6,
      4.4
    ],
    "homem": 3.9,
    "homem_ci": [
      2.4,
      5.3
    ],
    "mulher": 3.1,
    "mulher_ci": [
      2.1,
      4.2
    ],
    "publica": 4.2,
    "publica_ci": [
      2.9,
      5.5
    ],
    "privada": 1.9,
    "privada_ci": [
      1.2,
      2.7
    ]
  },
  "cap_florianopolis": {
    "id": "cap_florianopolis",
    "name": "Florianópolis",
    "category": "Capital",
    "total": 2.8,
    "total_ci": [
      2.2,
      3.5
    ],
    "homem": 2.9,
    "homem_ci": [
      1.9,
      3.9
    ],
    "mulher": 2.7,
    "mulher_ci": [
      1.7,
      3.8
    ],
    "publica": 3.4,
    "publica_ci": [
      2.4,
      4.3
    ],
    "privada": 1.9,
    "privada_ci": [
      1.0,
      2.7
    ]
  },
  "cap_porto_alegre": {
    "id": "cap_porto_alegre",
    "name": "Porto Alegre",
    "category": "Capital",
    "total": 4.2,
    "total_ci": [
      2.7,
      5.7
    ],
    "homem": 4.6,
    "homem_ci": [
      2.6,
      6.5
    ],
    "mulher": 3.9,
    "mulher_ci": [
      2.2,
      5.6
    ],
    "publica": 4.9,
    "publica_ci": [
      2.7,
      7.2
    ],
    "privada": 2.9,
    "privada_ci": [
      1.8,
      3.9
    ]
  },
  "cap_campo_grande": {
    "id": "cap_campo_grande",
    "name": "Campo Grande",
    "category": "Capital",
    "total": 5.0,
    "total_ci": [
      3.9,
      6.0
    ],
    "homem": 5.0,
    "homem_ci": [
      3.3,
      6.7
    ],
    "mulher": 4.9,
    "mulher_ci": [
      2.9,
      7.0
    ],
    "publica": 5.5,
    "publica_ci": [
      4.2,
      6.7
    ],
    "privada": 2.7,
    "privada_ci": [
      1.6,
      3.8
    ]
  },
  "cap_cuiaba": {
    "id": "cap_cuiaba",
    "name": "Cuiabá",
    "category": "Capital",
    "total": 5.2,
    "total_ci": [
      3.3,
      7.0
    ],
    "homem": 6.6,
    "homem_ci": [
      3.0,
      10.2
    ],
    "mulher": 3.7,
    "mulher_ci": [
      2.0,
      5.4
    ],
    "publica": 5.8,
    "publica_ci": [
      3.4,
      8.1
    ],
    "privada": 3.2,
    "privada_ci": [
      1.7,
      4.7
    ]
  },
  "cap_goiania": {
    "id": "cap_goiania",
    "name": "Goiânia",
    "category": "Capital",
    "total": 2.9,
    "total_ci": [
      2.0,
      3.8
    ],
    "homem": 4.1,
    "homem_ci": [
      2.6,
      5.6
    ],
    "mulher": 1.7,
    "mulher_ci": [
      0.7,
      2.7
    ],
    "publica": 3.1,
    "publica_ci": [
      1.7,
      4.5
    ],
    "privada": 2.6,
    "privada_ci": [
      1.6,
      3.5
    ]
  },
  "cap_brasilia": {
    "id": "cap_brasilia",
    "name": "Brasília",
    "category": "Capital",
    "total": 4.5,
    "total_ci": [
      3.2,
      5.8
    ],
    "homem": 4.2,
    "homem_ci": [
      2.4,
      6.0
    ],
    "mulher": 4.8,
    "mulher_ci": [
      3.0,
      6.6
    ],
    "publica": 5.3,
    "publica_ci": [
      3.6,
      7.0
    ],
    "privada": 2.1,
    "privada_ci": [
      1.4,
      2.7
    ]
  }
};

function createLocalityConfig(localityKey = 'brasil') {
  const loc = PENSE_DATABASE[localityKey] || PENSE_DATABASE['brasil'];
  const totalStudents = 1000; // 1 foco = 0,1 p.p.

  // Cálculo proporcional com base em 500 meninos e 500 meninas na amostra
  const solitaryBoys = Math.max(1, Math.round(500 * (loc.homem / 100)));
  const solitaryGirls = Math.max(1, Math.round(500 * (loc.mulher / 100)));
  const solitaryCount = solitaryBoys + solitaryGirls;

  const connectedBoys = 500 - solitaryBoys;
  const connectedGirls = 500 - solitaryGirls;
  const connectedCount = connectedBoys + connectedGirls;

  // Regra Estrutural do usuário: 1 fogueira para cada 10 solitários
  const groupCount = Math.max(1, Math.round(solitaryCount / 10));

  const avgPerGroup = connectedCount / groupCount;
  const orbitRadius = Math.min(85, Math.max(34, Math.sqrt(avgPerGroup) * 5.8));
  const avoidanceRadius = Math.min(110, Math.max(60, orbitRadius + 22));

  return {
    locality: loc,
    totalStudents: totalStudents,
    solitaryCount: solitaryCount,
    groupCount: groupCount,
    connectedCount: connectedCount,
    solitary: {
      girls: solitaryGirls,
      boys: solitaryBoys
    },
    connected: {
      girls: connectedGirls,
      boys: connectedBoys
    },
    colors: {
      connectedBoy: {
        rgb: "250, 204, 21",
        edge: "202, 138, 4",
        name: "Menino Conectado (Luz Amarela)",
        hex: "#facc15"
      },
      connectedGirl: {
        rgb: "248, 113, 113",
        edge: "185, 28, 28",
        name: "Menina Conectada (Luz Vermelha)",
        hex: "#f87171"
      },
      solitaryBoy: {
        rgb: "134, 239, 172",
        edge: "21, 128, 61",
        name: "Menino Solitário (Luz Esverdeada)",
        hex: "#86efac"
      },
      solitaryGirl: {
        rgb: "216, 180, 254",
        edge: "126, 34, 206",
        name: "Menina Solitária (Luz Roxa)",
        hex: "#d8b4fe"
      }
    },
    physics: {
      groupSpeedMin: 0.14,
      groupSpeedMax: 0.30,
      solitarySpeedMin: 0.18,
      solitarySpeedMax: 0.38,
      groupOrbitRadiusMax: orbitRadius,
      solitaryAvoidanceRadius: avoidanceRadius,
      solitaryMutualRadius: 38,
      mouseInfluenceRadius: 90
    }
  };
}

// Micro-narrativas da PeNSE 2024 para o Tooltip Interativo
const STUDENT_NARRATIVES = {
  solitaryGirl: [
    "Menina, 15 anos — «Sinto que ninguém na sala notaria se eu passasse o dia inteiro sem falar uma palavra.»",
    "Menina, 14 anos — Passa os intervalos na biblioteca para evitar a sensação de não ter onde sentar no pátio.",
    "Menina, 16 anos — «Tenho colegas com quem converso sobre tarefas, mas nenhuma amiga para contar quando choro.»",
    "Menina, 15 anos — Relata sentir-se incompreendida e desconectada da turma nos últimos 12 meses.",
    "Menina, 13 anos — Vê os grupos se formarem naturalmente, mas um nó na garganta a impede de se aproximar."
  ],
  solitaryBoy: [
    "Menino, 15 anos — «Fico quieto no meu canto com fone de ouvido para disfarçar que estou sozinho.»",
    "Menino, 16 anos — «Jogo bola quando falta gente, mas quando o jogo acaba cada um vai pro seu grupo e eu fico só.»",
    "Menino, 14 anos — Relata ausência de amigos íntimos para compartilhar medos ou dúvidas.",
    "Menino, 17 anos — Solidão que passa despercebida: notas boas, presença silenciosa, sem laços de afeto.",
    "Menino, 15 anos — Sente que precisa usar uma máscara de indiferença para lidar com o isolamento."
  ],
  campfires: [
    "Fogueira Coletiva — {count} estudantes reunidos: risadas no recreio, compartilhamento de lanches e cumplicidade juvenil.",
    "Fogueira Mista — {count} amigos que se protegem mutuamente das inseguranças do cotidiano escolar.",
    "Bando de {count} jovens — Pertencimento que dissipa o frio do corredor e traz calor às manhãs cinzentas.",
    "Círculo de {count} amigos — A sensação acolhedora de existir nos olhos do outro e ter para onde voltar."
  ]
};

window.PENSE_DATA = {
  database: PENSE_DATABASE,
  config: createLocalityConfig('brasil'),
  createLocalityConfig: createLocalityConfig,
  narratives: STUDENT_NARRATIVES,
  
  getRandomNarrative(gender, isSolitary, groupCount = 0) {
    if (isSolitary) {
      const list = gender === 'girl' 
        ? STUDENT_NARRATIVES.solitaryGirl 
        : STUDENT_NARRATIVES.solitaryBoy;
      return list[Math.floor(Math.random() * list.length)];
    } else {
      const template = STUDENT_NARRATIVES.campfires[Math.floor(Math.random() * STUDENT_NARRATIVES.campfires.length)];
      return template.replace('{count}', groupCount);
    }
  }
};
