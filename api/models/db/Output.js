const { db, tableNames } = require('../../../db/knex');

exports.getActive = (filter = {}, offset = 0, limit = 1000) => {
    return db.select(
            `${tableNames.output}.id`,
            `${tableNames.output}.address`,
            `${tableNames.output}.value`,
            `${tableNames.transaction}.tx_id`,
            `${tableNames.output}.created_at`,
            `${tableNames.output}.updated_at`,
        )
        .from(tableNames.output)
        .join(`${tableNames.transaction}`, function() {
            this
                .on(`${tableNames.transaction}.id`,
                    `${tableNames.output}.${tableNames.transaction}_id`)
                .onNull(`${tableNames.transaction}.deleted_at`)
        })
        .where(filter)
        .whereNull(`${tableNames.output}.deleted_at`)
        .limit(limit)
        .offset(offset)
}

exports.create = (newEntity) => {
    return db(tableNames.output)
        .insert(newEntity)
        .returning('*');
}

exports.update = (id, updateInfo) => {
    return db(tableNames.output)
        .where({ id: id })
        .update(updateInfo)
        .update({ updated_at: new Date() })
        .returning('*');
}

exports.softDelete = (id) => {
    return db(tableNames.output)
        .where({ id: id })
        .update({
            deleted_at: new Date(),
            updated_at: new Date()
        })
        .returning('*');
}