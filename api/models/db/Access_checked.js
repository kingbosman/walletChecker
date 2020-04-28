const { db, tableNames } = require('../../../db/knex');

exports.getActive = (filter = {}, offset = 0, limit = 1000) => {
    return db.select(
            `${tableNames.access_checked}.id`,
            `${tableNames.access_checked}.note`,
            `${tableNames.access_checked}.ip_address`,
            `${tableNames.address}.address`,
            `${tableNames.person}.first_name`,
            `${tableNames.person}.last_name`,
            `${tableNames.person}.email`,
            `${tableNames.access_checked}.created_at`,
            `${tableNames.access_checked}.updated_at`,
        )
        .from(tableNames.access_checked)
        .join(`${tableNames.address}`, function() {
            this
                .on(`${tableNames.address}.id`,
                    `${tableNames.access_checked}.${tableNames.address}_id`)
                .onNull(`${tableNames.address}.deleted_at`)
        })
        .join(`${tableNames.person}`, function() {
            this
                .on(`${tableNames.person}.id`,
                    `${tableNames.access_checked}.${tableNames.person}_id`)
                .onNull(`${tableNames.person}.deleted_at`)
        })
        .where(filter)
        .whereNull(`${tableNames.access_checked}.deleted_at`)
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