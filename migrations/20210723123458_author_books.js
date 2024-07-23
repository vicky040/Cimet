exports.up = function(knex) {
    return knex.schema.createTable('authors_books', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('users.id');
      table.integer('book_id').unsigned().references('books.id');
      table.unique(['user_id', 'book_id']); 
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('authors_books');
  };
  