const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./starter/modules/replaceTemplate');
/////////////////////////
// SERVER

const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, 'utf-8');
const tempCards = fs.readFileSync(`${__dirname}/starter/templates/template-cards.html`, 'utf-8');


const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`);
const readJSON = JSON.parse(data);
const slugs = readJSON.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);

  
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // OVERVIEW PAGE
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    
    const cardsHTML = readJSON.map(el => replaceTemplate(tempCards, el)).join('');
    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHTML);
    res.end(output);

  // PRODUCT PAGE
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = readJSON[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

  // API PAGE  
  } else if (pathname === '/api') {
      res.end(data);
  }
  
  // NOT FOUND PAGE  
   else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-server':'HELLO WORLD'
    });
    res.end("<h1>Page is not found!</h1>");
  }
});

server.listen('8000', '127.0.0.1', () => {
  console.log("Listening request on port 8000");
})