#!/bin/sh

set -e

host="database"
port="3306"

echo "Esperando a que la base de datos esté disponible en $host:$port..."

while ! nc -z $host $port; do
  sleep 1
done

echo "¡La base de datos está lista! Iniciando la aplicación..."
exec java -jar /app/target/your-backend-app.jar
