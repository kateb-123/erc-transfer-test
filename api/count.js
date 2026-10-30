// Fills the test database with five fake rows the first time, then reports
// what it holds. After the move, the same count proves the data came along.
const { neon } = require('@neondatabase/serverless');

const ROWS = [
  ['Howdy Policy Trivia Night', 'https://example.org/howdy-trivia'],
  ["Gig 'Em Grant Workshop", 'https://example.org/gig-em-grants'],
  ["Reveille's Reading Hour", 'https://example.org/reveille-reads'],
  ['Maroon Monday Data Chat', 'https://example.org/maroon-monday'],
  ['Kyle Field Fact Sheet', 'https://example.org/kyle-field-facts'],
];

module.exports = async (req, res) => {
  const sql = neon(process.env.DATABASE_URL);
  await sql`create table if not exists transfer_check (id serial primary key, title text not null, link text not null)`;
  const [{ n }] = await sql`select count(*)::int as n from transfer_check`;
  if (n === 0) {
    for (const [title, link] of ROWS) await sql`insert into transfer_check (title, link) values (${title}, ${link})`;
  }
  const rows = await sql`select id, title from transfer_check order by id`;
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify({ count: rows.length, rows }, null, 2));
};
