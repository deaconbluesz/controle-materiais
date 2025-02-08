const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para processar dados do formulário
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir arquivos estáticos (CSS, imagens, etc.)
app.use('/public', express.static(path.join(__dirname, 'public'))); // Serve arquivos CSS
app.use('/assets', express.static(path.join(__dirname, 'assets'))); // Serve imagens

// Servir o arquivo HTML na raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para receber os dados do formulário
app.post('/salvar-dados', (req, res) => {
    const { matricula, sparePart } = req.body;

    if (!matricula || !sparePart) {
        return res.status(400).send('Matrícula e Spare Part são obrigatórios.');
    }

    // Cria um objeto com os dados
    const dados = {
        matricula,
        sparePart,
        data: new Date().toISOString()
    };

    // Salva os dados em um arquivo JSON
    const arquivoDados = path.join(__dirname, 'dados.json');
    fs.readFile(arquivoDados, (err, data) => {
        let json = [];
        if (!err) {
            json = JSON.parse(data); // Lê os dados existentes
        }
        json.push(dados); // Adiciona os novos dados

        // Escreve os dados atualizados no arquivo
        fs.writeFile(arquivoDados, JSON.stringify(json, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Erro ao salvar os dados.');
            }
            res.status(200).send('Dados salvos com sucesso!');
        });
    });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});