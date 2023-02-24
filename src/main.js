import { ProductManager } from './ProductManager.js'


const um = new ProductManager('./database/products.json')
await um.reset()

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

