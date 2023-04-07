import { productManagerDB } from './ProductManagerDB'
import { Router } from 'express'

export const routerVistas = Router();

routerVistas.get('/productsDB', async (req, res, next) =>{
    const products = await productManagerDB.obtenerTodos()
    
    res.render('productsDB', {
        pageTitle: 'ProductsDB',
        hayProducts: productManagerDB.length > 0,
        products
    })
})