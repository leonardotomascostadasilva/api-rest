const app = require('./app');
const port = 3001;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log('http://localhost:3001/');
  
});
