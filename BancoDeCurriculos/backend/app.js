const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParse = require('body-parser');

const rotaCandidatos = require('./routes/candidatos');

app.use(morgan('dev'));
app.use(bodyParse.urlencoded({ extended: false}));// dados simples
app.use(bodyParse.json());// json de entrada no body

app.get("/formulario", (req, res)=>{
    res.sendFile(__dirname + "/html/index.html")
})

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, Content-Type, X=Requrested-With, Accept, Authorization'
        );
        if(req.method === 'OPTIONS'){
            res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).send({});
        }
        next();
})

app.use('/candidatos', rotaCandidatos);
// Quando não encontramos a rota
app.use((req,res,next) => {
    const erro = new Error('Arquivo não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req,res,next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            message: error.message
        }
    });
});
module.exports = app;
