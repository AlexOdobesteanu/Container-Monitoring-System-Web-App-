const yaml = require('js-yaml');
const fs = require('fs')
const x = "alex"
const y = '365'
const z = '365'
const t = "nipio"

let data = {
    version: "3.4",
    services: {
        'image': 'kekru/docker-remote-api-tls:v0.4.0',
        ports: [
            '2376:443'
        ],
        environment: [
            'CREATE_CERTS_WITH_PW=' + x,
            'CERT_EXPIRATION_DAYS=' + y,
            'CA_EXPIRATION_DAYS=' + z,
            'CERT_HOSTNAME=' + t
        ],
        volumes: [
            '/data/certs',
            '/var/run/docker.sock:/var/run/docker.sock:ro'
        ]
    }
}

let yamlStr = yaml.safeDump(data)
fs.writeFileSync("lol.yaml", yamlStr, 'utf8')