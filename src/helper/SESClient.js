const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({ 
  region: process.env.S3_REGION,
  credentials: { accessKeyId: process.env.S3_KEY, secretAccessKey: process.env.S3_PASSWORD }
});

async function EnviarEmail(emailDestino, titulo, resumo, conteudo) {

  console.log(process.env.S3_KEY);
  const params = {
    Destination: { ToAddresses: [emailDestino] },
    Message: { Body: { Html: { Charset: 'UTF-8', Data: conteudo } }, Subject: { Data: titulo } },
    Source: 'wpdcastro@gmail.com',
    ReplyToAddresses: [emailDestino]
  };

  try {
    console.log("Teste de envio de email")
    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);
    console.log(result)
    console.log(`E-mail enviado para ${emailDestino}. ID de mensagem: ${result.MessageId}`);
  } catch (err) {
    console.log(err)
    console.error(`Erro ao enviar e-mail para ${emailDestino}: ${err}`);
    throw new Error(err);
  }
}

module.exports = { EnviarEmail }