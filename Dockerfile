FROM --platform=$BUILDPLATFORM node:12.16-alpine

ARG TARGETARCH
RUN apk add --update --no-cache --repository https://dl-4.alpinelinux.org/alpine/latest-stable/community/$TARGETARCH/ python2 make g++ bash git ca-certificates

COPY . /app

WORKDIR /app

RUN npm install -g bower \
    && npm --unsafe-perm --production install \
    && apk del git \
    && rm -rf /var/cache/apk/* \
        /app/.git \
        /app/screenshots \
        /app/test \
    && adduser -H -S -g "Konga service owner" -D -u 1200 -s /sbin/nologin konga \
    && mkdir /app/kongadata /app/.tmp \
    && chown -R 1200:1200 /app/views /app/kongadata /app/.tmp

EXPOSE 1337

VOLUME /app/kongadata

ENTRYPOINT ["/app/start.sh"]