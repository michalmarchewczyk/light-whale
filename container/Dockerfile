FROM nginx:1.23-alpine

RUN apk add nmap

RUN apk add certbot

RUN apk add certbot-nginx

RUN apk add dnsmasq

EXPOSE 80
EXPOSE 443

RUN echo "server=127.0.0.11" >> /etc/dnsmasq.conf

CMD dnsmasq && nginx -g 'daemon off;'
