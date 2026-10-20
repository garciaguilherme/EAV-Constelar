const fs = require('fs');
const path = require('path');

// Tabela fornecida pelo usuário
const csvData = `Localidade,Nível,Região,Total (%),Total CV,Homem (%),Homem CV,Mulher (%),Mulher CV,Pública (%),Pública CV,Privada (%),Privada CV
Brasil,País,Brasil,"4,5","3,2","4,8","4,1","4,1","4,3","4,9","3,5","2,4","5,2"
Norte,Grande Região,Norte,"6,1","4,3","6,5",6,"5,7",7,"6,3","4,5","3,4","7,5"
Rondônia,UF,Norte,"4,5","8,3","5,1","11,7","3,9","12,1","4,6","8,7","2,5","20,8"
Acre,UF,Norte,"6,1","8,3","6,1","12,4",6,"13,2","6,3","8,5","2,6","25,1"
Amazonas,UF,Norte,"7,2","8,6","7,4","10,1","6,9","10,3","7,4","8,9","3,6","18,5"
Roraima,UF,Norte,"7,3","9,4","8,5","11,9","6,1","13,7","7,6","9,5",2,"18,1"
Pará,UF,Norte,"5,9","7,8","6,3","11,5","5,6","13,6","6,2","8,3","3,7","11,2"
Amapá,UF,Norte,"5,1","9,5","5,5","12,7","4,7",13,"5,2","10,4","4,5","10,7"
Tocantins,UF,Norte,"5,9","8,6","6,7","14,1",5,"11,9","6,1",9,"2,8","14,5"
Nordeste,Grande Região,Nordeste,"4,8","4,3","5,2",6,"4,4","6,1","5,1","4,6","2,6","5,1"
Maranhão,UF,Nordeste,5,"10,2","5,1","13,9","4,9","12,6","5,2","10,7","2,8","15,1"
Piauí,UF,Nordeste,"4,3","10,9","4,9","15,8","3,8","19,1","4,5","11,9","3,2","16,3"
Ceará,UF,Nordeste,"5,6",13,"6,5","19,7","4,8","17,6",6,"13,8","2,8","12,4"
Rio Grande do Norte,UF,Nordeste,"4,4","13,9","3,6","21,4","5,3","25,1","4,9","15,4","2,3","15,8"
Paraíba,UF,Nordeste,"4,3","14,2",5,"15,5","3,6","18,9","4,6","15,8","2,7","11,6"
Pernambuco,UF,Nordeste,"4,1","12,3","5,1","16,3","3,3","16,7","4,5","13,5","2,4","13,4"
Alagoas,UF,Nordeste,5,"8,9","6,2","11,7","3,9","11,7","5,4","9,7","2,9",16
Sergipe,UF,Nordeste,"5,2","6,8","6,1","8,9","4,3",12,"5,6","7,6","3,2","11,3"
Bahia,UF,Nordeste,"4,7","8,6","4,4","10,8","5,1","13,4","5,1","9,3","2,5","13,5"
Sudeste,Grande Região,Sudeste,"4,1","7,3","4,5","8,6","3,6","9,8","4,5","8,2","2,2","10,4"
Minas Gerais,UF,Sudeste,4,"9,9","4,3","13,7","3,8","14,8","4,3","10,7","2,3","15,8"
Espírito Santo,UF,Sudeste,"3,8","15,8","3,6","26,3",4,"25,3","3,9","17,2","2,6","17,6"
Rio de Janeiro,UF,Sudeste,"4,3","8,7","4,5","13,1","4,1",12,5,"9,9","2,4","15,8"
São Paulo,UF,Sudeste,"4,1","12,4","4,7","13,4","3,4","16,8","4,6","13,8","2,1","16,7"
Sul,Grande Região,Sul,"3,5","8,3","3,1","12,4","3,9","10,7","3,8",9,"1,9",10
Paraná,UF,Sul,"3,1","14,7","3,6",18,"2,7",21,"3,4",16,"1,8","17,3"
Santa Catarina,UF,Sul,"3,7","13,7","2,8","20,6","4,7","15,2",4,"14,9",2,"20,3"
Rio Grande do Sul,UF,Sul,"3,8","14,4","2,9","26,5","4,6","19,3","4,1","15,5","1,9",14
Centro-Oeste,Grande Região,Centro-Oeste,5,"5,3","5,7","7,5","4,2","9,3","5,4","5,7","2,5","7,7"
Mato Grosso do Sul,UF,Centro-Oeste,"5,7","11,7",6,"15,1","5,3","18,1","6,1","12,3","2,5","14,2"
Mato Grosso,UF,Centro-Oeste,"6,2","9,7","7,4","12,9","4,8","14,6","6,5","10,3","3,4","14,7"
Goiás,UF,Centro-Oeste,"4,3","8,8","5,3","12,8","3,2","19,2","4,6","9,5","2,5","13,2"
Distrito Federal,UF,Centro-Oeste,"4,5","14,7","4,2","21,9","4,8","19,5","5,3","16,6","2,1","16,4"`;

const keyMap = {
  'Brasil': { id: 'brasil', name: 'Brasil', category: 'Nacional' },
  'Norte': { id: 'norte', name: 'Norte', category: 'Nacional' },
  'Rondônia': { id: 'rondonia', name: 'Rondônia', category: 'UF' },
  'Acre': { id: 'acre', name: 'Acre', category: 'UF' },
  'Amazonas': { id: 'amazonas', name: 'Amazonas', category: 'UF' },
  'Roraima': { id: 'roraima', name: 'Roraima', category: 'UF' },
  'Pará': { id: 'para', name: 'Pará', category: 'UF' },
  'Amapá': { id: 'amapa', name: 'Amapá', category: 'UF' },
  'Tocantins': { id: 'tocantins', name: 'Tocantins', category: 'UF' },
  'Nordeste': { id: 'nordeste', name: 'Nordeste', category: 'Nacional' },
  'Maranhão': { id: 'maranhao', name: 'Maranhão', category: 'UF' },
  'Piauí': { id: 'piaui', name: 'Piauí', category: 'UF' },
  'Ceará': { id: 'ceara', name: 'Ceará', category: 'UF' },
  'Rio Grande do Norte': { id: 'rio_grande_do_norte', name: 'Rio Grande do Norte', category: 'UF' },
  'Paraíba': { id: 'paraiba', name: 'Paraíba', category: 'UF' },
  'Pernambuco': { id: 'pernambuco', name: 'Pernambuco', category: 'UF' },
  'Alagoas': { id: 'alagoas', name: 'Alagoas', category: 'UF' },
  'Sergipe': { id: 'sergipe', name: 'Sergipe', category: 'UF' },
  'Bahia': { id: 'bahia', name: 'Bahia', category: 'UF' },
  'Sudeste': { id: 'sudeste', name: 'Sudeste', category: 'Nacional' },
  'Minas Gerais': { id: 'minas_gerais', name: 'Minas Gerais', category: 'UF' },
  'Espírito Santo': { id: 'espirito_santo', name: 'Espírito Santo', category: 'UF' },
  'Rio de Janeiro': { id: 'rio_de_janeiro', name: 'Rio de Janeiro', category: 'UF' },
  'São Paulo': { id: 'sao_paulo', name: 'São Paulo', category: 'UF' },
  'Sul': { id: 'sul', name: 'Sul', category: 'Nacional' },
  'Paraná': { id: 'parana', name: 'Paraná', category: 'UF' },
  'Santa Catarina': { id: 'santa_catarina', name: 'Santa Catarina', category: 'UF' },
  'Rio Grande do Sul': { id: 'rio_grande_do_sul', name: 'Rio Grande do Sul', category: 'UF' },
  'Centro-Oeste': { id: 'centro-oeste', name: 'Centro-Oeste', category: 'Nacional' },
  'Mato Grosso do Sul': { id: 'mato_grosso_do_sul', name: 'Mato Grosso do Sul', category: 'UF' },
  'Mato Grosso': { id: 'mato_grosso', name: 'Mato Grosso', category: 'UF' },
  'Goiás': { id: 'goias', name: 'Goiás', category: 'UF' },
  'Distrito Federal': { id: 'distrito_federal', name: 'Distrito Federal', category: 'UF' }
};

function parseNum(val) {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  return parseFloat(val.toString().replace(/"/g, '').replace(',', '.').trim());
}

function calcCI(mean, cv) {
  const se = mean * (cv / 100);
  const low = Math.max(0, Math.round((mean - 1.96 * se) * 10) / 10);
  const high = Math.round((mean + 1.96 * se) * 10) / 10;
  return [low, high];
}

// 1. Processar dados da tabela CSV
function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const tableData = {};

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Respeitar aspas ao separar por vírgula
    const regex = /(?:,"|^")(""|[\w\W]*?)(?=",|"$)|(?:,(?!")|^(?!"))([^,]*?)(?=$|,)|(\r?\n)/g;
    const matches = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      if (match[1] !== undefined) {
        matches.push(match[1].replace(/""/g, '"'));
      } else if (match[2] !== undefined) {
        matches.push(match[2]);
      }
      if (regex.lastIndex >= line.length) break;
    }

    const row = matches;
    if (row.length < 13) continue;

    const locName = row[0].trim();
    const mapping = keyMap[locName];
    if (!mapping) {
      console.warn(`Localidade não mapeada: "${locName}"`);
      continue;
    }

    const total = parseNum(row[3]);
    const totalCV = parseNum(row[4]);
    const homem = parseNum(row[5]);
    const homemCV = parseNum(row[6]);
    const mulher = parseNum(row[7]);
    const mulherCV = parseNum(row[8]);
    const publica = parseNum(row[9]);
    const publicaCV = parseNum(row[10]);
    const privada = parseNum(row[11]);
    const privadaCV = parseNum(row[12]);

    tableData[mapping.id] = {
      id: mapping.id,
      name: mapping.name,
      category: mapping.category,
      total,
      total_ci: calcCI(total, totalCV),
      homem,
      homem_ci: calcCI(homem, homemCV),
      mulher,
      mulher_ci: calcCI(mulher, mulherCV),
      publica,
      publica_ci: calcCI(publica, publicaCV),
      privada,
      privada_ci: calcCI(privada, privadaCV),
      total_cv: totalCV,
      homem_cv: homemCV,
      mulher_cv: mulherCV,
      publica_cv: publicaCV,
      privada_cv: privadaCV
    };
  }
  return tableData;
}

// 2. Carregar dados atuais de js/data.js
const dataFilePath = path.join(__dirname, 'js', 'data.js');
const rawCode = fs.readFileSync(dataFilePath, 'utf8');

// Executar isoladamente o objeto PENSE_DATABASE
const sandbox = { window: {} };
const fn = new Function('sandbox', 'window', `
  ${rawCode}
  sandbox.PENSE_DATABASE = PENSE_DATABASE;
`);
fn(sandbox, sandbox.window);
const currentDb = sandbox.PENSE_DATABASE;

// 3. Comparar dados atuais com a tabela
const targetTable = parseCSV(csvData);
console.log('='.repeat(70));
console.log('VERIFICAÇÃO DE DADOS: js/data.js vs TABELA FORNECIDA');
console.log('='.repeat(70));

const discrepancies = [];
const checkedKeys = Object.keys(targetTable);

for (const key of checkedKeys) {
  const current = currentDb[key];
  const target = targetTable[key];

  if (!current) {
    discrepancies.push({ key, field: 'ENTIDADE_FALTANDO', current: null, target: target.name });
    continue;
  }

  const fields = ['total', 'homem', 'mulher', 'publica', 'privada'];
  for (const f of fields) {
    if (Math.abs(current[f] - target[f]) > 0.001) {
      discrepancies.push({
        key,
        name: target.name,
        field: f,
        current: current[f],
        target: target[f]
      });
    }
  }
}

if (discrepancies.length === 0) {
  console.log('✅ SUCESSO: Todos os dados das 33 localidades batem 100% com a tabela!');
} else {
  console.log(`❌ ENCONTRADAS ${discrepancies.length} DISCREPÂNCIAS!`);
  console.log('-'.repeat(70));
  
  // Agrupar por localidade para exibição clara
  const byLoc = {};
  for (const d of discrepancies) {
    if (!byLoc[d.name]) byLoc[d.name] = [];
    byLoc[d.name].push(`${d.field}: atual=${d.current} -> correto=${d.target}`);
  }

  for (const [name, diffs] of Object.entries(byLoc)) {
    console.log(`[${name}]:`);
    diffs.forEach(d => console.log(`   • ${d}`));
  }

  console.log('-'.repeat(70));
  console.log('APLICANDO ATUALIZAÇÃO EM js/data.js...');

  // 4. Atualizar js/data.js
  // Manter exatamente a estrutura e as capitais (que começam após distrito_federal)
  // Substituir os primeiros 33 itens de PENSE_DATABASE
  
  let newDbEntries = '';
  for (const key of checkedKeys) {
    const item = targetTable[key];
    newDbEntries += `  "${item.id}": {
    "id": "${item.id}",
    "name": "${item.name}",
    "category": "${item.category}",
    "total": ${item.total},
    "total_ci": [
      ${item.total_ci[0]},
      ${item.total_ci[1]}
    ],
    "homem": ${item.homem},
    "homem_ci": [
      ${item.homem_ci[0]},
      ${item.homem_ci[1]}
    ],
    "mulher": ${item.mulher},
    "mulher_ci": [
      ${item.mulher_ci[0]},
      ${item.mulher_ci[1]}
    ],
    "publica": ${item.publica},
    "publica_ci": [
      ${item.publica_ci[0]},
      ${item.publica_ci[1]}
    ],
    "privada": ${item.privada},
    "privada_ci": [
      ${item.privada_ci[0]},
      ${item.privada_ci[1]}
    ]
  },\n`;
  }

  // Localizar no arquivo onde começam os dados de "brasil" e onde começam "cap_porto_velho"
  const startMarker = '  "brasil": {';
  const endMarker = '  "cap_porto_velho": {';

  const startIndex = rawCode.indexOf(startMarker);
  const endIndex = rawCode.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1) {
    console.error('ERRO: Não foi possível localizar os marcadores em js/data.js!');
    process.exit(1);
  }

  const updatedCode = rawCode.substring(0, startIndex) + newDbEntries + rawCode.substring(endIndex);
  fs.writeFileSync(dataFilePath, updatedCode, 'utf8');
  console.log('✅ js/data.js foi atualizado com sucesso!');

  // 5. Atualizar build_data.py também se existir
  const buildDataPath = path.join(__dirname, 'build_data.py');
  if (fs.existsSync(buildDataPath)) {
    console.log('Atualizando também build_data.py para consistência...');
    // Criar raw_uf corrigido com as 33 linhas
    let rawUfLines = [];
    for (const key of checkedKeys) {
      const item = targetTable[key];
      // Format: Nome; Total; Total_ci0; Total_ci1; Homem; Homem_ci0; Homem_ci1; Mulher; Mulher_ci0; Mulher_ci1; Publica; Publica_ci0; Publica_ci1; Privada; Privada_ci0; Privada_ci1
      const fmt = (n) => n.toString().replace('.', ',');
      const line = `${item.name};   ${fmt(item.total)} ;   ${fmt(item.total_ci[0])} ;   ${fmt(item.total_ci[1])} ;   ${fmt(item.homem)} ;   ${fmt(item.homem_ci[0])} ;   ${fmt(item.homem_ci[1])} ;   ${fmt(item.mulher)} ;   ${fmt(item.mulher_ci[0])} ;   ${fmt(item.mulher_ci[1])} ;   ${fmt(item.publica)} ;   ${fmt(item.publica_ci[0])} ;   ${fmt(item.publica_ci[1])} ;   ${fmt(item.privada)} ;   ${fmt(item.privada_ci[0])} ;   ${fmt(item.privada_ci[1])}`;
      rawUfLines.push(line);
    }
    const buildCode = fs.readFileSync(buildDataPath, 'utf8');
    const rawUfStart = buildCode.indexOf('raw_uf = """');
    const rawUfEnd = buildCode.indexOf('"""\n\nraw_cap = """');
    if (rawUfStart !== -1 && rawUfEnd !== -1) {
      const newBuildCode = buildCode.substring(0, rawUfStart + 'raw_uf = """'.length) +
        rawUfLines.join('\n') +
        buildCode.substring(rawUfEnd);
      fs.writeFileSync(buildDataPath, newBuildCode, 'utf8');
      console.log('✅ build_data.py atualizado!');
    }
  }

  // 6. Verificação final pós-atualização
  console.log('='.repeat(70));
  console.log('RE-VERIFICAÇÃO FINAL...');
  console.log('='.repeat(70));
  const finalCode = fs.readFileSync(dataFilePath, 'utf8');
  const finalSandbox = { window: {} };
  new Function('sandbox', 'window', `
    ${finalCode}
    sandbox.PENSE_DATABASE = PENSE_DATABASE;
  `)(finalSandbox, finalSandbox.window);

  let finalDiscrepancies = 0;
  for (const key of checkedKeys) {
    const cur = finalSandbox.PENSE_DATABASE[key];
    const tgt = targetTable[key];
    for (const f of ['total', 'homem', 'mulher', 'publica', 'privada']) {
      if (Math.abs(cur[f] - tgt[f]) > 0.001) {
        finalDiscrepancies++;
      }
    }
  }

  if (finalDiscrepancies === 0) {
    console.log('🎉 SUCESSO ABSOLUTO: Todos os 165 valores numéricos de todas as 33 localidades foram corrigidos e agora coincidem perfeitamente com a tabela do PeNSE 2024!');
  } else {
    console.error(`Ainda restam ${finalDiscrepancies} discrepâncias.`);
  }
}
