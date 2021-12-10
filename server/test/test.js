var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd5F3Efakd5F3Efakd5F3Efakd5F3Efak',
    iv = 'abcdabcdabcdabcd';

function encrypt(text) {
    var cipher = crypto.createCipheriv(algorithm, password, iv)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipheriv(algorithm, password, iv)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

var hw = encrypt("hellow world")
console.log(decrypt(hw))