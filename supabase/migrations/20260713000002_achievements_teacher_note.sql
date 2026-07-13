-- Add teacher appreciation note to achievements
alter table achievements add column if not exists teacher_note text;
