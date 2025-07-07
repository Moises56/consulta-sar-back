Verificar la existencia del archivo SQL: Asegúrate de que el archivo wordpress_dev.sql esté en el directorio correcto:
ls -l ~/webApp/appDocker/wpVeteDocker/db/wordpress_dev.sql

Detener los contenedores (opcional): Para evitar conflictos durante la importación, puedes detener los contenedores:
cd ~/webApp/appDocker/wpVeteDocker
docker-compose down

Iniciar los contenedores: Si los detuviste, inícialos nuevamente:
docker-compose up -d


Confirmar que los contenedores están corriendo:
docker ps

Paso 2: Eliminar la base de datos existente
docker exec -it wpvetedocker-db-1 mysql -u root -p
Ingresa la contraseña root_pass_123 (según tu .env).

Verificar bases de datos existentes: En el prompt de MySQL, ejecuta:
SHOW DATABASES;

Eliminar la base de datos:
DROP DATABASE wordpress_dev;




Crear una nueva base de datos:

CREATE DATABASE wordpress_dev;


EXIT


Copiar el archivo SQL al contenedor:

docker cp db/wordpress_dev.sql wpvetedocker-db-1:/wordpress_dev.sql


Importar la base de datos: Usa el siguiente comando para importar el archivo:

docker exec wpvetedocker-db-1 mysql -u wp_user -pwp_pass_123 wordpress_dev -e "SOURCE /wordpress_dev.sql"


Alternativa: Usar redirección: Si el comando anterior falla:
docker exec -i wpvetedocker-db-1 mysql -u wp_user -pwp_pass_123 wordpress_dev < db/wordpress_dev.sql

Revisar logs: Si hay errores (como el previo chmod(): Operation not permitted):
docker logs wpvetedocker-wordpress-1
docker logs wpvetedocker-db-1




Verificar si WP-CLI está instalado: Si no lo instalaste previamente:

docker exec wpvetedocker-wordpress-1 bash -c "curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar && chmod +x wp-cli.phar && mv wp-cli.phar /usr/local/bin/wp"


Ejecutar el reemplazo de URLs:
docker exec wpvetedocker-wordpress-1 wp search-replace 'http://localhost:8085' 'http://192.168.200.82:8085' --all-tables --allow-root --dry-run


Aplicar el reemplazo: Si el --dry-run muestra coincidencias, ejecuta el reemplazo real:

docker exec wpvetedocker-wordpress-1 wp search-replace 'http://localhost:8085' 'http://192.168.200.82:8085' --all-tables --allow-root


Limpiar caché:

docker exec wpvetedocker-wordpress-1 wp cache flush --allow-root
docker exec wpvetedocker-wordpress-1 rm -rf /var/www/html/wp-content/cache/*