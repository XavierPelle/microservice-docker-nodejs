FROM php:8.1-cli

RUN docker-php-ext-install pdo pdo_mysql

WORKDIR /var/www/html

COPY ./api /var/www/html

EXPOSE 8101

CMD ["php", "-S", "0.0.0.0:8101", "-t", "/var/www/html"]