exports.up = function(knex) {
    return knex.schema.createTable('books', (table) => {
      table.increments('id').primary();
      table.string('title');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('books');
  };

// exports.up = function(knex) {
  
//   return knex.schema.hasTable('books').then(function(exists) {
//     if (!exists) {
//       return knex.schema.createTable('books', (table) => {
//         table.increments('id').primary();
//         table.string('title');
//       });
//     } else {
//      console.log('Table "books" already exists. Skipped creation.');
//       return Promise.resolve();
//     }
//   });
// };

// exports.down = function(knex) {
//  return knex.schema.dropTableIfExists('books');
// };

