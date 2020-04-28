const { db, tableNames } = require('../../../db/knex');

exports.getActive = (filter = {}, offset = 0, limit = 1000) => {
    return db.select(
            `${tableNames.balance}.id`,
            `${tableNames.currency}.name as currency`,
            `${tableNames.currency}.abbreviation`,
            `${tableNames.currency}.decimal_places`,
            `${tableNames.address_type}.name as address_type`,
            `${tableNames.network}.name as network`,
            `${tableNames.balance}.balance`,
            `${tableNames.balance}.unconfirmed_balance`,
            `${tableNames.balance}.final_balance`,
            `${tableNames.balance}.transactions`,
            `${tableNames.balance}.unconfirmed_transactions`,
            `${tableNames.balance}.final_transactions`,
            `${tableNames.balance}.sent`,
            `${tableNames.balance}.received`,
            `${tableNames.balance}.created_at`,
            `${tableNames.balance}.updated_at`,
        )
        .from(tableNames.balance)
        .join(`${tableNames.currency}`, function() {
            this
                .on(`${tableNames.currency}.id`,
                    `${tableNames.balance}.${tableNames.currency}_id`)
                .onNull(`${tableNames.currency}.deleted_at`)
        })
        .join(`${tableNames.address_type}`, function() {
            this
                .on(`${tableNames.address_type}.id`,
                    `${tableNames.balance}.${tableNames.address_type}_id`)
                .onNull(`${tableNames.address_type}.deleted_at`)
        })
        .join(`${tableNames.network}`, function() {
            this
                .on(`${tableNames.network}.id`,
                    `${tableNames.balance}.${tableNames.network}_id`)
                .onNull(`${tableNames.network}.deleted_at`)
        })
        .where(filter)
        .whereNull(`${tableNames.balance}.deleted_at`)
        .limit(limit)
        .offset(offset)
}

exports.create = (newEntity) => {
    return db(tableNames.balance)
        .insert(newEntity)
        .returning('*');
}

exports.update = (id, updateInfo) => {
    return db(tableNames.balance)
        .where({ id: id })
        .update(updateInfo)
        .update({ updated_at: new Date() })
        .returning('*');
}

exports.softDelete = (id) => {
    return db(tableNames.balance)
        .where({ id: id })
        .update({
            deleted_at: new Date(),
            updated_at: new Date()
        })
        .returning('*');
}