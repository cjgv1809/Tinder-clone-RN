import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Foundation, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";

const Header = ({ title, callEnabled }) => {
  const navigation = useNavigation();

  return (
    <View style={tw`flex-row p-2 items-center justify-between`}>
      <View style={tw`flex flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2`}>
          <Ionicons name="chevron-back-outline" size={34} color="#FF5864" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold`}>{title}</Text>
      </View>

      {callEnabled && (
        <TouchableOpacity style={tw`rounded-full mr-4 p-3 bg-red-200`}>
          <Foundation name="telephone" size={20} color="#FF5864" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
