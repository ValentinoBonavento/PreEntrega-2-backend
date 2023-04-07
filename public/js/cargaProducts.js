const socket = io()

const formCargaProducts = document.querySelector('#formCargarProduct')

if (formCargaProducts instanceof HTMLFormElement){
    formCargaProducts.addEventListener('sumbit', event =>{
        event.preventDefault()
        const formData = new FormData(formCargaProducts)
        const data = {}
        formData.forEach((value, key) => (data[key] = value))

        fetch('api/products', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
    })
}

const armarListado = Handlebars.compile(`
{{#if hayProducts}}
    <ul>
        {{#each products}}
        <li>title: {{this.title}} precio: {{this.price}} descripcion: {{this.description}}</li>
        {{/each}}
    </ul>
    {{else}}
    <p>No hay productos</p>
    {{/if}}
`)

socket.on('products', products => {
    const hayProducts = products.lenght > 0
    const divLista = document.querySelector('#lista')
    if(divLista instanceof HTMLDivElement) {
        divLista.innerHTML = armarListado({
            products,
            hayProducts
        })
    }
})