import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./hooks/useAuth";
import StackNavigator from "./StackNavigator";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["AsyncStorage", "Setting a timer"]);

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        {/* Passes down the auth stuff to children */}
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
