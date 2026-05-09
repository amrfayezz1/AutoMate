alter table maintenance_types
  add column if not exists icon text not null default 'Wrench';

update maintenance_types set icon = 'Wrench'        where id = 'oil-change';
update maintenance_types set icon = 'Circle'         where id = 'tires';
update maintenance_types set icon = 'Zap'            where id = 'battery';
update maintenance_types set icon = 'Disc'           where id = 'brakes';
update maintenance_types set icon = 'Wind'           where id = 'air-filter';
update maintenance_types set icon = 'Filter'         where id = 'fuel-filter';
update maintenance_types set icon = 'Settings'       where id = 'transmission';
update maintenance_types set icon = 'Droplets'       where id = 'coolant';
update maintenance_types set icon = 'Flame'          where id = 'spark-plugs';
update maintenance_types set icon = 'Eye'            where id = 'wipers';
