import mongoose from 'mongoose'

const schemaProducts = new mongoose.Schema({
    title: { type: String, required: true},
    description: { type: String, required: true},
    price: { type: String, required: true},
    thumbnail: { type: String}, 
    code: { type: String, required: true},
    stock: { type: String, required: true}
}, {versionKey: false})

class ProductManagerDB {
    #productosDB
    constructor(){
        this.#productosDB = mongoose.model('productos', schemaProducts)
    }
    async guardar(datosP) {
        let pGuardado = await this.#productosDB.create(datosP)
        pGuardado = JSON.parse(JSON.stringify(pGuardado)) // necesario? por las dudas? por las dudas
        return pGuardado
    }
    async obtenerTodos() {
        const p = await this.#productosDB.find().lean()
        return p
    }
    async obtenerSegunId(id) {
        const p = await this.#productosDB.findById(id).lean()
        return p

    }
}

export const productManagerDB = new ProductManagerDB()



 