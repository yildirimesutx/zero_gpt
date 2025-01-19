// App.js
import React from 'react';
import RootNavigation from './src/navigation/RootNavigation';
import { ThemeProvider } from './src/theme/ThemeProvider';

export default function App() {
  return (
      <ThemeProvider>
        <RootNavigation />
      </ThemeProvider>
  );
}









// // App.js
// import React from 'react';
// import { View, Text } from 'react-native';

// // i18n import
// import i18n from './src/i18n/i18n';

// export default function App() {
//   return (
//     <View 
//       style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
//     >
//       <Text>{i18n.t('hello')}</Text>
//       <Text>{i18n.t('welcome')}</Text>
//     </View>
//   );
// }

