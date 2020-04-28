const { db, tableNames } = require('../../../db/knex');

exports.getActive = (filter = {}, offset = 0, limit = 1000) => {
    return db.select(
            `${tableNames.acknowledged}.id`,
            `${tableNames.acknowledged}.note`,
            `${tableNames.acknowledged}.ip_address`,
            `${tableNames.transaction}.tx_id`,
            `${tableNames.person}.first_name`,
            `${tableNames.person}.last_name`,
            `${tableNames.person}.email`,
            `${tableNames.acknowledged}.created_at`,
            `${tableNames.acknowledged}.updated_at`,
        )
        .from(tableNames.acknowledged)
        .join(`${tableNames.transaction}`, function() {
            this
                .on(`${tableNames.transaction}.id`,
                    `${tableNames.acknowledged}.${tableNames.transaction}_id`)
                .onNull(`${tableNames.transaction}.deleted_at`)
        })
        .join(`${tableNames.person}`, function() {
            this
                .on(`${tableNames.person}.id`,
                    `${tableNames.acknowledged}.${tableNames.person}_id`)
                .onNull(`${tableNames.person}.deleted_at`)
        })
        .where(filter)
        .whereNull(`${tableNames.acknowledged}.deleted_at`)
        .limit(limit)
        .offset(offset)
}

exports.create = (newEntity) => {
    return db(tableNames.access_checked)
        .insert(newEntity)
        .returning('*');
}

exports.update = (id, updateInfo) => {
    return db(tableNames.access_checked)
        .where({ id: id })
        .update(updateInfo)
        .update({ updated_at: new Date() })
        .returning('*');
}

exports.softDelete = (id) => {
    return db(tableNames.access_checked)
        .where({ id: id })
        .update({
            deleted_at: new Date(),
            updated_at: new Date()
        })
        .returning('*');
}