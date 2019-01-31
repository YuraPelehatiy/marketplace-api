import knex from 'knex';

export const up = async (knex: knex) => {
  await knex.schema.table('products', (t) => {
    t.text('сategory').defaultTo('phone')
  });
};

export const down = async (knex: knex) => {
  return knex.schema.table('products', (t) => {
    t.dropColumn('сategory');
  });
};
