import http from 'http'

function getQueryparams(url){
    const queryParamsText = url.split('?')[1]
    if(queryParamsText){
        const queryParams = queryParamsText.split('&').map(par => par.split('='))
        return Object.fromEntries(queryParams)
    } else {
        return {}
    }
}


function getUrlParams(url, posicionesParams){
    const urlParamsText = url.split('?')[0]
    const urlParams = urlParamsText.split('/')
    const result = {}
    for (const nombre in posicionesParams){
        result[nombre] = urlParams[posicionesParams[nombre]]
    }
    return result
    
}
const server = http.createServer((peticion, respuesta) => {
    console.log(peticion.method)
    console.log(peticion.url)

    const queryParams = getQueryparams(peticion.url)
    console.log(queryParams)

    const urlParams = getUrlParams(peticion.url, { nroUsuario: 2 })
    
    console.log(urlParams)
    respuesta.end
   
    
})

server.listen(8080)
