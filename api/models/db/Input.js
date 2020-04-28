const { db, tableNames } = require('../../../db/knex');

exports.getActive = (filter = {}, offset = 0, limit = 1000) => {
    return db.select(
            `${tableNames.input}.id`,
            `${tableNames.input}.address`,
            `${tableNames.input}.value`,
            `${tableNames.input}.sequence`,
            `${tableNames.transaction}.tx_id`,
            `${tableNames.input}.created_at`,
            `${tableNames.input}.updated_at`,
        )
        .from(tableNames.input)
        .join(`${tableNames.transaction}`, function() {
            this
                .on(`${tableNames.transaction}.id`,
                    `${tableNames.input}.${tableNames.transaction}_id`)
                .onNull(`${tableNames.transaction}.deleted_at`)
        })
        .where(filter)
        .whereNull(`${tableNames.input}.deleted_at`)
        .limit(limit)
        .offset(offset)
}

exports.create = (newEntity) => {
    return db(tableNames.input)
        .insert(newEntity)
        .returning('*');
}

exports.update = (id, updateInfo) => {
    return db(tableNames.input)
        .where({ id: id })
        .update(updateInfo)
        .update({ updated_at: new Date() })
        .returning('*');
}

exports.softDelete = (id) => {
    return db(tableNames.input)
        .where({ id: id })
        .update({
            deleted_at: new Date(),
            updated_at: new Date()
        })
        .returning('*');
}