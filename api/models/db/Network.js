const { db, tableNames } = require('../../../db/knex');

exports.getActiveNetworks = (filter = {}, offset = 0, limit = 1000) => {
    return db.select(
            `${tableNames.network}.id`,
            `${tableNames.network}.type`,
            `${tableNames.network}.created_at`,
            `${tableNames.network}.updated_at`,
        )
        .from(tableNames.network)
        .where(filter)
        .whereNull('deleted_at')
        .limit(limit)
        .offset(offset)
        .orderBy('id');
}

exports.createNetwork = (newEntity) => {
    return db(tableNames.network)
        .insert(newEntity)
        .returning('*');
}

exports.updateNetwork = (id, updateInfo) => {
    return db(tableNames.network)
        .where({ id: id })
        .update(updateInfo)
        .returning('*');
}

exports.softDeleteNetwork = (id) => {
    return db(tableNames.network)
        .where({ id: id })
        .update({ deleted_at: new Date() })
        .returning('*');
}