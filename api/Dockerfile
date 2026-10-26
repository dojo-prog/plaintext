FROM php:8.5-fpm-alpine

WORKDIR /var/www/html

ENV APP_ENV=production \
    APP_DEBUG=false \
    PORT=10000

RUN apk add --no-cache \
        curl \
        freetype \
        icu-libs \
        libjpeg-turbo \
        libpng \
        libpq \
        libzip \
        nginx \
        oniguruma \
        supervisor \
        gettext-envsubst \
    && apk add --no-cache --virtual .build-deps \
        $PHPIZE_DEPS \
        curl-dev \
        freetype-dev \
        icu-dev \
        libjpeg-turbo-dev \
        libpng-dev \
        libzip-dev \
        oniguruma-dev \
        postgresql-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath \
        curl \
        exif \
        gd \
        intl \
        opcache \
        pcntl \
        pdo_mysql \
        pdo_pgsql \
        pdo_sqlite \
        zip \
    && apk del .build-deps \
    && mkdir -p /run/nginx

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

COPY . .

RUN composer install \
        --no-dev \
        --no-interaction \
        --no-progress \
        --optimize-autoloader \
    && chown -R www-data:www-data storage bootstrap/cache

COPY docker/nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker/supervisord.conf /etc/supervisord.conf

EXPOSE 10000

CMD ["sh", "-c", "envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/http.d/default.conf && exec supervisord -n -c /etc/supervisord.conf"]
