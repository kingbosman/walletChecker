const { db, tableNames } = require('../../../db/knex');

exports.getActive = (filter = {}, offset = 0, limit = 1000) => {
    return db.select(
            `${tableNames.block}.id`,
            `${tableNames.block}.height`,
            `${tableNames.block}.confirmations`,
            `${tableNames.currency}.name`,
            `${tableNames.currency}.abbreviation`,
            `${tableNames.currency}.decimal_places`,
            `${tableNames.block}.created_at`,
            `${tableNames.block}.updated_at`,
        )
        .from(tableNames.block)
        .join(`${tableNames.currency}`, function() {
            this
                .on(`${tableNames.currency}.id`,
                    `${tableNames.block}.${tableNames.currency}_id`)
                .onNull(`${tableNames.currency}.deleted_at`)
        })
        .where(filter)
        .whereNull(`${tableNames.currency}.deleted_at`)
        .limit(limit)
        .offset(offset)
}

exports.create = (newEntity) => {
    return db(tableNames.block)
        .insert(newEntity)
        .returning('*');
}

exports.update = (id, updateInfo) => {
    return db(tableNames.block)
        .where({ id: id })
        .update(updateInfo)
        .update({ updated_at: new Date() })
        .returning('*');
}

exports.softDelete = (id) => {
    return db(tableNames.block)
        .where({ id: id })
        .update({
            deleted_at: new Date(),
            updated_at: new Date()
        })
        .returning('*');
}