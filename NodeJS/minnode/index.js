const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')
const qs = require('querystring')
const multiparty  = require('multiparty')

const notFound = (req, res) => {
    fs.readFile(path.join(__dirname, '404.html'), (err, data) => {
        if (err) {
            res.write('404', 'not found')
            res.end()
        } else {
            res.writeHead(404, {'Content-Type': "text/html;charset='utf-8'"})
            res.write(data)
            res.end()
        }
    })
}

const writedb = (chunk) => {
    fs.appendFile(path.join(__dirname, 'db'), chunk, err => {
        if (err) {
            throw err
        }
        console.log('db inset', chunk && chunk.toString())
    })
}
http.createServer((req, res) => {

    let pathName = url.parse(req.url).pathname

    if (pathName === '/') {
        pathName = path.join(__dirname, 'index.html')
    }

    res.setHeader('Content-type', 'application/json')

    if (pathName.startsWith('/api')) {
        let requestMethods = req.method;
        if (requestMethods === 'GET') {
            let query = qs.parse(url.parse(req.url).query)
            const data = {
                code: 200,
                message: 'OK',
                data: query
            }
            res.end(JSON.stringify(data))
            return
        }
        if (requestMethods === 'POST') {
            const ContentType = req.headers['content-type']
            if (ContentType === 'application/json') {
                let postData = ''
                req.on('data', chunk => {
                    postData += chunk.toString()
                    writedb(chunk)
                })
                req.on('end', () => {
                    res.end(postData)
                })
                return
            }

            if(ContentType.indexOf('multipart/form-data') > -1){
                let form = new multiparty.Form()
                form.parse(req,(err, fields, files)=>{
                    res.end(JSON.stringify(fields))
                })
            }
        }
    }
    const extName = path.extname(pathName)

    fs.readFile(pathName, (err, data) => {
        if (err) {
            notFound(req, res)
        } else {
            res.writeHead(200, {'Content-type': "text/html;charset='utf-8'"})
            res.write(data)
            res.end()
        }
    })

    // res.write('hello world')
    // res.end()
}).listen(8000, () => {
    console.log('服务启动')
})