import React, { useMemo } from 'react';
import GenericSettingsScreen, {
  GenericSettingsScreenSection,
} from '../GenericSettingsScreen/GenericSettingsScreen';
import { useAllowOrderingSwitchSettingsItem } from '../helpers';

const AllowOrderingSwitchScreen = () => {
  const allowOrderingSwitchSettingsItem = useAllowOrderingSwitchSettingsItem();

  const sections: GenericSettingsScreenSection[] = useMemo(() => {
    return [
      {
        title: null,
        data: [allowOrderingSwitchSettingsItem],
      },
    ];
  }, [allowOrderingSwitchSettingsItem]);

  return (
    <GenericSettingsScreen navBarTitle="Allow Ordering" sections={sections} />
  );
};

export default AllowOrderingSwitchScreen;
