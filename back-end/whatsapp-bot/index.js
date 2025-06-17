const wppconnect = require('@wppconnect-team/wppconnect');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'bot-config.json');
const mensagensPath = path.join(__dirname, 'bot-mensagens.json');

// Função para ler as mensagens agendadas
function getMensagensAgendadas() {
  if (fs.existsSync(mensagensPath)) {
    try {
      return JSON.parse(fs.readFileSync(mensagensPath, 'utf8'));
    } catch (error) {
      console.error('Erro ao ler mensagens agendadas:', error);
      return [];
    }
  }
  return [];
}

// Função para remover mensagem já enviada
function removerMensagemEnviada(msgParaRemover) {
  const mensagens = getMensagensAgendadas();
  const novas = mensagens.filter(
    msg =>
      !(
        msg.texto === msgParaRemover.texto &&
        msg.data === msgParaRemover.data &&
        msg.horario === msgParaRemover.horario &&
        msg.numeroDestino === msgParaRemover.numeroDestino
      )
  );
  fs.writeFileSync(mensagensPath, JSON.stringify(novas, null, 2));
  console.log(`✅ Mensagem enviada e removida: ${msgParaRemover.texto}`);
}

function getBotConfig() {
  try {
    const data = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [
      { numero: "1", titulo: "Próximas contas a pagar/receber", resposta: "Aqui você pode integrar com seu sistema para mostrar essas informações." },
      { numero: "2", titulo: "Análise de liquidez", resposta: "Aqui pode retornar gráficos ou análises financeiras." },
      { numero: "3", titulo: "Planejamento orçamentário", resposta: "Aqui pode apresentar relatórios e sugestões." },
      { numero: "4", titulo: "DRE", resposta: "Aqui pode retornar o Demonstrativo de Resultados do Exercício." }
    ];
  }
}

wppconnect.create({
  session: 'bot-session',
  catchQR: (base64Qr, asciiQR) => {
    console.log('📱 QR Code gerado! Escaneie com seu WhatsApp:');
    console.log(asciiQR);
  },
  statusFind: (statusSession, session) => {
    console.log('Status da sessão:', statusSession, '| Sessão:', session);
  }
})
.then((client) => start(client))
.catch((error) => console.error('❌ Erro ao iniciar WhatsApp:', error));

function start(client) {
  console.log('🤖 Bot WhatsApp iniciado com sucesso!');

  client.onMessage((message) => {
    if (message.isGroupMsg === false) { // Só responde mensagens privadas
      const opcoes = getBotConfig();

      let msgDeBoasVindas = 
        `Olá! 👋\n` +
        `Seja bem-vindo!\n` +
        `Eu sou um bot integrado ao software Revolução Financeira.\n\n` +
        `Menu de opções:\n`;

      opcoes.forEach(op => {
        msgDeBoasVindas += `${op.numero}️⃣ ${op.titulo}\n`;
      });
      msgDeBoasVindas += `\nDigite o número da opção desejada.`;

      // Responde conforme a configuração
      const op = opcoes.find(o => o.numero === message.body.trim());
      if (op) {
        client.sendText(message.from, op.resposta);
      } else {
        client.sendText(message.from, msgDeBoasVindas);
      }
    }
  });

  // Verificar mensagens agendadas a cada minuto
  setInterval(() => {
    const mensagens = getMensagensAgendadas();
    const agora = new Date();

    mensagens.forEach(msg => {
      try {
        const [ano, mes, dia] = msg.data.split('-');
        const [hora, minuto] = msg.horario.split(':');
        const dataMsg = new Date(ano, mes - 1, dia, hora, minuto);

        // Verifica se é o momento certo (tolerância de 1 minuto)
        if (
          agora.getFullYear() === dataMsg.getFullYear() &&
          agora.getMonth() === dataMsg.getMonth() &&
          agora.getDate() === dataMsg.getDate() &&
          agora.getHours() === dataMsg.getHours() &&
          agora.getMinutes() === dataMsg.getMinutes()
        ) {
          // Formatar número para WhatsApp
          const numeroFormatado = `${msg.numeroDestino}@c.us`;
          
          client.sendText(numeroFormatado, msg.texto)
            .then(() => {
              console.log(`✅ Mensagem enviada para ${msg.numeroDestino}: ${msg.texto}`);
              removerMensagemEnviada(msg);
            })
            .catch(error => {
              console.error(`❌ Erro ao enviar mensagem para ${msg.numeroDestino}:`, error);
            });
        }
      } catch (error) {
        console.error('❌ Erro ao processar mensagem agendada:', error);
      }
    });
  }, 60000); // Verifica a cada minuto
}