import json

raw_uf = """Brasil;   6,1 ;   5,6 ;   6,6 ;   6,5 ;   5,8 ;   7,3 ;   5,7 ;   4,9 ;   6,5 ;   6,3 ;   5,8 ;   6,9 ;   3,4 ;   2,9 ;   3,9 
Norte;   4,5 ;   3,7 ;   5,2 ;   5,1 ;   3,9 ;   6,2 ;   3,9 ;   2,9 ;   4,8 ;   4,6 ;   3,9 ;   5,4 ;   2,5 ;   1,5 ;   3,5 
Rondônia;   6,1 ;   5,1 ;   7,1 ;   6,1 ;   4,6 ;   7,6 ;   6,0 ;   4,5 ;   7,6 ;   6,3 ;   5,2 ;   7,3 ;   2,6 ;   1,3 ;   3,8 
Acre;   7,2 ;   6,0 ;   8,4 ;   7,4 ;   5,9 ;   8,9 ;   6,9 ;   5,5 ;   8,3 ;   7,4 ;   6,1 ;   8,7 ;   3,6 ;   2,3 ;   4,9 
Amazonas;   7,3 ;   6,0 ;   8,7 ;   8,5 ;   6,5 ;   10,4 ;   6,1 ;   4,5 ;   7,7 ;   7,6 ;   6,2 ;   9,0 ;   2,0 ;   1,3 ;   2,8 
Roraima;   5,9 ;   5,0 ;   6,9 ;   6,3 ;   4,9 ;   7,7 ;   5,6 ;   4,1 ;   7,1 ;   6,2 ;   5,2 ;   7,2 ;   3,7 ;   2,9 ;   4,5 
Pará;   5,1 ;   4,2 ;   6,1 ;   5,5 ;   4,2 ;   6,9 ;   4,7 ;   3,5 ;   5,9 ;   5,2 ;   4,1 ;   6,2 ;   4,5 ;   3,5 ;   5,4 
Amapá;   5,9 ;   4,9 ;   6,9 ;   6,7 ;   4,9 ;   8,6 ;   5,0 ;   3,8 ;   6,1 ;   6,1 ;   5,0 ;   7,2 ;   2,8 ;   2,0 ;   3,6 
Tocantins;   4,8 ;   4,4 ;   5,2 ;   5,2 ;   4,6 ;   5,8 ;   4,4 ;   3,9 ;   5,0 ;   5,1 ;   4,7 ;   5,6 ;   2,6 ;   2,4 ;   2,9 
Nordeste;   5,0 ;   4,0 ;   6,0 ;   5,1 ;   3,7 ;   6,5 ;   4,9 ;   3,7 ;   6,1 ;   5,2 ;   4,1 ;   6,3 ;   2,8 ;   2,0 ;   3,7 
Maranhão;   4,3 ;   3,4 ;   5,2 ;   4,9 ;   3,4 ;   6,4 ;   3,8 ;   2,4 ;   5,2 ;   4,5 ;   3,4 ;   5,5 ;   3,2 ;   2,2 ;   4,2 
Piauí;   5,6 ;   4,2 ;   7,1 ;   6,5 ;   4,0 ;   9,0 ;   4,8 ;   3,1 ;   6,4 ;   6,0 ;   4,4 ;   7,7 ;   2,8 ;   2,1 ;   3,4 
Ceará;   4,4 ;   3,2 ;   5,6 ;   3,6 ;   2,1 ;   5,1 ;   5,3 ;   2,7 ;   7,9 ;   4,9 ;   3,4 ;   6,4 ;   2,3 ;   1,6 ;   3,0 
Rio Grande do Norte;   4,3 ;   3,1 ;   5,5 ;   5,0 ;   3,5 ;   6,6 ;   3,6 ;   2,3 ;   4,9 ;   4,6 ;   3,2 ;   6,1 ;   2,7 ;   2,1 ;   3,3 
Paraíba;   4,1 ;   3,1 ;   5,1 ;   5,1 ;   3,4 ;   6,7 ;   3,3 ;   2,2 ;   4,4 ;   4,5 ;   3,3 ;   5,7 ;   2,4 ;   1,8 ;   3,0 
Pernambuco;   5,0 ;   4,1 ;   5,9 ;   6,2 ;   4,7 ;   7,6 ;   3,9 ;   3,0 ;   4,7 ;   5,4 ;   4,4 ;   6,4 ;   2,9 ;   2,0 ;   3,8 
Alagoas;   5,2 ;   4,5 ;   5,9 ;   6,1 ;   5,1 ;   7,2 ;   4,3 ;   3,3 ;   5,3 ;   5,6 ;   4,8 ;   6,5 ;   3,2 ;   2,5 ;   4,0 
Sergipe;   4,7 ;   3,9 ;   5,5 ;   4,4 ;   3,5 ;   5,3 ;   5,1 ;   3,7 ;   6,4 ;   5,1 ;   4,2 ;   6,1 ;   2,5 ;   1,8 ;   3,1 
Bahia;   4,1 ;   3,5 ;   4,7 ;   4,5 ;   3,8 ;   5,3 ;   3,6 ;   2,9 ;   4,3 ;   4,5 ;   3,8 ;   5,2 ;   2,2 ;   1,8 ;   2,7 
Sudeste;   4,0 ;   3,2 ;   4,8 ;   4,3 ;   3,1 ;   5,4 ;   3,8 ;   2,7 ;   4,8 ;   4,3 ;   3,4 ;   5,1 ;   2,3 ;   1,6 ;   3,0 
Minas Gerais;   3,8 ;   2,6 ;   4,9 ;   3,6 ;   1,7 ;   5,4 ;   4,0 ;   2,0 ;   6,0 ;   3,9 ;   2,6 ;   5,3 ;   2,6 ;   1,7 ;   3,5 
Espírito Santo;   4,3 ;   3,6 ;   5,0 ;   4,5 ;   3,3 ;   5,6 ;   4,1 ;   3,1 ;   5,1 ;   5,0 ;   4,0 ;   6,0 ;   2,4 ;   1,7 ;   3,2 
Rio de Janeiro;   4,1 ;   3,1 ;   5,0 ;   4,7 ;   3,5 ;   6,0 ;   3,4 ;   2,3 ;   4,5 ;   4,6 ;   3,3 ;   5,8 ;   2,1 ;   1,4 ;   2,8 
São Paulo;   3,5 ;   2,9 ;   4,1 ;   3,1 ;   2,4 ;   3,9 ;   3,9 ;   3,1 ;   4,7 ;   3,8 ;   3,1 ;   4,4 ;   1,9 ;   1,5 ;   2,3 
Sul;   3,1 ;   2,2 ;   4,1 ;   3,6 ;   2,3 ;   4,8 ;   2,7 ;   1,6 ;   3,8 ;   3,4 ;   2,3 ;   4,4 ;   1,8 ;   1,2 ;   2,5 
Paraná;   3,7 ;   2,7 ;   4,7 ;   2,8 ;   1,7 ;   3,9 ;   4,7 ;   3,3 ;   6,1 ;   4,0 ;   2,8 ;   5,2 ;   2,0 ;   1,2 ;   2,8 
Santa Catarina;   3,8 ;   2,7 ;   4,8 ;   2,9 ;   1,4 ;   4,4 ;   4,6 ;   2,9 ;   6,3 ;   4,1 ;   2,9 ;   5,3 ;   1,9 ;   1,4 ;   2,4 
Rio Grande do Sul;   5,0 ;   4,5 ;   5,5 ;   5,7 ;   4,9 ;   6,6 ;   4,2 ;   3,4 ;   5,0 ;   5,4 ;   4,8 ;   6,0 ;   2,5 ;   2,1 ;   2,9 
Centro-Oeste;   5,7 ;   4,4 ;   7,0 ;   6,0 ;   4,2 ;   7,8 ;   5,3 ;   3,4 ;   7,2 ;   6,1 ;   4,6 ;   7,6 ;   2,5 ;   1,8 ;   3,1 
Mato Grosso do Sul;   6,2 ;   5,0 ;   7,3 ;   7,4 ;   5,5 ;   9,3 ;   4,8 ;   3,4 ;   6,2 ;   6,5 ;   5,2 ;   7,8 ;   3,4 ;   2,4 ;   4,4 
Mato Grosso;   4,3 ;   3,5 ;   5,0 ;   5,3 ;   4,0 ;   6,6 ;   3,2 ;   2,0 ;   4,5 ;   4,6 ;   3,7 ;   5,4 ;   2,5 ;   1,8 ;   3,1 
Goiás;   4,5 ;   3,2 ;   5,8 ;   4,2 ;   2,4 ;   6,0 ;   4,8 ;   3,0 ;   6,6 ;   5,3 ;   3,6 ;   7,0 ;   2,1 ;   1,4 ;   2,7 
Distrito Federal;   4,5 ;   3,2 ;   5,8 ;   4,2 ;   2,4 ;   6,0 ;   4,8 ;   3,0 ;   6,6 ;   5,3 ;   3,6 ;   7,0 ;   2,1 ;   1,4 ;   2,7"""

raw_cap = """Porto Velho;   4,8 ;   3,4 ;   6,2 ;   4,7 ;   2,4 ;   7,0 ;   4,9 ;   3,2 ;   6,5 ;   5,3 ;   3,6 ;   6,9 ;   2,3 ;   0,7 ;   4,0 
Rio Branco;   4,8 ;   3,7 ;   5,9 ;   4,5 ;   3,0 ;   5,9 ;   5,2 ;   3,7 ;   6,7 ;   5,2 ;   3,9 ;   6,4 ;   2,6 ;   1,2 ;   4,0 
Manaus;   6,4 ;   5,2 ;   7,6 ;   6,7 ;   5,1 ;   8,3 ;   6,1 ;   4,6 ;   7,7 ;   6,8 ;   5,5 ;   8,1 ;   3,6 ;   2,2 ;   5,0 
Boa Vista;   6,7 ;   5,2 ;   8,1 ;   8,3 ;   5,5 ;   11,1 ;   5,0 ;   3,4 ;   6,6 ;   7,1 ;   5,5 ;   8,7 ;   2,0 ;   1,3 ;   2,8 
Belém;   5,6 ;   4,2 ;   7,1 ;   7,6 ;   5,6 ;   9,6 ;   3,5 ;   1,5 ;   5,4 ;   6,4 ;   4,5 ;   8,4 ;   3,1 ;   2,1 ;   4,1 
Macapá;   4,7 ;   3,6 ;   5,8 ;   5,7 ;   4,1 ;   7,4 ;   3,8 ;   2,6 ;   5,0 ;   4,7 ;   3,5 ;   5,9 ;   4,6 ;   3,4 ;   5,7 
Palmas;   5,2 ;   3,7 ;   6,8 ;   6,3 ;   4,1 ;   8,4 ;   4,3 ;   2,7 ;   6,0 ;   5,8 ;   4,0 ;   7,7 ;   2,2 ;   1,2 ;   3,1 
São Luís;   5,0 ;   4,0 ;   5,9 ;   6,7 ;   4,7 ;   8,6 ;   3,6 ;   2,0 ;   5,3 ;   5,5 ;   4,2 ;   6,7 ;   3,4 ;   2,4 ;   4,4 
Teresina;   4,8 ;   3,1 ;   6,4 ;   4,8 ;   2,6 ;   7,1 ;   4,7 ;   3,0 ;   6,4 ;   5,6 ;   3,4 ;   7,9 ;   2,9 ;   1,5 ;   4,3 
Fortaleza;   6,0 ;   3,5 ;   8,5 ;   7,0 ;   4,2 ;   9,8 ;   5,1 ;   1,4 ;   8,7 ;   7,0 ;   3,7 ;   10,3 ;   3,0 ;   2,1 ;   3,9 
Natal;   3,9 ;   3,0 ;   4,8 ;   5,3 ;   3,8 ;   6,9 ;   2,5 ;   1,6 ;   3,4 ;   4,6 ;   3,3 ;   5,9 ;   2,6 ;   1,8 ;   3,5 
João Pessoa;   4,3 ;   3,2 ;   5,4 ;   3,9 ;   2,6 ;   5,1 ;   4,7 ;   3,0 ;   6,5 ;   5,5 ;   3,9 ;   7,2 ;   2,0 ;   1,1 ;   2,9 
Recife;   3,7 ;   2,8 ;   4,7 ;   5,0 ;   3,3 ;   6,7 ;   2,4 ;   1,4 ;   3,4 ;   4,3 ;   3,0 ;   5,6 ;   2,5 ;   1,3 ;   3,8 
Maceió;   6,2 ;   4,7 ;   7,7 ;   7,1 ;   4,6 ;   9,6 ;   5,3 ;   4,0 ;   6,7 ;   8,1 ;   5,8 ;   10,4 ;   3,3 ;   2,1 ;   4,6 
Aracaju;   3,9 ;   3,3 ;   4,5 ;   3,6 ;   2,5 ;   4,8 ;   4,2 ;   2,9 ;   5,4 ;   4,2 ;   3,5 ;   4,9 ;   3,5 ;   2,5 ;   4,6 
Salvador;   6,8 ;   5,5 ;   8,1 ;   7,5 ;   4,2 ;   10,8 ;   6,1 ;   3,8 ;   8,4 ;   8,4 ;   6,6 ;   10,2 ;   3,1 ;   2,2 ;   4,1 
Belo Horizonte;   4,1 ;   3,0 ;   5,1 ;   5,1 ;   3,4 ;   6,7 ;   3,0 ;   1,6 ;   4,4 ;   4,8 ;   3,4 ;   6,2 ;   2,1 ;   1,3 ;   2,8 
Vitória;   4,1 ;   3,3 ;   5,0 ;   4,9 ;   3,5 ;   6,2 ;   3,4 ;   2,3 ;   4,5 ;   5,0 ;   3,8 ;   6,3 ;   2,2 ;   1,6 ;   2,7 
Rio de Janeiro;   4,5 ;   3,4 ;   5,5 ;   4,7 ;   3,1 ;   6,2 ;   4,3 ;   2,8 ;   5,7 ;   5,8 ;   4,3 ;   7,3 ;   2,0 ;   1,4 ;   2,6 
São Paulo;   4,1 ;   3,0 ;   5,1 ;   4,3 ;   2,8 ;   5,9 ;   3,8 ;   2,4 ;   5,1 ;   4,7 ;   3,4 ;   6,1 ;   2,1 ;   1,5 ;   2,7 
Curitiba;   3,5 ;   2,6 ;   4,4 ;   3,9 ;   2,4 ;   5,3 ;   3,1 ;   2,1 ;   4,2 ;   4,2 ;   2,9 ;   5,5 ;   1,9 ;   1,2 ;   2,7 
Florianópolis;   2,8 ;   2,2 ;   3,5 ;   2,9 ;   1,9 ;   3,9 ;   2,7 ;   1,7 ;   3,8 ;   3,4 ;   2,4 ;   4,3 ;   1,9 ;   1,0 ;   2,7 
Porto Alegre;   4,2 ;   2,7 ;   5,7 ;   4,6 ;   2,6 ;   6,5 ;   3,9 ;   2,2 ;   5,6 ;   4,9 ;   2,7 ;   7,2 ;   2,9 ;   1,8 ;   3,9 
Campo Grande;   5,0 ;   3,9 ;   6,0 ;   5,0 ;   3,3 ;   6,7 ;   4,9 ;   2,9 ;   7,0 ;   5,5 ;   4,2 ;   6,7 ;   2,7 ;   1,6 ;   3,8 
Cuiabá;   5,2 ;   3,3 ;   7,0 ;   6,6 ;   3,0 ;   10,2 ;   3,7 ;   2,0 ;   5,4 ;   5,8 ;   3,4 ;   8,1 ;   3,2 ;   1,7 ;   4,7 
Goiânia;   2,9 ;   2,0 ;   3,8 ;   4,1 ;   2,6 ;   5,6 ;   1,7 ;   0,7 ;   2,7 ;   3,1 ;   1,7 ;   4,5 ;   2,6 ;   1,6 ;   3,5 
Brasília;   4,5 ;   3,2 ;   5,8 ;   4,2 ;   2,4 ;   6,0 ;   4,8 ;   3,0 ;   6,6 ;   5,3 ;   3,6 ;   7,0 ;   2,1 ;   1,4 ;   2,7"""

regioes = ['Brasil', 'Norte', 'Nordeste', 'Sudeste', 'Sul', 'Centro-Oeste']
database = {}

def slugify(text):
    s = text.lower().strip()
    replacements = {
        'á': 'a', 'ã': 'a', 'â': 'a', 'é': 'e', 'ê': 'e',
        'í': 'i', 'ó': 'o', 'ô': 'o', 'ú': 'u', 'ç': 'c',
        ' ': '_'
    }
    for k, v in replacements.items():
        s = s.replace(k, v)
    return s

def process(raw, cat_fn):
    for line in raw.strip().split('\n'):
        parts = [p.strip().replace(',', '.') for p in line.split(';')]
        if len(parts) >= 15 and parts[0]:
            name = parts[0]
            cat = cat_fn(name)
            key = slugify(name)
            if cat == 'Capital':
                key = 'cap_' + key
            database[key] = {
                'id': key,
                'name': name,
                'category': cat,
                'total': float(parts[1]),
                'total_ci': [float(parts[2]), float(parts[3])],
                'homem': float(parts[4]),
                'homem_ci': [float(parts[5]), float(parts[6])],
                'mulher': float(parts[7]),
                'mulher_ci': [float(parts[8]), float(parts[9])],
                'publica': float(parts[10]),
                'publica_ci': [float(parts[11]), float(parts[12])],
                'privada': float(parts[13]),
                'privada_ci': [float(parts[14]), float(parts[15])]
            }

process(raw_uf, lambda n: 'Nacional' if n in regioes else 'UF')
process(raw_cap, lambda n: 'Capital')

template = '''/**
 * Velas na Escuridão — Dados Reais da PeNSE 2024 (IBGE)
 * Tabela 12.1.1 (Brasil, Grandes Regiões e UFs) e Tabela 12.1.3 (Municípios das Capitais)
 * Percentual de escolares de 13 a 17 anos que não têm amigos próximos.
 */

const PENSE_DATABASE = %s;

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
        rgb: "255, 214, 112",
        edge: "217, 119, 6",
        name: "Menino Conectado (Luz Dourada)",
        hex: "#ffd670"
      },
      connectedGirl: {
        rgb: "255, 255, 255",
        edge: "226, 232, 240",
        name: "Menina Conectada (Luz Lunar)",
        hex: "#ffffff"
      },
      solitaryBoy: {
        rgb: "96, 165, 250",
        edge: "30, 58, 138",
        name: "Menino Solitário (Luz Azul)",
        hex: "#60a5fa"
      },
      solitaryGirl: {
        rgb: "192, 132, 252",
        edge: "88, 28, 135",
        name: "Menina Solitária (Luz Violeta)",
        hex: "#c084fc"
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
''' % json.dumps(database, ensure_ascii=False, indent=2)

with open('js/data.js', 'w', encoding='utf-8') as f:
    f.write(template)

print('SUCCESSFUL GENERATION OF js/data.js')
