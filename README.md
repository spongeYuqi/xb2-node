# 小白兔的开发之路

## 生成密钥与公钥

```
cd config
openssl
openssl genrsa -out private.key 4096
openssl rsa -in private.key -pubout -out public.key

exit//你的要每次加openssl 不需要exit

```
