const serverSocket = io(); 

import { ProductManager } from "../src/ProductManager";
const um = new ProductManager("./database/products.json");

const plantillaProducts = `
{{#if hayProductos}}
  <ul>
    {{#each productos}}
      <li>({{this.title}}) {{this.description}}: {{this.id}}</li>
    {{/each}}
  </ul>
{{else}}
  <p>no hay productos...</p>
{{/if}}
`;

const armarHtmlProductos = Handlebars.compile(plantillaProducts);

serverSocket.on("actualizarProdcutos", products => {
    const ulProductos = document.querySelector("#products");
    if (ulProductos) {
       ulProductos.innerHTML = JSON.stringify(products)
    }
});