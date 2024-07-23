exports.up = function(knex) {
    return knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('givenName');
      table.string('familyName');
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('users');
  };
  

// exports.up = function(knex) {
//   return knex.schema.hasTable('users').then(function(exists) {
//     if (!exists) {
//       return knex.schema.createTable('users', (table) => {
//         table.increments('id').primary();
//         table.string('givenName');
//         table.string('familyName');
//       });
//     } else {
//       console.log('Table "users" already exists. Skipped creation.');
//       return Promise.resolve();
//     }
//   });
// };

// exports.down = function(knex) {
//   return knex.schema.dropTableIfExists('users');
// };
