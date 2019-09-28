FROM takatost/node-yarn:latest as chedianai-car_personnel_wx-builder
ARG DEPLOY_ENV

MAINTAINER mr.song <songshuangfeng@vchangyi.com>

# RUN npm install --registry=http://registry.npm.taobao.org --phantomjs_cdnurl=http://cnpmjs.org/downloads

COPY / /src

RUN cd /src && \
  cp -rf config/$(echo $DEPLOY_ENV|cut -d "/" -f 2)/* src/ && \
  npm install --registry=http://registry.npm.taobao.org --phantomjs_cdnurl=http://cnpmjs.org/downloads && \
  npm run build && \
  mv dist/static/js/app.*.js dist/static/js/app.js -f && \
  mv dist/static/js/chunk-vendors.*.js dist/static/js/chunk-vendors.js -f && \
  mv dist/static/css/app.*.css dist/static/css/app.css -f && \
  mkdir -p /output && \
  cp dist/* /output/ -rf

WORKDIR /output

FROM nginx:1.13-alpine

RUN rm -rf /usr/share/nginx/html/*
RUN echo "server {listen 80; server_name  localhost; location / { root /usr/share/nginx/html; rewrite '^/(.*)/(.*)/static/(js|css)/(app|chunk-vendors).(.*).(js|css)$' /static/\$3/\$4.\$6 break; rewrite '^/(.*)/(.*)/static/img/(.+).(xls|jpg|jpeg|gif|png|js|ico|thumb|xml|swf|txt|woff|ttf|eot|svg|otf|htm|html|apk|map)$' /static/img/\$3.\$4 break; rewrite '^/(.*)$' /index.html break; index  index.html index.htm;} gzip on; gzip_http_version 1.1; gzip_comp_level 5; gzip_min_length 256; gzip_proxied any; gzip_vary on; gzip_types application/atom+xml application/javascript application/json application/rss+xml application/vnd.ms-fontobject application/x-font-ttf application/x-web-app-manifest+json application/xhtml+xml application/xml font/opentype image svg+xml image/x-icon text/css text/plain text/x-component;}" > /etc/nginx/conf.d/default.conf;
COPY --from=chedianai-car_personnel_wx-builder /output/ /usr/share/nginx/html/