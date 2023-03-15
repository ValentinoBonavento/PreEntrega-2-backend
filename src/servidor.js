import express from 'express'
import { CartManager } from './CartManager.js'
import { randomUUID } from 'crypto'
import { Cart } from '/Cart.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const cartManager = new CartManager('./database/carts.json')

app.get('/cart/:cid', async (req, res) => {
    try {
        const persona = await cartManager.buscarCartSegunId(req.params.cid)
        res.json(persona)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
})

app.post('/cart', async (req, res) => {

    const cart = new Cart({
        id: randomUUID(),
        ...req.body
    })

    const agregada = await cartManager.guardarCart(cart)
    res.json(agregada)
})


app.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const carrito = await cartManager.buscarCartSegunId(cid);
        if (!carrito) {
            return res.status(404).json({ message: 'El carrito no existe' });
        }
        const productoExistente = carrito.products.find(p => p.product === pid);
        if (productoExistente) {
            productoExistente.quantity++;
        } else {
            const nuevoProducto = {
                product: pid,
                quantity: 1
            };
            carrito.products.push(nuevoProducto);
        }
        await cartManager.guardarCart(carrito);
        res.json(carrito);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const server = app.listen(8080)