const { db, tableNames } = require('../../../db/knex');

exports.getActivePersons = (filter = {}, offset = 0, limit = 1000) => {
    return db.select(
            `${tableNames.person}.id`,
            `${tableNames.person}.first_name`,
            `${tableNames.person}.last_name`,
            `${tableNames.person}.email`,
            `${tableNames.person}.created_at`,
            `${tableNames.person}.updated_at`,
        )
        .from(tableNames.person)
        .where(filter)
        .whereNull('deleted_at')
        .limit(limit)
        .offset(offset)
        .orderBy('id');
}

exports.createPerson = (newEntity) => {
    return db(tableNames.person)
        .insert(newEntity)
        .returning('*');
}

exports.updatePerson = (id, updateInfo) => {
    return db(tableNames.person)
        .where({ id: id })
        .update(updateInfo)
        .returning('*');
}

exports.softDeletePerson = (id) => {
    return db(tableNames.person)
        .where({ id: id })
        .update({ deleted_at: new Date() })
        .returning('*');
}