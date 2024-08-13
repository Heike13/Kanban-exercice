#!/bin/bash 
# Description: Sauvegarde de la base de données
DB_USER="okanban"
DB_NAME="okanban"
BACKUP_DIR="/home/okanban/backup"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")

# Vérification de l'existence et création du répertoire de sauvegarde
if [ ! -d "$BACKUP_DIR" ]; then
    sudo mkdir -p $BACKUP_DIR
    sudo chown $USER:$USER $BACKUP_DIR
fi

# Sauvegarde de la base de données
pg_dump -U $DB_USER $DB_NAME > $BACKUP_DIR/$DB_NAME-$DATE.sql

# Message de confirmation si tout s'est bien passé
if [ $? -eq 0 ]; then
    echo "Sauvegarde de la base de données $DB_NAME effectuée avec succès le $DATE"
else
    echo "Une erreur s'est produite lors de la sauvegarde de la base de données $DB_NAME"
fi

# suppression des sauvegardes de plus de 7 jours si la sauvegarde a été effectuée avec succès
if [ $? -eq 0 ]; then
    find $BACKUP_DIR -type f -name "$DB_NAME-*.sql" -mtime +7 -delete
fi

# ------------------------------------------------------------------------
#! Suppression de toutes les sauvegardes
# find $BACKUP_DIR -type f -name "$DB_NAME-*.sql" -delete
# Suppression du dossier de sauvegarde
# rm -rf $BACKUP_DIR

# Changer les permissions du répertoire
# sudo chmod -R 755 /home/okanban/backup
# Changer le propriétaire du répertoire (si nécessaire)
# sudo chown -R $USER:$USER /home/okanban/backup


#? Si besoin de restaurer la base de données
# psql -U $DB_USER $DB_NAME < $BACKUP_DIR/$DB_NAME-$DATE.sql
