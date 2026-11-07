-- ============================================================
-- achievements.student_name/competition/result were specced in
-- the original schema but the shipped feature never collects or
-- displays per-student/competition detail (title + description +
-- teacher_note + optional photo instead). student_name was `not
-- null` and silently written as '' on every insert to satisfy the
-- constraint; competition/result were never written at all. Drop
-- all three as dead columns.
-- ============================================================
alter table achievements
  drop column if exists student_name,
  drop column if exists competition,
  drop column if exists result;
