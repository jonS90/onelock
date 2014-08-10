PRIV_KEY=$(openssl genrsa 2048)
# compute public key from private key
PUBL_KEY=$(echo $PRIV_KEY | openssl rsa -pubout)
echo PRIV_KEY
echo PUBL_KEY




openssl genrsa 2048 > PRIV_KEY.tmp
cat PRIV_KEY.tmp

rm PRIV_KEY.tmp