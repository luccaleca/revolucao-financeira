const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3333;


// CORS permissivo para desenvolvimento
app.use(cors({
  origin: true, // Permite qualquer origem
  credentials: true
}));

app.use(express.json());

const mensagensPath = path.join(__dirname, 'bot-mensagens.json');

// Salvar mensagens agendadas do bot
app.post('/api/bot-mensagens', (req, res) => {
  try {
    console.log('📝 Salvando mensagens:', req.body);
    fs.writeFileSync(mensagensPath, JSON.stringify(req.body, null, 2));
    res.json({ ok: true, message: 'Mensagens salvas com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao salvar:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Ler mensagens agendadas do bot
app.get('/api/bot-mensagens', (req, res) => {
  try {
    console.log('📖 Carregando mensagens...');
    if (fs.existsSync(mensagensPath)) {
      const data = fs.readFileSync(mensagensPath, 'utf8');
      const mensagens = JSON.parse(data);
      console.log(`✅ ${mensagens.length} mensagens carregadas`);
      res.json(mensagens);
    } else {
      console.log('📄 Arquivo não existe, retornando array vazio');
      res.json([]);
    }
  } catch (error) {
    console.error('❌ Erro ao carregar:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando!', timestamp: new Date().toISOString() });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
  console.log(`📱 Acesse: http://localhost:${PORT}`);
  console.log(`🧪 Teste: http://localhost:${PORT}/api/test`);
});