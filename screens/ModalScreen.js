import { useNavigation } from "@react-navigation/native";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import { db } from "../firebase";
import useAuth from "../hooks/useAuth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const ModalScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [job, setJob] = useState(null);
  const [age, setAge] = useState(null);

  const incompleteForm = !image || !job || !age;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Update your profile",
      headerStyle: { backgroundColor: "#FF5864" },
      headerTitleStyle: { color: "white" },
    });
  }, []);

  const updateUserProfile = () => {
    setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      displayName: user.displayName,
      photoURL: image,
      job: job,
      age: age,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <KeyboardAwareScrollView>
        <View style={tw`flex-1 items-center`}>
          <Image
            style={tw`h-20 w-full`}
            resizeMode="contain"
            source={{ uri: "https://links.papareact.com/2pf" }}
          />
          <Text style={tw`text-xl text-gray-500 p-2 font-bold`}>
            Welcome {user.displayName}
          </Text>

          <Text style={tw`text-center p-4 font-bold text-red-400`}>
            Step 1: The Profile Pic
          </Text>
          <TextInput
            style={tw`text-center text-xl pb-2`}
            placeholder="Enter a Profile Pic URL"
            value={image}
            onChangeText={(text) => setImage(text)}
          />

          <Text style={tw`text-center p-4 font-bold text-red-400`}>
            Step 2: The Job
          </Text>
          <TextInput
            style={tw`text-center text-xl pb-2`}
            placeholder="Enter your occupation"
            value={job}
            onChangeText={(text) => setJob(text)}
          />

          <Text style={tw`text-center p-4 font-bold text-red-400`}>
            Step 3: The Age
          </Text>
          <TextInput
            style={tw`text-center text-xl pb-2`}
            placeholder="Enter your age"
            value={age}
            onChangeText={(text) => setAge(text)}
            keyboardType="numeric"
            maxLength={2}
          />
          <TouchableOpacity
            disabled={incompleteForm}
            style={[
              tw`w-64 p-3 rounded-full mt-20`,
              incompleteForm ? tw`bg-gray-400` : tw`bg-red-400`,
            ]}
            onPress={updateUserProfile}
          >
            <Text style={tw`text-center text-white text-xl font-bold`}>
              Update Profile
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default ModalScreen;
