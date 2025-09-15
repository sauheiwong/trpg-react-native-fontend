import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import COCGameScreen from '../screens/COCGameScreen';
import SideMenu from '../components/SideMenu';

import { COLORS } from "../constants/color";

const Drawer = createDrawerNavigator();

export default function COCGameDrawer() {
  return (
    <Drawer.Navigator
      // 使用你的 SideMenu 元件作為抽屜的內容
      drawerContent={(props) => <SideMenu {...props} />}
      screenOptions={{
        headerShown: false, // 我們在 COCGameScreen 中有自訂的 header，所以隱藏預設的
        drawerType: 'front', // 抽屜會覆蓋在主畫面上方
      }}
    >
      <Drawer.Screen name="COCGameScreen" component={COCGameScreen} />
    </Drawer.Navigator>
  );
}