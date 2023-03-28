const serverSocket = io('http://localhost:8080');

const plantillaProducts = `
{{#if hayProductos}}
  <ul>
    {{#each productos}}
      <li>({{this.name}}) {{this.description}}: {{this.id}}</li>
    {{/each}}
  </ul>
{{else}}
  <p>no hay productos...</p>
{{/if}}
`;

const armarHtmlProductos = Handlebars.compile(plantillaProducts);

serverSocket.on('actualizarProducts', products => {
  const ulProductos = document.querySelector('#products');
  if (ulProductos) {
    ulProductos.innerHTML = armarHtmlProductos({
      hayProductos: products.length > 0,
      productos: products
    });
  }
});


