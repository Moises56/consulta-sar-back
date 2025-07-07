Se necesitan permisos de archivo - La importación de patrones, páginas y plantillas desde la biblioteca de diseño requiere permisos de archivo adecuados. Para resolver este problema y garantizar un proceso de importación sin problemas, consulta la documentación adjunta.

Faltan los permisos de archivo necesarios para importar las plantillas de Starter Templates.

Puedes actualizar fácilmente los permisos añadiendo el siguiente código en el archivo «wp-config.php».

define( 'FS_METHOD', 'direct' );


Faltan los permisos de archivo necesarios para importar las plantillas de Starter Templates.

Puedes actualizar fácilmente los permisos añadiendo el siguiente código en el archivo «wp-config.php».

define( 'FS_METHOD', 'direct' );



#!/bin/bash
docker exec wpvetedocker-db-1 mysqldump -u wp_user -pwp_pass_123 wordpress_dev > backup_$(date +%F).sql
tar -zcvf wp-content_$(date +%F).tar.gz wp-content/


User: Veterinaria
Pass: 7ZTWu9N7gBYvx0XQRl


