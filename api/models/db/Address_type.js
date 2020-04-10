const { db, tableNames } = require('../../../db/knex');

exports.getActiveAddressTypes = (filter = {}, offset = 0, limit = 1000) => {
    return db.select(
            `${tableNames.address_type}.id`,
            `${tableNames.address_type}.name`,
            `${tableNames.address_type}.created_at`,
            `${tableNames.address_type}.updated_at`,
        )
        .from(tableNames.address_type)
        .where(filter)
        .whereNull('deleted_at')
        .limit(limit)
        .offset(offset)
        .orderBy('id');
}

exports.createAddressType = (newEntity) => {
    return db(tableNames.address_type)
        .insert(newEntity)
        .returning('*');
}

exports.updateAddressType = (id, updateInfo) => {
    return db(tableNames.address_type)
        .where({ id: id })
        .update(updateInfo)
        .returning('*');
}

exports.softDeleteAddressType = (id) => {
    return db(tableNames.address_type)
        .where({ id: id })
        .update({ deleted_at: new Date() })
        .returning('*');
}