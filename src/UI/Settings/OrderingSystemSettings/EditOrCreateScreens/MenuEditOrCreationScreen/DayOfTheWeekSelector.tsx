import React from 'react';
import OrderingSystemFormSelectableTagsChooserField from '../OrderingSystemFormSelectableTagsChooserField';
import { DayOfTheWeek } from '../../../../../api/orderingSystem/menus/Menu';
import { useField } from '../../../../../helpers/formik';
import { MenuEditOrCreationValues } from './helpers';

const dayOfTheWeekItems = (() => {
  const tuples: [DayOfTheWeek, string][] = [
    [DayOfTheWeek.sunday, 'Sunday'],
    [DayOfTheWeek.monday, 'Monday'],
    [DayOfTheWeek.tuesday, 'Tuesday'],
    [DayOfTheWeek.wednesday, 'Wednesday'],
    [DayOfTheWeek.thursday, 'Thursday'],
    [DayOfTheWeek.friday, 'Friday'],
    [DayOfTheWeek.saturday, 'Saturday'],
  ];
  return tuples.map(x => ({ id: x[0], title: x[1] }));
})();

const MenuEditOrCreationDayOfTheWeekSelector = () => {
  const [, { value }, { setValue }] = useField<
    MenuEditOrCreationValues,
    'daysOfTheWeek'
  >('daysOfTheWeek');

  return (
    <OrderingSystemFormSelectableTagsChooserField
      containerTopTitleText="Days of the Week"
      allSortedItems={dayOfTheWeekItems}
      selectedItemIds={value}
      onSelectedItemsDidChange={setValue}
    />
  );
};

export default MenuEditOrCreationDayOfTheWeekSelector;
