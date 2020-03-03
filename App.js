import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text } from "react-native";
import { ListItem } from "react-native-elements";
import { makeServer } from "./server";

if (process.env.NODE_ENV === "development") {
  if (window.server) {
    window.server.shutdown();
  }
  window.server = makeServer();
}

export default App = () => {
  let [users, setUsers] = useState([]);
  let [serverError, setServerError] = useState();

  useEffect(() => {
    let fetchUsers = async () => {
      try {
        let res = await fetch("/api/users");
        let data = await res.json();
        data.error ? setServerError(data.error) : setUsers(data.users);
      } catch (error) {
        setServerError(error.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {serverError ? (
        <Text testID="server-error">{serverError}</Text>
      ) : users.length === 0 ? (
        <Text testID="no-users">No users!</Text>
      ) : (
        <View>
          {users.map(user => (
            <ListItem
              testID={`user-${user.id}`}
              key={user.id}
              leftAvatar={{ source: { uri: user.avatarUrl } }}
              title={user.name}
              titleProps={{ testID: `user-${user.id}-name` }}
              subtitle={user.title}
              bottomDivider
              chevron
            />
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};
