import { ProductManager } from './ProductManager.js'
import { CartManager } from './CartManager.js'
import express from 'express'
import fs from 'fs'
import { Product } from './Product.js'
import { randomUUID } from 'crypto'
import { engine } from 'express-handlebars'
import { Server as SocketIOServer } from 'socket.io'




const um = new ProductManager('./database/products.json')
const um1 = new CartManager('./database/carts.json')
await um.reset()
await um1.reset()



try {

    await um.crearProducto({
        title: 'Pan',
        description: 'Salvado e integral',
        price: '900$',
        thumbnail: '',
        code: '0',
        stock: '20',
    })
    await um.crearProducto({
        title: 'Sal',
        description: 'Gruesa',
        price: '500$',
        thumbnail: '',
        code: '1',
        stock: '15',
    })
    await um.crearProducto({
        title: 'Pimienta',
        description: 'Negra',
        price: '600$',
        thumbnail: '',
        code: '2',
        stock: '7',
    })

    await um.buscarProductoId(1)

    await um.actualizarProductoId({
        title: 'Sal',
        description: 'Parrillera',
        price: '300$',
        thumbnail: '',
        code: '1',
        stock: '3',
        id: 2,
    })

    await um.eliminarProductId(2)



} catch (error) {
    console.log(error.message)
}

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/products', (req, res) => {
    const limit = req.query.limit
    fs.readFile('./database/products.json', 'utf-8', (err, info) => {
        if (err) throw err
        let products = JSON.parse(info)
        if (limit) {
            products = products.slice(0, limit)
        }
        res.json(products)
    })
})

app.get('/products/:id', (req, res) => {
    const id = req.params.id
    fs.readFile('./database/products.json', 'utf-8', (err, info) => {
        if (err) throw err
        let products = JSON.parse(info)
        const product = products.find(p => p.id.toString() === id.toString())
        if (product) {
            res.json(product)
        } else {
            res.status(404).send('No existe el producto con el ID solicitado')
        }
    })
})


app.post('/products', async (req, res) => {
    const { title, description, code, price, stock, thumbnail } = req.body;
    const product = new Product({
        id: randomUUID(),
        title,
        description,
        code,
        price,
        status: true,
        stock,
        thumbnail
    });
    const agregada = await um.crearProducto(product)
    res.json(agregada);
});

app.put('/products/:pid', async (req, res) => {
    let productNuevo
    try {
        productNuevo = new Product({
            id: req.params.pid,
            ...req.body
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
    
    try {
        const productReemplazada = await um.actualizarProductoId(parseInt(req.params.pid), productNuevo)
        res.json(productReemplazada)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})
app.delete('/products/:pid', async (req, res) => {
    const id = parseInt(req.params.pid)
    
    try {
        await um.eliminarProductId(id)
        res.status(204).send()
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})
app.engine('handlebars', engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

app.use(express.static('./public'))
const server = app.listen(8080)
const io = new SocketIOServer(server)

io.on('connection', async clientSocket => {
    

    
    clientSocket.on('nuevoProduct', async product => {
        
        await um.buscarProduct(product)
        const products = await um.buscarProduct()
        const productsParaFront = products.map(product => product.title)
        io.sockets.emit('actualizarProducts', productsParaFront)
    })

    const products = await um.buscarProduct()
    const productsParaFront = products.map(product => product.title)
    
    io.sockets.emit('actualizarProducts', productsParaFront)
})

app.get('/realTimeProducts', async (req, res) => {
    const realTimeProducts = await um.buscarProduct();
    const productsParaFront = realTimeProducts.map(product => `
    <li>
        <div>Title: ${product.title}</div>
    </li>
`).join('');
    console.log(productsParaFront);
    res.render('realTimeProducts', {
        pageTitle: 'realTimeProducts',
        productsList: productsParaFront
    });
});

