const serverSocket = io();

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

serverSocket.on('actualizarProducts', (productos) => {
  const divProductos = document.querySelector('#products');
  if (divProductos) {
    divProductos.innerHTML = armarHtmlProductos({
      productos,
      hayProductos: productos.length > 0,
    });
  }
});