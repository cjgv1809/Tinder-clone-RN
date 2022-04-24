import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  Button,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import useAuth from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import { StatusBar } from "expo-status-bar";

const LoginScreen = () => {
  const { signInWithGoogle, loading } = useAuth();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  return (
    <View style={tw`flex-1`}>
      <>
        <StatusBar style="light" />
        <ImageBackground
          resizeMode="cover"
          style={tw`flex-1`}
          source={{ uri: "https://tinder.com/static/tinder.png" }}
        >
          <TouchableOpacity
            style={[
              tw`absolute bottom-32 w-52 bg-white p-4 rounded-full`,
              { marginHorizontal: "25%" },
            ]}
            onPress={signInWithGoogle}
          >
            <Text style={tw`text-center font-bold`}>Sign in & get swiping</Text>
          </TouchableOpacity>
        </ImageBackground>
      </>
    </View>
  );
};

export default LoginScreen;
