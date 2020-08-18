openssl genrsa -out privatekey.pem 512

openssl rsa -in privatekey.pem -pubout -out publickey.crt