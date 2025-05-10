// import React, { useState, useEffect } from 'react';
// import { Text, View, StyleSheet, Button, Alert } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';

// const QrScanner = ({ onCodeScanned }: { onCodeScanned: (data: string) => void }) => {
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
//   const [scanned, setScanned] = useState(false);

//   useEffect(() => {
//     (async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   const handleBarCodeScanned = ({ type, data }: any) => {
//     setScanned(true);
//     onCodeScanned(data); // Veriyi üst bileşene ilet
//     Alert.alert('QR Okundu', `Kod: ${data}`);
//   };

//   if (hasPermission === null) {
//     return <Text>İzin isteniyor...</Text>;
//   }
//   if (hasPermission === false) {
//     return <Text>Kamera izni reddedildi</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <BarCodeScanner
//         onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//         style={StyleSheet.absoluteFillObject}
//       />

//       {scanned && (
//         <Button title={'Tekrar Tara'} onPress={() => setScanned(false)} />
//       )}
//     </View>
//   );
// };

// export default QrScanner;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });
