/* eslint-disable camelcase */

const mapDBToModel = ({
  id,
  title,
  body,
  tags,
  created_at,
  updated_at,
  owner,
}) => ({
  id,
  title,
  body,
  tags: tags.split(','),
  createdAt: created_at,
  updatedAt: updated_at,
  owner,
});

module.exports = { mapDBToModel };
