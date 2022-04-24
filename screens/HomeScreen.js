import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Image,
  TouchableOpacity,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import useAuth from "../hooks/useAuth";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-deck-swiper";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import generateId from "../lib/generateId";

const DUMMY_DATA = [
  {
    firstName: "Bill",
    lastName: "Gates",
    job: "Software Engineer",
    photoURL:
      "https://media.revistagq.com/photos/613dcacc55410d2ed6954ee0/4:3/w_2382,h_1786,c_limit/GettyImages-850154658.jpg",
    age: 25,
    id: 1,
  },
  {
    firstName: "Elon",
    lastName: "Musk",
    job: "Software Developer",
    photoURL:
      "https://upload.wikimedia.org/wikipedia/commons/8/85/Elon_Musk_Royal_Society_%28crop1%29.jpg",
    age: 40,
    id: 2,
  },
  {
    firstName: "Steve",
    lastName: "Jobs",
    job: "Software Developer",
    photoURL:
      "https://lovingvalencia.com/wp-content/uploads/2022/02/4c53a6e58157cb17acffdc092ac5f642.jpg",
    age: 30,
    id: 3,
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const swipeRef = useRef(null);

  useLayoutEffect(() => {
    const unsub = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (!snapshot.exists()) {
        navigation.navigate("Modal");
      }
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    let unsub;

    const fetchCards = async () => {
      const passes = await getDocs(
        collection(db, "users", user.uid, "passes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const swipes = await getDocs(
        collection(db, "users", user.uid, "swipes")
      ).then((snapshot) => snapshot.docs.map((doc) => doc.id));

      const passedUserIds = passes.length > 0 ? passes : ["test"];
      const swipedUserIds = swipes.length > 0 ? swipes : ["test"];

      unsub = onSnapshot(
        query(
          collection(db, "users"),
          where("id", "not-in", [...passedUserIds, ...swipedUserIds])
        ),
        (snapshot) => {
          setProfiles(
            snapshot.docs
              .filter((doc) => doc.id !== user.uid)
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
          );
        }
      );
    };

    fetchCards();
    return () => unsub();
  }, [db]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const swipeLeft = (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];

    setDoc(doc(db, "users", user.uid, "passes", userSwiped.id), userSwiped);
  };

  const swipeRight = async (cardIndex) => {
    if (!profiles[cardIndex]) return;

    const userSwiped = profiles[cardIndex];
    const loggedInProfile = await (await getDoc(db, "users", user.uid)).data();

    // Check if the user swiped on you...
    getDoc(doc(db, "users", userSwiped.id, "swipes", user.uid)).then(
      (documentSnapshot) => {
        if (documentSnapshot.exists()) {
          // user has matched with you before you matched with them...
          console.log(`${userSwiped.displayName} has matched with you!`);
          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );
          // Create a match
          setDoc(doc(db, "matches", generateId(user.uid, userSwiped.id)), {
            users: {
              [user.uid]: loggedInProfile,
              [userSwiped.id]: userSwiped,
            },
            usersMatched: [user.uid, userSwiped.id],
            timestamp: serverTimestamp(),
          });

          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped,
          });
        } else {
          // user has swiped as first interaction between the two or didnt get swiped on...
          console.log(
            `You swiped on ${userSwiped.displayName} ${userSwiped.job}`
          );
          setDoc(
            doc(db, "users", user.uid, "swipes", userSwiped.id),
            userSwiped
          );
        }
      }
    );
  };

  return (
    <SafeAreaView style={tw`flex-1 pb-5 pt-8`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-5 relative`}>
        <TouchableOpacity onPress={logout}>
          <Image
            source={{ uri: user.photoURL }}
            style={tw`w-10 h-10 rounded-full`}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
          <Image
            source={{
              uri: "https://raw.githubusercontent.com/thidkyar/tinder-clone-app/main/src/images/logo.png",
            }}
            style={tw`h-14 w-14`}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="chatbubbles-sharp" size={30} color="#FF5864" />
        </TouchableOpacity>
      </View>
      {/* End of header */}

      {/* Cards */}
      <View style={tw`flex-1 -mt-10`}>
        <Swiper
          ref={swipeRef}
          containerStyle={{ backgroundColor: "transparent" }}
          cards={profiles}
          stackSize={5}
          cardIndex={0}
          animateCardOpacity
          verticalSwipe={false}
          onSwipedLeft={(cardIndex) => {
            swipeLeft(cardIndex);
          }}
          onSwipedRight={(cardIndex) => {
            swipeRight(cardIndex);
          }}
          backgroundColor="#4FD0E9"
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  textAlign: "right",
                  color: "red",
                },
              },
            },
            right: {
              title: "LIKE",
              style: {
                label: {
                  textAlign: "left",
                  color: "green",
                },
              },
            },
          }}
          renderCard={(card) =>
            card ? (
              <View
                key={card.id}
                style={tw`bg-white h-3/4 rounded-xl relative`}
              >
                <Image
                  style={tw`h-full w-full rounded-xl absolute top-0`}
                  source={{ uri: card.photoURL }}
                />

                <View
                  style={[
                    tw`absolute bottom-0 flex-row justify-between items-center px-6 py-2 bg-white w-full h-20 rounded-b-xl`,
                    styles.cardShadow,
                  ]}
                >
                  <View>
                    <Text style={tw`font-bold text-xl`}>
                      {card.displayName}
                    </Text>
                    <Text style={tw`font-semibold text-gray-500`}>
                      {card.job}
                    </Text>
                  </View>
                  <Text style={tw`font-bold text-2xl`}>{card.age}</Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  tw`relative bg-white h-3/4 rounded-xl justify-center items-center`,
                  styles.cardShadow,
                ]}
              >
                <Text style={tw`font-bold pb-5`}>No more profiles</Text>
                <Image
                  style={tw`h-20 w-full`}
                  resizeMode="contain"
                  source={{ uri: "https://links.papareact.com/6gb" }}
                />
              </View>
            )
          }
        />
      </View>

      <View style={tw`flex flex-row justify-evenly`}>
        <TouchableOpacity
          style={tw`items-center justify-center rounded-full w-16 h-16 bg-red-200`}
          onPress={() => {
            swipeRef.current.swipeLeft();
          }}
        >
          <Entypo name="cross" size={24} color="red" />
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`items-center justify-center rounded-full w-16 h-16 bg-green-200`}
          onPress={() => {
            swipeRef.current.swipeRight();
          }}
        >
          <AntDesign name="heart" size={24} color="green" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
