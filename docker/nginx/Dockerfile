FROM nginx:1.27.4-alpine-slim

RUN rm /etc/nginx/conf.d/default.conf

COPY ./default.conf /etc/nginx/templates/default.conf.template

COPY ./frontend/dist/kindergartenapps/browser /usr/share/nginx/html
